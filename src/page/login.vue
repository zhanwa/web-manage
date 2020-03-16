<template>
  <div class="login">
    <div class="paycode">
      <!-- 放置二维码的容器,需要给一个ref -->
      <div id="qrcode" ref="qrcode"></div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import Url from '../unit/serve.config'
export default {
  data() {
    return {
      path: Url.wsLogin,
      socket: '',
      innerVisible: false,
      //   服务器返回的client_id
      qrcode: ''
    }
  },
  methods: {
    // 展示二维码
    payOrder() {
      this.innerVisible = true
      // 二维码内容,一般是由后台返回的跳转链接,这里是写死的一个链接
      //   this.qrcode = 'https://www.baidu.com'
      // 使用$nextTick确保数据渲染
      this.$nextTick(() => {
        this.crateQrcode()
      })
    },
    // 生成二维码
    crateQrcode() {
      this.qr = new QRCode('qrcode', {
        width: 150,
        height: 150, // 高度
        text: this.qrcode // 二维码内容
        // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
        // background: '#f0f'
        // foreground: '#ff0'
      })
      // console.log(this.qrcode)
    },
    // 关闭弹框,清除已经生成的二维码
    closeCode() {
      this.$refs.qrcode.innerHTML = ''
    },
    // 初始化websocket
    init: function() {
      if (typeof WebSocket === 'undefined') {
        alert('您的浏览器不支持socket')
      } else {
        // 实例化socket
        this.socket = new WebSocket(this.path)
        // 监听socket连接
        this.socket.onopen = this.open
        // 监听socket错误信息
        this.socket.onerror = this.error
        // 监听socket消息
        this.socket.onmessage = this.getMessage
      }
    },
    open: function() {
      console.log('socket连接成功')
      this.socket.send('goo')
    },
    error: function() {
      console.log('连接错误')
    },
    getMessage: function(msg) {
      console.log(msg.data)
      try {
        msg = JSON.parse(msg.data)
        window.sessionStorage.setItem('token', msg.token)
        window.sessionStorage.setItem('uid', msg.u_id)
        this.$router.push('/meeting_list')
      } catch {
        this.qrcode = msg.data
        this.payOrder()
      }
    },
    close: function() {
      console.log('socket已经关闭')
    }
  },
  mounted() {
    this.init()
  },
  destroyed() {
    // 销毁监听
    this.socket.close()
  }
}
</script>

<style lang="less" scoped></style>
