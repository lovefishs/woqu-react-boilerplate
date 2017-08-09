// const Mock = require('mockjs')
const sleep = require('../utils/sleep')

module.exports = (router, app) => {
  app
    .use(router.routes())
    .use(router.allowedMethods())


  // 用户登录
  router.get('/user/:userId', async (ctx, next) => {
    // const query = ctx.query
    const params = ctx.params
    // const data = ctx.request.body
    const result = {
      message: '',
      error_code: 0,
      data: {
        id: params.userId,
        name: 'admin',
        group: 'default',
        email: 'mail@woqutech.com',
        mobile: '152xxxxxxxx',
        create_time: '2016-12-28 05:19:06',
        token: 'xxx-yyy-zzz',
      },
    }

    await sleep(1000)

    ctx.body = result
  })
}
