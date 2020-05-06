<!-- lottery -->
<template>
  <div class="lottery-container">
    <div class="lottery-layout">
      <div class="lottery-main">
        <div class="lottery-user">
          <div class="lottery-tips">
            {{ maxAwardTips }}（{{ rollLen }} / {{ maxNum | editNumber }}）
          </div>
          <ul>
            <li
              class="lottery-item"
              v-for="(item, index) in rollIdArr"
              :key="index"
            >
              <div class="lottery-roll">
                <div class="roll-item"><img :src="item.face" /></div>
                <div class="roll-item">
                  <span>{{ item.naem }}</span>
                </div>
                <div class="roll-item">
                  <span>{{ item.msg }}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="lottery-btn">
        <div class="btn-func">
          <button @click="beginRoll">开始</button>
          <!-- <img v-if="style.year.show" :src="style.year.img" /> -->
          <button @click="stopRoll">抽取</button>
        </div>
      </div>
      <div class="lottery-options">
        <el-form>
          <el-form-item label="本轮奖项">
            <el-select
              @change="changeAward"
              v-model="maxAward"
              placeholder="请选择抽取奖项"
            >
              <el-option
                v-for="(item, index) in awardOptions"
                :key="index"
                :label="item.award_leval"
                :value="item.id"
              >
                <!-- 抽奖等级 -->
                <span style="float: left">{{ item.award_leval }}</span>
                <!-- 人数 -->
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.award_member | editNumber
                }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单次抽取">
            <el-select
              @change="changeTimes"
              v-model="maxTimes"
              placeholder="请选择单次抽取人数"
            >
              <el-option
                v-for="item in timesOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Url from '../unit/serve.config'
export default {
  name: 'lottery',
  data() {
    return {
      timesOptions: [
        {
          value: '1',
          label: '抽1人',
          disabled: false
        },
        {
          value: '2',
          label: '抽2人',
          disabled: false
        },
        {
          value: '3',
          label: '抽3人',
          disabled: false
        },
        {
          value: '4',
          label: '抽4人',
          disabled: false
        },
        {
          value: '5',
          label: '抽5人',
          disabled: false
        }
      ], // 单次抽取选项
      request: null, // indexDB对象
      awardOptions: [], // 奖项
      userData: [], // 总用户集合
      rollIdArr: [], // 当前抽中集合,
      award_id: '', // 当前抽奖id
      maxAwardTips: '请选择抽取奖项', // 本轮奖项名称
      maxAward: '', // 本轮奖项类别
      maxNum: '', // 本轮奖项总人数
      rollLen: 0, // 本轮已抽中用户数
      maxTimes: '5', // 单次最大抽取人数
      total: 0, // 累计所有抽中用户数
      isBegin: false, // 是否开始
      timeInterJS: null, // 滚动定时器对象
      mid: window.sessionStorage.getItem('mid'),
      socket: ''
    }
  },
  created() {
    // 取得抽奖总列表

    this.awardOptions = this.$route.query.lotteryList
    this.awardOptions.map(el => {
      el.award_member = 10
    })
    console.log(this.awardOptions)
    // 如果是签到抽奖,可以加载时获取签到信息(暂未设计)
    // this.getData(this.storeName.user, this.userData)
    // 取得奖项信息
  },
  mounted() {
    this.$nextTick(() => {
      this.__init()
    })
  },
  components: {},
  computed: {},
  beforeDestroy() {
    this.socket.close()
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
      this.userData = this.userData.concat(JSON.parse(event.data))
      // type用来区分用户是否已经中奖
      this.userData.map(el => {
        el.type = '0'
      })
      console.log(this.userData)
    },
    onError() {
      console.log('连接错误')
    },
    onClose() {
      this.socket.close()
    },
    // 1.开始滚动
    beginRoll() {
      console.log(this.userData)
      console.log(this.rollLen)
      if (!this.isBegin) {
        // 1.0选择抽取奖项
        if (!this.maxAward) {
          alert(this.maxAwardTips)
          return false
        }
        // 1.1本轮抽奖剩余人数
        const tempLast = this.maxNum - this.rollLen
        // 1.1.0若小于单次最大抽奖人数
        if (!!tempLast && tempLast < this.maxTimes) {
          this.maxTimes = tempLast.toString()
        }
        // 1.1.1若已抽完
        if (tempLast === 0) {
          alert('本轮已抽取完毕')
          return false
        }
        // 1.2抽奖池内剩余抽奖人数
        this.total = 0
        this.userData.map(item => {
          if (item.type !== '0') {
            this.total++
          }
        })
        const tempRoll = this.userData.length - this.total
        if (tempRoll <= this.maxTimes) {
          alert(`池内剩余总数${tempRoll}，不够本次抽取${this.maxTimes}！`)
          return false
        }
        // 1.3定时器滚动
        this.isBegin = true
        this.timeInterJS = setInterval(this.roll, 100)
      }
    },
    // 2.结束抽取
    stopRoll() {
      if (this.isBegin) {
        this.render()
      }
    },
    // 3.抽取结果
    render() {
      clearInterval(this.timeInterJS)
      // 3.0设置抽中人奖项并存放到localstroge中
      this.rollIdArr.map(item => {
        item.type = this.maxAward
      })
      // 3.1更新已抽中人数数目
      this.rollLen += this.rollIdArr.length
      // 3.3回传中奖数据
      const temp = this.rollIdArr
        .map(item => {
          return item.naem
        })
        .join(',')
      window.localStorage.setItem('result', JSON.stringify(temp))
      // 3.4重置开关
      this.isBegin = false
      console.log(this.rollIdArr)
    },
    // 4.滚动主要函数
    roll() {
      // 4.0先清空抽中集合数组
      this.rollIdArr = []
      // 4.1更新抽中集合
      while (this.rollIdArr.length < this.maxTimes) {
        const rnd = this.getRand()
        const obj = this.userData[rnd]
        // if (obj.type === '0' && !this.findInArr(this.rollIdArr, obj)) {
        //   this.rollIdArr.push(obj)
        // }
        if (obj.type === '0') {
          this.rollIdArr.push(obj)
        }
      }
    },
    // 5.去除已抽取观众(这是一轮抽取去取的观众,因为每次都是随机抽,可能抽到相同的人,所以加这一步来过滤一下) 这里CompleteID可以用uid来替换
    findInArr(arr, obj) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].CompleteID === obj.CompleteID) {
          return true
        }
      }
      return false
    },
    // 6.随机比例返回抽取结果
    getRand() {
      return Math.floor(Math.random() * this.userData.length)
    },
    // 7.修改单次抽取个数
    changeTimes(val) {
      const rnd = this.getRand()
      // 这个是中间的那些抽奖用户表,就是随机抽val个放到上面显示而已,没其他用
      this.rollIdArr = this.userData.slice(rnd, rnd + Number(val))
    },
    // 8.修改奖项及本轮人数
    changeAward(id) {
      console.log(id)
      this.award_id = id
      // 8.0重置本轮已抽取奖项人数
      this.rollLen = 0
      // 8.1本轮奖项总人数
      this.awardOptions.map(item => {
        // 找到id相同的即为当前所选奖项
        if (item.id === id) {
          this.maxNum = item.award_member ? item.award_member : '99'
          this.maxAwardTips = item.award_leval
          // 8.1.1本轮总人数小于单次抽取人数
          if (Number(this.maxNum) < Number(this.maxTimes)) {
            this.maxTimes = this.maxNum
            this.changeTimes(this.maxTimes)
          }
        }
      })

      // 8.2单次可供抽取人数
      this.timesOptions.map((item, index) => {
        if (Number(item.value) > Number(this.maxNum)) {
          item.disabled = true
        } else {
          item.disabled = false
        }
      })
    }
  },
  watch: {
    // 监听是否读取数据完成，并初始化显示抽取集合
    userData(val) {
      this.rollIdArr = this.userData.slice(0, this.maxTimes)
    }
  },
  filters: {
    // 考虑其他奖项抽取人数未定，默认可抽99人
    editNumber(val) {
      if (val && val !== '99') {
        return `${val}人`
      } else {
        return '自选'
      }
    }
  }
}
</script>

<style lang="less">
// .lottery-options {
//   .el-form-item__label {
//     color: rgba(227, 183, 27, 0.9);
//   }
//   .el-input__inner {
//     background-color: rgba(138, 9, 0, 0.6);
//     color: rgba(227, 183, 27, 0.9);
//     border: none;
//   }
// }
//
</style>

<style lang="less" scoped>
@baseColor: rgba(227, 183, 27, 0.9);
.lottery-container {
  height: 100%;
  overflow: hidden;
  position: relative;
  .lottery-layout {
    position: relative;
    width: 100%;
    height: 100%;
    .lottery-main {
      width: 66%;
      position: absolute;
      left: 50%;
      top: 25%;
      transform: translate3d(-50%, 0, 0);
      z-index: 2;
      .lottery-item {
        height: 7.6vh;
        line-height: 7.6vh;
        margin-top: 1%;
        text-align: center;
        // background-image: url(../assets/images/roll.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        overflow: hidden;
        position: relative;
        .lottery-roll {
          display: flex;
          .roll-item {
            width: 20%;
            font-size: 3.6vh;
            display: flex;
            justify-content: center;
            align-items: center;
            &:last-child {
              width: 40%;
            }
            span {
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
            img {
              border-radius: 50%;
              height: 5.6vh;
              border: 1px solid #ccc;
            }
          }
        }
      }
      .lottery-tips {
        font-size: 3vh;
        color: @baseColor;
        text-align: center;
        margin-bottom: 2%;
      }
    }
    .lottery-btn {
      position: absolute;
      width: 66%;
      left: 50%;
      bottom: 12%;
      transform: translate3d(-50%, 0, 0);
      z-index: 2;
      .btn-func {
        padding: 0 15%;
        display: flex;
        justify-content: space-around;
        button {
          //   background-image: url(../assets/images/button.png);
          background-repeat: no-repeat;
          background-size: cover;
          background-position-x: -4px;
          color: #fff;
          padding: 1vh 3.6vh;
          margin: 0 1%;
          font-size: 2.6vh;
          border-radius: 7px;
          outline: none;
          cursor: pointer;
          &:hover {
            color: rgba(227, 183, 27, 0.9);
          }
        }
      }
    }
    .lottery-options {
      position: absolute;
      width: 7%;
      left: 1%;
      bottom: 1%;
      color: @baseColor;
      font-size: 1.8vh;
      z-index: 1;
      .el-form-item__label {
        color: rgba(227, 183, 27, 0.9);
      }
      .el-input__inner {
        background-color: rgba(138, 9, 0, 0.6);
        color: rgba(227, 183, 27, 0.9);
        border: none;
      }
    }
    .lottery-prize {
      position: absolute;
      left: 12%;
      bottom: 7%;
      z-index: 1;
      img {
        width: 18%;
        display: inline-block;
      }
      p {
        display: inline-block;
        vertical-align: bottom;
        font-size: 1.6vh;
        color: @baseColor;
      }
    }
    .lottery-rule {
      position: absolute;
      right: -6vw;
      bottom: 7vh;
      color: @baseColor;
      z-index: 1;
      img {
        width: 18%;
        float: left;
        margin-right: 2%;
      }
      .lottery-txt {
        overflow: hidden;
        font-size: 1.6vh;
        line-height: 1.4;
      }
    }
  }
}
</style>
