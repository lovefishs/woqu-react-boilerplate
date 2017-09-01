const sleep = require('../utils/sleep')

module.exports = (router, app) => {
  app
    .use(router.routes())
    .use(router.allowedMethods())


  // get user information
  router.get('/user/:id(\\d+)', async (ctx) => {
    // const query = ctx.query
    const params = ctx.params
    // const data = ctx.request.body
    const data = require('./data/common/user_id_get').build(params.id)

    await sleep(500)

    ctx.body = {
      data,
      message: '',
      error_code: 0,
    }
  })
}
