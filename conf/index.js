const { resolve } = require('path')
const { NODE_ENV, PORT, HMR, MINI } = process.env

const ENV_PRODUCTION = 'production'
const ENV_DEVELOPMENT = 'development'
const ENV = NODE_ENV || ENV_DEVELOPMENT

const SERVER_DEV_HOST = '0.0.0.0'
const SERVER_DEV_PORT = PORT || 3000
const SERVER_MOCK_HOST = '0.0.0.0'
const SERVER_MOCK_PORT = SERVER_DEV_PORT + 1

const PATH_SERVER = 'server'
const PATH_SOURCE = 'src'
const PATH_TEST = 'test'
const PATH_DIST = 'dist'
const PATH_DEV = 'dist'

const conf = {
  // ENV
  env: ENV,
  env_dev: ENV === ENV_DEVELOPMENT,
  hmr: HMR ? true : false,
  minimize: MINI ? true : false,

  // Server Configuration
  server_dev_host: SERVER_DEV_HOST,
  server_dev_port: SERVER_DEV_PORT,
  server_mock_host: SERVER_MOCK_HOST,
  server_mock_port: SERVER_MOCK_PORT,

  // Project Structure
  path_server: PATH_SERVER,
  path_source: PATH_SOURCE,
  path_test: PATH_TEST,
  path_dist: PATH_DIST,
  path_dev: PATH_DEV,

  // Compiler Configuration
  compiler_public_path: '',
  compiler_source_maps: false,
}

conf.globals = {
  'NODE_ENV': JSON.stringify(conf.env),
  'process.env.NODE_ENV': JSON.stringify(conf.env),
  '__HMR__': conf.hmr,
  '__DEV__': conf.env === ENV_DEVELOPMENT,
  '__PROD__': conf.env === ENV_PRODUCTION,
}

module.exports = conf
