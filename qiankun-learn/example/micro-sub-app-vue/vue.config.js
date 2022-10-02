const { name } = require("./package");
module.exports = {
  devServer: {
    // 配置下面内容 否则主应用访问会报跨域
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    port: "3001",
  },
  configureWebpack: {
    output: {
      library: `${name}-[name]`,
      libraryTarget: "umd", // 把微应用打包成 umd 库格式
      jsonpFunction: `webpackJsonp_${name}`,
    },
  },
};
