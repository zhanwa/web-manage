<template>
  <div class="login_contaniner">
    <div class="login_box">
      <el-tabs v-model="activeName" @tab-click="handleClick" :stretch="true">
        <el-tab-pane label="账号密码登录" name="first">
          <!-- 登录表单区域 -->
          <!-- :model板顶表单数据收，才可以使用v-modul绑定具体的值 -->
          <div class="form_login">
            <!-- :rules绑定表单校验规则 -->
            <!-- ref就是表单的实例 -->
            <el-form
              label-width="0px"
              :model="loginForm"
              :rules="loginFormRules"
              ref="loginFormRef"
            >
              <!-- 用户  prop校验-->
              <el-form-item class="user" prop="username">
                <el-input
                  placeholder="请输入账号"
                  prefix-icon="iconfont icon-ziyuan1"
                  v-model="loginForm.username"
                ></el-input>
              </el-form-item>
              <!-- 密码 -->
              <el-form-item class="pwd" prop="password">
                <el-input
                  type="password"
                  placeholder="请输入密码"
                  prefix-icon="el-icon-date"
                  v-model="loginForm.password"
                ></el-input>
              </el-form-item>
              <el-form-item class="login_btn">
                <el-button type="primary" @click="login">登录</el-button>
                <el-button type="info" @click="loginFormRefresh"
                  >重置</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="扫码登录" name="second">
          <div class="paycode">
            <!-- 放置二维码的容器,需要给一个ref -->
            <div id="qrcode" ref="qrcode"></div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import Url from '../unit/serve.config'
export default {
  data() {
    return {
      // img_path: require('../assets/logo.png'),
      path: Url.wsLogin,
      socket: '',
      innerVisible: false,
      //   服务器返回的client_id
      qrcode: '',
      // 那种登录
      activeName: 'second',
      // 表单登录数据所绑定的对象
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        // 验证用户名
        username: [
          {
            required: true,
            message: '请输入登录名称',
            trigger: 'blur'
          },
          {
            min: 0,
            max: 5,
            message: '长度0到5个字符',
            trigger: 'blur'
          }
        ],
        // 验证密码
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 6,
            message: '密码长度为6位',
            trigger: 'blur'
          }
        ]
      }
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
    },
    // 重置文本框
    loginFormRefresh() {
      this.$refs.loginFormRef.resetFields()
      this.username = {
        username: '',
        password: ''
      }
    },
    // 表达预验证
    login() {
      // valisadate对整个表单进行验证，回调函数第一个形参为布尔值
      this.$refs.loginFormRef.validate(async valid => {
        if (valid) {
          console.log(this.loginForm)
          // {data}是直接解构，{data：res}这样是解构并使用别名
          // data其实就是一个变量，指向我原来data的值
          const { data: res } = await this.$http.post(
            'api/v1/User2/',
            this.loginForm
          )
          console.log(typeof res)
          if (res.code === 200) {
            this.$message({
              message: '恭喜你，这是一条成功消息',
              type: 'success'
            })
            // 保存token信息
            window.sessionStorage.setItem('name', res.msg)

            this.$router.push('/home')
            return
          }
        }
        this.$message.error('错了哦，这是一条错误消息')
      })
    },
    // 切换tab
    handleClick(tab, event) {
      this.activeName = tab.paneName
    }
  },
  mounted() {
    // this.$socket.send(JSON.stringify('some data'))
    console.log(this)
    this.init()
  },
  beforeDestroy() {
    // 销毁监听
    this.socket.close()
  }
}
</script>

<style lang="less" scoped>
.login_contaniner {
  height: 100%;
  background: burlywood;
  .login_box {
    position: absolute;
    width: 450px;
    height: 300px;
    background-color: aliceblue;
    border-radius: 3px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .form_login {
      width: 100%;
      padding: 5px 15px;
      box-sizing: border-box;
      .login_btn {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
  .paycode {
    width: 150px;
    margin: 0 auto;
    padding-top: 20px;
  }
}
</style>
