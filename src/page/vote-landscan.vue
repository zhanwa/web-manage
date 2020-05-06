<template>
  <div class="vote_wall">
    <!--为echarts准备一个具备大小的容器dom-->
    <div id="main" style="width: 600px;height: 400px;"></div>
    <div style="width:300px ;margin:0 auto;text-align:center">
      实时更新中,请勿刷新页面
    </div>
  </div>
</template>

<script>
import Url from '../unit/serve.config'
import echarts from 'echarts'
export default {
  data() {
    return {
      votelist: [],
      //   投票标识符
      vote_id: this.$route.query.vote_id,
      charts: '',
      opinion: [],
      opinionData: [
        { name: '好', value: 335 },
        { value: 310, name: '不好' }
      ],
      // 实时数据
      rt_data: {},
      // 临时存储的数据
      tem: {},
      obj: { aa87fdd7222d684934a24bcb636b1488b6: '好' }
    }
  },
  created() {
    console.log('我创建了')
    let index = 0
    const timer = setInterval(() => {
      if (index < 10) {
        this.$socket.sendObj({ contant: this.obj })
        setTimeout(() => {
          this.$socket.sendObj({
            contant: { aa87fdd7222d684934a24bcb636b1488b6: '不好' }
          })
        }, 500)
        index += 1
      } else {
        clearInterval(timer)
      }
    }, 2000)
  },
  mounted() {
    this.onmessage()
    this.$nextTick(function() {
      this.$http
        .get(Url.get_voteList, {
          params: {
            type: 'getonevote',
            vote_id: this.vote_id
          }
        })
        .then(res => {
          console.log('我开始选人了')
          if (res.data.msg === 'ok') {
            this.votelist = this.convertKey(res.data.data)
            console.log(this.votelist)
            this.votelist.forEach(el => {
              this.opinion.push(el.name)
              console.log(this.opinion)
              // 如果临时数据存在,就加上一起显示
              if (this.tem) {
                for (const k in this.tem) {
                  if (el.name === k) {
                    el.value = el.value + parseInt(this.tem[k])
                  }
                }
              }
            })
          }
          this.drawPie('main')
        })
    })
  },
  watch: {},
  methods: {
    // 监听websock
    onmessage() {
      this.$options.sockets.onmessage = data => {
        console.log('我在监听')
        this.rt_data = JSON.parse(data.data).contant
        for (const key in this.rt_data) {
          //  substr 方法用于返回一个从指定位置开始的指定长度的子字符串。
          const keys = key.substr(2)
          console.log(keys)
          if (this.vote_id === keys) {
            // eslint-disable-next-line camelcase
            const option_id = this.rt_data[key] // 选项序号
            console.log(option_id)
            if (this.votelist) {
              console.log('votelist:' + this.votelist)
              this.votelist.forEach(el => {
                // eslint-disable-next-line camelcase
                if (el.name === option_id) {
                  el.value = parseInt(el.value) + 1
                }
              })
              this.drawPie('main')
            } else {
              if (this.tem) {
                this.tem[option_id] += 1
              } else {
                this.tem[option_id] = 1
              }
            }
          }
        }
        console.log(this.tem)
      }
    },
    // 改变对象的key
    convertKey(arr) {
      const newArr = []
      arr.forEach((item, index) => {
        const newObj = {}
        newObj.name = item.option
        newObj.value = item.result ? parseInt(item.result) : 0
        newArr.push(newObj)
      })
      return newArr
    },

    drawPie(id) {
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a}<br/>{b}:{c} ({d}%)'
        },
        center: ['50%', '50%'],
        legend: {
          orient: 'vertical',
          x: 'left',
          data: this.opinion
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '50%',
            data: this.votelist
          }
        ]
      })
    },
    init() {
      this.$http
        .get(Url.get_voteList, {
          params: {
            type: 'getonevote',
            vote_id: this.vote_id
          }
        })
        .then(res => {
          if (res.data.msg === 'ok') {
            this.votelist = this.convertKey(res.data.data)
            this.votelist.forEach(el => {
              if (el.value === 0) {
                el.value = 10
              }
            })
            console.log(this.votelist)
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
#main {
  margin: 0 auto;
}
</style>
