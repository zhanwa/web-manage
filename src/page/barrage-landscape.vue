<template>
  <div id="wall">
    <div class="danmu">
      <vue-baberrage
        :isShow="barrageIsShow"
        :barrageList="barrageList"
        :loop="barrageLoop"
      >
      </vue-baberrage>
    </div>
  </div>
</template>

<script>
import { MESSAGE_TYPE } from 'vue-baberrage'
import Url from '../unit/serve.config'
export default {
  name: 'wall',
  data() {
    return {
      // 弹幕是否展示
      barrageIsShow: true,
      currentId: 0,
      // 弹幕是否循环
      barrageLoop: false,
      // 弹幕列表
      barrageList: [],
      type: MESSAGE_TYPE.NORMAL,
      // 保存socket
      socket: ''
    }
  },
  methods: {
    __init() {
      console.log(Url.wsdanmu)
      this.__initWebSocket()
    },
    // 初始化websocket
    __initWebSocket() {
      this.socket = new WebSocket(Url.wsdanmu)
      this.socket.onmessage = this.onMessage
      this.socket.onclose = this.onClose
      this.socket.onerror = this.onError
    },
    onMessage(event) {
      const data = JSON.parse(event.data)
      console.log(data)
      this.barrageList.push({
        id: ++this.currentId,
        avatar: data.face,
        msg: data.msg,
        time: 5,
        type: this.type
      })
    },
    onError() {
      console.log('连接错误')
    },
    onClose() {
      this.socket.close()
    }
  },
  mounted() {
    this.__init()
  },
  beforeDestroy() {
    this.socket.close()
  }
}
</script>

<style lang="less" scoped></style>
