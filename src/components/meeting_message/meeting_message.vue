<template>
  <div class="comment">
    <el-form label-width="80px">
      <el-form-item label="会议标题">
        <el-input :value="t_value" @input="chang_title"></el-input>
      </el-form-item>
      <el-form-item label="人数限制">
        <el-input :value="limit" @input="chang_limit"></el-input>
      </el-form-item>
      <el-form-item label="会议秘钥">
        <el-input :value="s_value" @input="chang_secret"></el-input>
      </el-form-item>
      <el-form-item label="会议地点">
        <el-input :value="l_value" @input="chang_location"></el-input>
      </el-form-item>
      <el-form-item label="开始日期">
        <el-input :value="start_date" @input="etime_change"></el-input>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-input :value="start_time" @input="ctime_change"></el-input>
      </el-form-item>
      <el-form-item label="结束日期">
        <el-input :value="stop_date" @input="stime_change"></el-input>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-input :value="stop_time" @input="btime_change"></el-input>
      </el-form-item>
      <el-form-item label="会议简介">
        <el-input :value="d_value" @input="content_change"></el-input>
      </el-form-item>
    </el-form>
    <div class="but" style="margin:0 auto;width:30px">
      <el-button @click="chang">修改</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const currentDate = this.getDate({
      format: true
    })
    return {
      m_detail: {},
      mid: window.sessionStorage.getItem('mid'),
      uid: window.sessionStorage.getItem('uid'),
      // 开始日期
      start_date: currentDate,
      // 开始时间
      start_time: '12:01',
      // 结束日期
      stop_date: currentDate,
      // 结束时间
      stop_time: '12:01',
      // 标题
      t_value: '',
      // 秘钥
      s_value: '',
      // 位置
      l_value: '',
      // 描述
      d_value: '',
      // 人数限制
      limit: ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    getDate(type) {
      const date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()

      if (type === 'start') {
        year = year - 60
      } else if (type === 'end') {
        year = year + 2
      }
      month = month > 9 ? month : '0' + month
      day = day > 9 ? day : '0' + day
      return `${year}-${month}-${day}`
    },
    chang() {
      console.log(this.d_value, this.limit, this.start_date, this.start_time)

      this.$http
        .put('meetingapi/v1/setmeeting/', {
          mid: this.mid,
          title: this.t_value,
          dec: this.d_value,
          serect: this.s_value,
          location: this.l_value,
          limit: this.limit,
          start_date: this.start_date,
          start_time: this.start_time,
          stop_date: this.stop_date,
          stop_time: this.stop_time
        })
        .then(res => {
          console.log(res)
          if (res.data.msg === 'ok') {
            this.$message({
              message: '恭喜你，这是一条成功消息',
              type: 'success'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 标题改变
    chang_title(e) {
      console.log(e)
      this.t_value = e
      console.log(e)
    },
    // 人数限制改变
    chang_limit(e) {
      this.limit = e
    },
    // 会议秘钥改变
    chang_secret(e) {
      this.s_value = e
    },
    // 位置改变
    chang_location(e) {
      this.l_value = e
    },
    // 开始日期改变
    etime_change(e) {
      this.start_date = e
    },
    // 开始事时间
    ctime_change(e) {
      this.start_time = e
    },
    // 结束时间改变
    stime_change(e) {
      this.stop_date = e
    },
    btime_change(e) {
      this.stop_time = e
    },
    // 会议简介
    content_change(e) {
      this.d_value = e
    },
    async init() {
      const that = this

      const { data: res } = await this.$http.get('meetingapi/v1/getmeeting/', {
        params: {
          mid: that.mid,
          type: 'getmeetingdetail'
        }
      })
      console.log(res)
      if (res.msg !== 'ok') return this.$message.errror(res.meta.msg)
      this.m_detail = res.data
      this.t_value = this.m_detail.m_title
      this.s_value = this.m_detail.vcontent
      this.l_value = this.m_detail.m_place
      this.d_value = this.m_detail.m_content
      this.limit = this.m_detail.limits
      this.style = this.m_detail.gcontent
      this.start_date = this.m_detail.e_time
      this.start_time = this.m_detail.c_time
      this.stop_date = this.m_detail.s_time
      this.stop_time = this.m_detail.b_time
    }
  }
}
</script>

<style lang="scss" scoped></style>
