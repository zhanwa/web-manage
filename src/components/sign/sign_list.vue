<template>
  <div class="container">
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            suffix-icon="el-icon-search"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="go_signwall">签到互动墙</el-button>
        </el-col>
      </el-row>

      <!-- 列表 ：data绑定数据源  prop从数据源中取值-->
      <el-table stripe border style="width: 100%" :data="sign_list">
        <el-table-column type="index"></el-table-column>
        <el-table-column align="center" label="头像" width="100" prop="image">
          <!-- 图片的显示 -->
          <template slot-scope="scope">
            <img
              :src="'http://192.168.2.104:8000/' + scope.row.image"
              min-width="40"
              height="40"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="姓名"
          width="100"
          prop="username"
        ></el-table-column>
        <el-table-column
          label="邮箱"
          width="180"
          prop="email"
        ></el-table-column>
        <el-table-column
          label="电话"
          width="120"
          prop="label2"
        ></el-table-column>
        <el-table-column label="签到状态" width="120">
          <!-- scope.row包含这一行的数据 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.sign"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="签到时间"
          width="249"
          prop="sign_time"
        ></el-table-column>
      </el-table>
    </el-card>
    <!-- 底部区域 -->
  </div>
</template>

<script>
import Url from '../../unit/serve.config'

export default {
  data() {
    return {
      ss: true,
      sign_list: []
    }
  },
  created() {
    this.sign_init()
  },
  methods: {
    // 到签到互动墙
    go_signwall() {
      this.$router.push({ path: './sign_wall', query: { vote_id: 'ddd' } })
    },
    async sign_init() {
      const { data: res } = await this.$http.get(Url.get_sign, {
        params: {
          m_id: window.sessionStorage.getItem('mid')
        }
      })
      console.log(res.data)
      this.sign_list = res.data
      res.data.forEach(el => {
        if (el.sign === null) {
          console.log(el)
          el.sign_time = null
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
