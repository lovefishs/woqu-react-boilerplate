const Mock = require('mockjs')

class DataCenter {
  constructor () {}

  build (id = 0) {
    return Mock.mock({
      data: {
        id: parseInt(id, 10),
        name: 'admin',
        group: 'default',
        email: 'mail@woqutech.com',
        'mobile|1': ['15258888888', '15259999999'],
        create_time: new Date(),
        token: /[a-z]{3}-[A-Z]{3}-[0-9]{3}/,
      },
    })
  }
}

module.exports = new DataCenter()
