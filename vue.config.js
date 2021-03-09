const path = require('path')
const resolve = (dir) => {
  return path.join(__dirname, dir)
}
module.exports = {
  // 修改 src 目录 为 examples 目录
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    },
  },
  css: {
    extract: false
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('examples'),
        '~': resolve('packages')
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('images')
      // .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 10 * 1024 }))
  }
};    