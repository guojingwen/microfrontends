const Koa = require('koa');
const serve = require('koa-static');
const path = require('path');
const fs = require('fs');

const app = new Koa();

// 主应用 
app.use(serve(path.resolve(__dirname, './main')));
// 子应用
const app1Files = serve(path.resolve(__dirname, './app1'));
app.use(async function (ctx, next) {
    if (/^\/app1\//.test(ctx.req.url) && path.extname(ctx.req.url)) {
        ctx.req.url = ctx.req.url.replace(/\/app1/, '')
        return await app1Files.apply(this, [ctx, next])
      } else { // 前端路由都走主应用
        let text = await new Promise((resolve, reject) => {
          fs.readFile(path.resolve(__dirname, './main/index.html'), 'utf-8', function (error, data) {
            if (error) return reject(error)
            resolve(data)
          })
        })
        ctx.body = text
        next()
      }
})

// app.use(async function (ctx, next) {
//     ctx.body = `<h2>hello koa!</h2>`
//     next();
// })
app.listen(8000, () => {
    console.log('app start at port 8000');
})