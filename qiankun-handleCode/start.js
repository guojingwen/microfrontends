const Koa = require('koa');
const serve = require('koa-static');
const path = require('path');
const fs = require('fs');

const app = new Koa();

// 主应用 
app.use(serve(path.resolve(__dirname, './example/micro-main-app/build')));
// 子应用 资源文件
const app1Files = serve(path.resolve(__dirname, './example/micro-sub-app-vue/dist/'));
app.use(async function (ctx, next) {
    if (/^\/app-vue\//.test(ctx.req.url) && path.extname(ctx.req.url)) { // 加载子应用资源
        ctx.req.url = ctx.req.url.replace(/\/app-vue/, '')
        return await app1Files.apply(this, [ctx, next])
      } else { // 前端路由都走主应用
        let text = await new Promise((resolve, reject) => {
          fs.readFile(path.resolve(__dirname, './example/micro-main-app/build/index.html'), 'utf-8', function (error, data) {
            if (error) return reject(error)
            resolve(data)
          })
        })
        ctx.body = text
        next()
      }
})

app.listen(8000, () => {
    console.log('app start at port 8000');
})
