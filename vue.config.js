const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  productionSourceMap: false, // 生产环境不生成 .map
  transpileDependencies: true,
  devServer: {
    client: {
      overlay: false
    },
    proxy: {
      '/adminapi': {
        target: 'http://localhost:3080',
        changeOrigin: true
      }
    }
  }
})
