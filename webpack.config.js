const fs = require('fs')
const { resolve } = require('path')

const webpack = require('webpack')
const atImport = require('postcss-import')
const cssnext = require('postcss-cssnext')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin  = require('copy-webpack-plugin')

const { HotModuleReplacementPlugin, DefinePlugin } = webpack
const { CommonsChunkPlugin, ModuleConcatenationPlugin, UglifyJsPlugin } = webpack.optimize

const conf = require('./conf')
const proxy = require('./proxy')

const CHUNK_MANIFEST = 'manifest'
const CHUNK_VENDOR = 'vendor'
const CHUNK_COMMON = 'common'

// Create multiple instances
const extractCSS = new ExtractTextPlugin('styles.[chunkhash].css')
const extractModuleCSS = new ExtractTextPlugin('styles.module.[chunkhash].css')

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
          // console.log(module.context, ' - count: ', count)

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
  } else if (!isDEV && isMini) {
    // --optimize-minimize 选项会开启 UglifyJsPlugin，但默认的 UglifyJsPlugin 配置并没有把代码压缩到最小输出，还是有注释和空格，需要覆盖默认的配置
    result.plugins.push(new UglifyJsPlugin({
      beautify: false, // 最紧凑的输出
      comments: false, // 删除所有的注释
      compress: {
        warnings: false,
        unused: true,
        dead_code: true,
      },
    }))
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
    cssnext(),
  ]
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
                presets: [['env', { modules: false }], 'react'],
                plugins: (function () {
                  const plugins = ['transform-runtime', 'syntax-dynamic-import', 'transform-class-properties']

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
          test: /^((?!module).)*\.css$/,
          use: (function () {
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

              return extractCSS.extract({
                fallback: 'style-loader',
                use: baseUse,
              })
            }

            return []
          })(),
        },
        {
          test: /\.module\.css$/,
          include: sourcePath,
          use: (function () {
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

            return []
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
    plugins: (function () {
      const commonPlugins = [
        new CleanWebpackPlugin([output], {
          root: resolve(__dirname), // webpack.config.js 文件的根路径
          verbose: true, // 输出 log 到 console
          dry: false, // true 时会不删除任何东西(测试用)
        }),
        new CopyWebpackPlugin(copyPluginPaths, {
          ignore: [ '.DS_Store', 'Thumbs.db', '.gitkeep' ], // 忽略文件
          copyUnmodified: false, // hot-dev 时只复制有修改的文件
        }),
        new DefinePlugin(conf.globals),
        new ModuleConcatenationPlugin(),
      ]
      const plugins = conf.env_dev ? [...commonPlugins, ...entryAndPlugins.plugins] : [...commonPlugins, extractCSS, extractModuleCSS, ...entryAndPlugins.plugins]

      return plugins
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
      proxy: proxy(conf.server_mock_host, conf.server_mock_port),
    },
  }

  return config
}

module.exports = getConfig(conf)
