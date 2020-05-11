<template>
  <div>
    <el-table :data="comment_list" style="width: 100%">
      <el-table-column label="头像" width="180">
        <template slot-scope="scope">
          <img
            :src="'http://192.168.2.104:8000/' + scope.row.avator"
            min-width="40"
            height="40"
          />
        </template>
      </el-table-column>
      <el-table-column prop="username" label="评论人" width="180">
      </el-table-column>
      <el-table-column prop="comment" label="评论"> </el-table-column>
      <el-table-column label="评分" width="120">
        <!-- scope.row包含这一行的数据 -->
        <template slot-scope="scope">
          <el-rate
            v-model="scope.row.rate"
            disabled
            show-score
            text-color="#ff9900"
          >
          </el-rate>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: 3.3,
      comment_list: [],
      mid: window.sessionStorage.getItem('mid')
    }
  },
  created() {
    this.$http
      .get('meetingapi/v1/comment/', {
        params: {
          type: 'get',
          mid: this.mid
        }
      })
      .then(res => {
        console.log(res)
        this.comment_list = res.data.data
        this.comment_list.map(el => {
          el.rate = parseFloat(el.rate)
        })
      })
      .catch()
  }
}
</script>

<style lang="scss" scoped></style>
