<template>
  <div>
    <el-table :data="Llist" style="width: 100%">
      <el-table-column label="头像" width="180">
        <template slot-scope="scope">
          <img
            :src="'http://192.168.2.104:8000/' + scope.row.avator"
            min-width="40"
            height="40"
          />
        </template>
      </el-table-column>
      <el-table-column label="名字" width="180" prop="username">
      </el-table-column>
      <el-table-column label="奖品等级" width="180" prop="level">
      </el-table-column>
      <el-table-column label="奖品名称(数量)" width="180">
        <template slot-scope="scope">
          <div>
            {{ scope.row.award[0].award }}({{ scope.row.award[0].num }})
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      Llist: [],
      mid: window.sessionStorage.getItem('mid')
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.$http
        .get(this.$url.get_lotteryList, {
          params: {
            type: 'getall',
            mid: this.mid
          }
        })
        .then(res => {
          console.log(res)
          this.Llist = res.data.data
          this.Llist.map(res => {
            res.award = JSON.parse(res.award)
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>
