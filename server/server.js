const { resolve } = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const serverStatic = require('koa-static')
const bodyParser = require('koa-bodyparser')
const qs = require('koa-qs')

// conf
const pkg  = require('../package.json')
const conf = require('../conf')
const staticPath = resolve(__dirname, '../', (conf.env_dev ? conf.path_dev : conf.path_dist))

// create app
const app = new Koa()
qs(app)
app.use(bodyParser())

// setting static path
app.use(serverStatic(staticPath, {
  gzip: !conf.env_dev,
}))

// logger
if (conf.env_dev) {
  app.use(async (ctx, next) => {
    const start = new Date

    await next()

    const ms = new Date - start
    ctx.set('X-Response-Time', `${ms}ms`)
    console.log(`${ctx.method} ${ctx.status} ${ctx.url} - ${ms}ms`)
  })
}

// router config
require('./routes/commonRouter')(new Router({
  prefix: '',
}), app)

// 404 handler
app.use(async (ctx, next) => {
  await next()

  if (404 !== ctx.status) {
    return
  }

  // we need to explicitly set 404 here
  // so that koa doesn't assign 200 on body=
  ctx.status = 404
  if (ctx.is('application/json')) {
    ctx.body = {
      error_code: 404,
      message: 'Not Found !',
      data: {},
    }
  } else {
    ctx.type = 'text/html; charset=utf-8'
    ctx.body = '<p>Page Not Found</p>'
  }
})

// server start
app.listen(conf.server_prod_port, conf.server_prod_host, (err, ctx) => {
  if (err) {
    return console.error(err)
  }

  console.log(`Listening at http://${conf.server_prod_host}:${conf.server_prod_port}/`)
})
