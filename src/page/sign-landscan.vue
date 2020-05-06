<template>
  <div class="sign_wall">
    <div class="code_sign">
      <el-switch
        v-model="value_code"
        active-text="二维码签到"
        @change="codechange(value_code)"
        active-value="code"
        inactive-value="1"
      >
      </el-switch>
      <el-button
        v-if="mark"
        @click="createcode()"
        :disabled="btnStatus == 1 ? true : false"
        >生成二维码</el-button
      >
    </div>
    <div class="iswall">
      <el-switch
        v-model="value_wall"
        active-text="是否显示签到墙"
        @change="if_opend(value_wall)"
        active-value="wall"
        :inactive-value="0"
      >
      </el-switch>
      <!-- 放置二维码的容器,需要给一个ref -->
    </div>
    <!-- 放置二维码的容器,需要给一个ref -->
    <div
      id="qrcode"
      ref="qrcode"
      v-if="mark"
      style="z-index:9999;position:relative;padding:10px;width:150px"
    ></div>
    <!-- 父组件监听子组件变化 ,档子组件变化触发wall_change函数-->
    <sign-wall
      :wall_open="signWall_flag"
      :sign_list="sign_list"
      @wall_change="wall_change"
    ></sign-wall>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import SignWall from '../components/sign/sign_wall'
export default {
  components: { SignWall },
  data() {
    return {
      // 按钮标志
      btnStatus: 0,
      // 控制签到墙
      value_wall: false,
      // 控制二维码
      value_code: false,
      // 是否生成二维码标志
      mark: false,
      // 二维码内容
      qrcode: window.sessionStorage.getItem('mid'),
      qr: '',
      //   是否打开签到墙
      signWall_flag: false,
      sign_list: []
    }
  },
  methods: {
    // 展示二维码// 生成二维码
    createcode() {
      // 二维码内容,一般是由后台返回的数据
      // this.getcode()
      // 使用$nextTick确保数据渲染
      this.$nextTick(() => {
        if (this.qr) {
          this.$refs.qrcode.innerHTML = ''
        }
        this.crateQrcode()
        this.btnStatus = 1
      })
    },
    // 后取后台生成的二维码标志
    // async getcode(){
    //   let {data:res} = this.$http.get()
    // },
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
    // 是否二维码签到
    codechange(res) {
      console.log(res)
      if (res === 'code') {
        this.mark = true
      } else {
        this.mark = false
        this.btnStatus = 0
      }
    },
    // 是否打开签到墙
    if_opend(value) {
      //   判断value是否等于wall,是打开
      if (value === 'wall') {
        console.log('打开')
        this.signWall_flag = true
      } else if (value === '0') {
        console.log('关闭')
        this.signWall_flag = false
      }
    },
    // 签到墙关闭时触发
    wall_change(e) {
      console.log(e)
      this.signWall_flag = e
      this.value_wall = e
    },
    // 初始化抓取签到数据
    async sign_init() {
      const { data: res } = await this.$http.get(this.$url.get_sign, {
        params: {
          m_id: window.sessionStorage.getItem('mid'),
          type: 'signin'
        }
      })
      console.log(res.data)
      // 如果存在,就不要直接覆盖
      if (this.sign_list) {
        this.sign_list = [...this.sign_list, ...res.data]
      } else {
        this.sign_list = res.data
      }
      console.log(this.sign_list)
    }
  },
  created() {
    let index = 0

    const timer = setInterval(() => {
      if (index < 50) {
        this.$socket.sendObj({
          type: 'vote',
          avator: 'avatarImg/371da8ba838f11ea82bb708bcd17d977.jpg'
        })
        index += 1
      } else {
        clearInterval(timer)
      }
    }, 2000)
    this.sign_init()
  },
  mounted() {
    //   监听签到
    this.$options.sockets.onmessage = data => {
      console.log(data)
      this.sign_list.push(JSON.parse(data.data).avator)
      console.log(this.sign_list)
    }
  }
}
</script>

<style lang="less" scoped>
.code_sign {
  height: 50px;
  line-height: 50px;
}
</style>
