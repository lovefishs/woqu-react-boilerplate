const proxy = (host = '0.0.0.0', port = '') => {
  // see: https://doc.webpack-china.org/configuration/dev-server/#devserver-proxy
  const server = `http://${host}${port === '' ? '' : (':' + port)}`

  return {
    '/api': {
      target: server,
    },
  }
}

module.exports = proxy
