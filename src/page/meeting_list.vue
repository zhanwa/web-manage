<template>
  <div class="list_content">
    <div class="lists">
      <div class="list flex-r" v-for="(item, index) in m_list" :key="index">
        <p>会议id:{{ item.m_id }}</p>
        <p>会议名称:{{ item.m_title }}</p>
        <p>开始时间:{{ item.b_time }}</p>
        <el-button @click="into(item.m_id)">进入</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Url from '../unit/serve.config'

export default {
  data() {
    return {
      u_id: window.sessionStorage.getItem('uid'),
      m_list: []
    }
  },
  created() {
    console.log(this.u_id, Url.meeting_list)
    // 初始化获取用户会议列表
    this.init()
  },
  methods: {
    async init() {
      const { data: res } = await this.$http.get(Url.meeting_list, {
        params: {
          u_id: this.u_id,
          opt: 'create'
        }
      })
      console.log(res)
      this.m_list = res.data
    },
    // 点击进入
    into(mid) {
      console.log('good')
      const sendData = {
        type: 'append',
        mid: mid,
        uid: this.u_id
      }
      this.$socket.sendObj(sendData)
      window.sessionStorage.setItem('mid', mid)
      this.$router.push('./home/' + mid)
    }
  }
}
</script>

<style lang="less" scoped>
.lists {
  position: relative;
  width: 80%;
  margin: 0 auto;
  top: 50px; /*偏移*/
  background-color: whitesmoke;
  .list {
    width: 80%;
    margin: 5px auto;

    p {
      margin-right: 5px;
    }
  }
}
</style>
