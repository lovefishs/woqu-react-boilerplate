const proxy = (server = '0.0.0.0', port = '') => {
  // see: https://doc.webpack-china.org/configuration/dev-server/#devserver-proxy
  const mockServer = `http://${server}${port === '' ? '' : (':' + port)}`

  return {
    '/api': {
      target: mockServer,
    },
  }
}

module.exports = proxy
