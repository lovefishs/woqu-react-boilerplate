const proxy = (conf) => {
  // see: https://doc.webpack-china.org/configuration/dev-server/#devserver-proxy
  const mockServer = `http://${conf.server_mock_host}:${conf.server_mock_port}`

  return {
    '/api': {
      target: mockServer,
    },
  }
}

module.exports = proxy
