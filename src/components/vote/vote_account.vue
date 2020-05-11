<template>
  <div class="container">
    <el-table :data="votelist" style="width: 100%">
      <el-table-column label="题目" width="180" prop="question">
      </el-table-column>
      <el-table-column label="选项(票数)" width="180">
        <template slot-scope="scope">
          <el-popover placement="right" width="200" trigger="click">
            <el-table :data="scope.row.choices">
              <el-table-column
                width="100"
                property="option"
                label="选项"
              ></el-table-column>
              <el-table-column
                width="100"
                property="result"
                label="票数"
              ></el-table-column>
            </el-table>
            <el-button slot="reference" style="border:none"
              >{{ scope.row.choices[0].option }}({{
                scope.row.choices[0].result
              }})</el-button
            >
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      votelist: [],
      mid: window.sessionStorage.getItem('mid')
    }
  },
  created() {
    this.getuserlist()
  },
  methods: {
    async getuserlist() {
      const that = this
      const { data: res } = await this.$http.get(this.$url.get_voteList, {
        params: {
          mid: that.mid
        }
      })
      console.log(res)
      if (res.msg === 'ok') {
        this.votelist = res.data
        this.votelist.map(res => {
          res.choices.map(re => {
            if (!re.result) {
              re.result = 0
            }
          })
        })
        console.log(this.votelist)
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
