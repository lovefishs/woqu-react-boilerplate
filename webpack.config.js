const fs = require('fs')
const { resolve } = require('path')

const webpack = require('webpack')
const atImport = require('postcss-import')
const cssnext = require('postcss-cssnext')
const precss = require('precss')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

const { HotModuleReplacementPlugin, DefinePlugin, NamedModulesPlugin, HashedModuleIdsPlugin } = webpack
const { CommonsChunkPlugin, ModuleConcatenationPlugin, UglifyJsPlugin } = webpack.optimize

const conf = require('./conf')
const proxy = require('./proxy')

const CHUNK_MANIFEST = 'manifest'
const CHUNK_VENDOR = 'vendor'
const CHUNK_COMMON = 'common'

// Create multiple instances
const extractVendorCSS = new ExtractTextPlugin('vendor.[chunkhash].css')
const extractStyleCSS = new ExtractTextPlugin('style.[chunkhash].css')
const extractModuleCSS = new ExtractTextPlugin('module.[chunkhash].css')

/**
 * build entry & plugins
 * @param  {String} path   源码目录绝对路径
 * @return {Object} result entry 对象与 html plugins 数组
 */
const getEntryAndPlugins = (path, isDEV, isHMR, isMini) => {
  const result = {
    entry: {},
    plugins: [],
  }

  // 1. build entry
  for (const file of fs.readdirSync(path)) {
    // 'index.jsx'.match(/(.+)\.(js|jsx)$/) => ["index.jsx", "index", "jsx"]
    const match = file.match(/(.+)\.(js|jsx)$/)

    if (match && match.length === 3) {
      result.entry[match[1]] = [resolve(path, file)]

      if (isDEV && isHMR) {
        // 开发环境且启用了 HMR
        result.entry[match[1]].unshift('react-hot-loader/patch')
      }
    }
  }

  // 2. build html plugins
  for (const file of fs.readdirSync(path)) {
    // 'index.html'.match(/(.+)\.(html)$/) => ["index.html", "index", "html"]
    const match = file.match(/(.+)\.(html)$/)

    if (match && match.length === 3) {
      const options = {
        filename: file,
        template: resolve(path, file),
        inject: false,
        chunks: [],
      }

      if (result.entry[match[1]]) {
        // 如果存在对应入口，需要插入 chunk
        const entryChunks = [CHUNK_MANIFEST, CHUNK_VENDOR, CHUNK_COMMON, match[1]]

        Object.assign(options, {
          inject: 'body',
          chunks: entryChunks,
          chunksSortMode: function (chunk1, chunk2) {
            // 保证 chunk 的插入顺序
            return entryChunks.indexOf(chunk1.names[0]) - entryChunks.indexOf(chunk2.names[0])
          },
        })
      }

      if (!isDEV && isMini) {
        // 非 dev 模式且启用压缩
        Object.assign(options, {
          minify: {
            collapseWhitespace: true,
            removeComments: true,
          },
        })
      }

      result.plugins.push(new HtmlWebpackPlugin(options))
    }
  }

  const chunks = Object.keys(result.entry)

  if (chunks.length !== 0) {
    const commonsChunkPlugins = [
      new CommonsChunkPlugin({
        name: CHUNK_VENDOR,
        chunks: chunks,
        minChunks: function (module) {
          return module.context && module.context.indexOf('node_modules') !== -1
        },
      }),
      new CommonsChunkPlugin({
        name: CHUNK_COMMON,
        chunks: chunks,
        minChunks: function (module, count) {
          return chunks.length === count && module.context && module.context.indexOf('node_modules') === -1
        },
      }),
      new CommonsChunkPlugin({
        name: CHUNK_MANIFEST,
        chunks: [CHUNK_VENDOR, CHUNK_COMMON, ...chunks],
      }),
    ]

    result.plugins = [...commonsChunkPlugins, ...result.plugins]
  }

  if (isDEV && isHMR) {
    result.plugins.unshift(new HotModuleReplacementPlugin())

    result.plugins.push(new NamedModulesPlugin()) // HMR 时直接返回模块名而不是模块 id
  } else if (!isDEV) {
    // 启用 Scope Hoisting(作用域提升，会与 HMR 冲突，所以放在 build 阶段用以优化代码)
    // https://zhuanlan.zhihu.com/p/27980441
    result.plugins.push(new ModuleConcatenationPlugin())

    if (isMini) {
      // --optimize-minimize 选项会开启 UglifyJsPlugin，但默认的 UglifyJsPlugin 配置并没有把代码压缩到最小输出，还是有注释和空格，需要覆盖默认的配置
      // http://lisperator.net/uglifyjs/compress
      result.plugins.push(new UglifyJsPlugin({
        beautify: false, // 最紧凑的输出
        comments: false, // 删除所有的注释
        compress: {
          warnings: false,
          conditionals: true, // 优化 if-s 与条件表达式
          unused: true, // 丢弃未使用的变量与函数
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
        },
      }))

      // https://webpack.js.org/plugins/hashed-module-ids-plugin/
      result.plugins.push(new HashedModuleIdsPlugin())

      // 启用 gzip 压缩(需要服务端配合配置): https://doc.webpack-china.org/plugins/compression-webpack-plugin/
      result.plugins.push(new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|css|html)$/,
        threshold: 10 * 1024,
        minRatio: 0.8,
      }))
    }
  }

  return result
}

const getConfig = (conf) => {
  const output = conf.env_dev ? conf.path_dev : conf.path_dist
  const outputPath = resolve(__dirname, output)
  const sourcePath = resolve(__dirname, conf.path_source)
  const nodeModulesPath = resolve(__dirname, 'node_modules')
  const copyPluginPaths = [
    { from: resolve(sourcePath, 'libs'), to: 'libs' },
    { from: resolve(sourcePath, 'assets'), to: 'assets' },
  ]
  const postCssPlugins = [
    atImport({
      path: [sourcePath, nodeModulesPath],
    }),
    precss(),
    cssnext(),
  ] // precss in front of cssnext !
  const entryAndPlugins = getEntryAndPlugins(sourcePath, conf.env_dev, conf.hmr, conf.minimize)

  const config = {
    target: 'web',
    devtool: conf.env_dev ? 'cheap-module-eval-source-map' : conf.compiler_source_maps,
    entry: entryAndPlugins.entry,
    output: {
      path: outputPath,
      filename: conf.env_dev ? '[name].js' : '[name].[chunkhash].js',
      chunkFilename: conf.env_dev ? 'chunk.[name].js' : 'chunk.[name].[chunkhash].js',
      publicPath: conf.compiler_public_path,
    },
    resolve: {
      modules: [sourcePath, nodeModulesPath],
      mainFields: ['browser', 'jsnext:main', 'module', 'main'], // why 'browser': https://github.com/webpack/webpack-dev-server/issues/727
      extensions: ['.js', '.jsx', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          include: sourcePath,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                // In Babel 7, transform-decorators-legacy will be the default plugin in Stage-0.
                // 升级到 babel 7 使用 stage-0 后清除 babel-plugin-transform-decorators-legacy 插件
                // v7.0.0-alpha.15 (2017-07-11)
                presets: [['env', { modules: false }], 'react'],
                // presets: ['stage-0', 'react'],
                plugins: (() => {
                  // 装饰器插件的位置顺序非常重要，see: https://github.com/mobxjs/mobx/issues/105
                  const plugins = ['transform-decorators-legacy', 'transform-decorators', 'syntax-dynamic-import', 'transform-class-properties', 'transform-runtime']

                  if (conf.env_dev && conf.hmr) {
                    plugins.unshift('react-hot-loader/babel')
                  }

                  return plugins
                })(),
              },
            },
          ],
        },
        {
          // 只适配通过 import 方式导入的外部 css 库(不能适配 css 中的 @import 语法)
          test: /\.css$/,
          include: nodeModulesPath,
          exclude: sourcePath,
          use: (() => {
            const baseUse = [
              { loader: 'style-loader' },
              { loader: 'css-loader', options: {} },
            ]

            if (conf.env_dev) {
              return baseUse
            } else {
              baseUse.shift() // remove style-loader

              if (conf.minimize) {
                Object.assign(baseUse[0].options, { minimize: true })
              }

              return extractVendorCSS.extract({
                fallback: 'style-loader',
                use: baseUse,
              })
            }
          })(),
        },
        {
          test: /^((?!module).)*\.css$/,
          use: (() => {
            const baseUse = [
              { loader: 'style-loader' },
              { loader: 'css-loader', options: {} },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: postCssPlugins,
                },
              },
            ]

            if (conf.env_dev) {
              return baseUse
            } else {
              baseUse.shift() // remove style-loader

              if (conf.minimize) {
                Object.assign(baseUse[0].options, { minimize: true })
              }

              return extractStyleCSS.extract({
                fallback: 'style-loader',
                use: baseUse,
              })
            }
          })(),
        },
        {
          test: /\.module\.css$/,
          include: sourcePath,
          use: (() => {
            const baseUse = [
              { loader: 'style-loader' },
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  camelCase: true,
                  localIdentName: '[local]__[hash:base64:8]', // [path][name]__[local]--[hash:base64:8]
                  importLoaders: 1,
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: postCssPlugins,
                },
              },
            ]

            if (conf.env_dev) {
              return baseUse
            } else {
              baseUse.shift() // remove style-loader

              if (conf.minimize) {
                Object.assign(baseUse[0].options, { minimize: true })
              }

              return extractModuleCSS.extract({
                fallback: 'style-loader',
                use: baseUse,
              })
            }
          })(),
        },
        {
          test: /\.(jpe?g|png|gif|bmp)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 1024, // 1k
                name: `assets/imgs/[name]${conf.env_dev ? '' : '.[hash:base64:8]'}.[ext]`,
              },
            },
          ],
        },
        {
          test: /\.(woff2?|eot|ttf|otf|svg)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10 * 1024, // 10k
                name: `assets/fonts/[name]${conf.env_dev ? '' : '.[hash:base64:8]'}.[ext]`,
              },
            },
          ],
        },
      ],
    },
    plugins: (() => {
      const commonPlugins = [
        new CopyWebpackPlugin(copyPluginPaths, {
          ignore: [ '.DS_Store', 'Thumbs.db', '.gitkeep' ], // 忽略文件
          copyUnmodified: false, // hot-dev 时只复制有修改的文件
        }),
        new DefinePlugin(conf.globals),
      ]

      if (!conf.env_dev) {
        // build 阶段清除 output 目录
        commonPlugins.unshift(new CleanWebpackPlugin([output], {
          root: resolve(__dirname), // webpack.config.js 文件的根路径
          verbose: true, // 输出 log 到 console
          dry: false, // true 时会不删除任何东西(测试用)
        }))
      }

      return conf.env_dev ? [...commonPlugins, ...entryAndPlugins.plugins] : [...commonPlugins, extractVendorCSS, extractStyleCSS, extractModuleCSS, ...entryAndPlugins.plugins]
    })(),
    devServer: {
      host: conf.server_dev_host,
      port: conf.server_dev_port,
      inline: conf.hmr, // true 会启用 inline mode，一段处理实时重载的脚本被插入到 bundle 中(页面会自动刷新)
      hot: conf.hmr, // 推荐与 inline: true 一起配置
      contentBase: outputPath,
      publicPath: conf.compiler_public_path,
      compress: true,
      noInfo: false,
      overlay: true,
      clientLogLevel: 'none',
      stats: 'minimal',
      headers: {},
      proxy: proxy(conf.server_prod_host, conf.server_prod_port),
    },
  }

  return config
}

module.exports = getConfig(conf)
