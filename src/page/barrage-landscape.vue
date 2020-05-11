<template>
  <div id="wall" style="height:100vh">
    <el-button class="switch" @click="open">打开弹幕</el-button>
    <div class="danmu">
      <vue-baberrage
        :isShow="barrageIsShow"
        :barrageList="barrageList"
        :loop="barrageLoop"
      >
      </vue-baberrage>
    </div>
    <iframe :src="doc" frameborder="0" width="100%" height="100%"></iframe>
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
      barrageIsShow: false,
      currentId: 0,
      // 弹幕是否循环
      barrageLoop: false,
      // 弹幕列表
      barrageList: [],
      type: MESSAGE_TYPE.NORMAL,
      // 保存socket
      socket: '',
      // 文件路径
      doc: ''
    }
  },
  methods: {
    // 打开弹幕
    open() {
      this.barrageIsShow = true
    },
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
  created() {
    const file = this.$route.query.file
    console.log(file)
    this.doc = 'http://192.168.2.104:8000/' + file.Dnewpath
    console.log(this.doc)
  },
  mounted() {
    console.log('haha')
    this.$nextTick(() => {
      this.__init()
    })
  },
  beforeDestroy() {
    this.socket.close()
  }
}
</script>

<style lang="less" scoped>
.switch {
  position: absolute;
  left: 0;
  top: 20px;
}
</style>
