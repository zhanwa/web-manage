module.exports = {
  devServer: {
    // 自动打开浏览器
    open: true,
    // vue运行端口号
    port: 8811,
    proxy: {
      '/': {
        ws: false, // 这里把ws代理给关闭
        target: 'http://192.168.2.104:8000/',
        changeOrigin: true
      }
    }
  }
}
