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
          <el-button type="primary">搜索文件</el-button>
        </el-col>
        <el-col :span="8">
          <el-upload
            :action="uploadActionUrl"
            show-file-list="false"
            :on-change="beforUpload"
            :data="{ mid: this.mid }"
            :headers="headers"
            name="filename"
            :on-success="upsuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-col>
      </el-row>

      <!-- 列表 ：data绑定数据源  prop从数据源中取值-->
      <el-table stripe border style="width: 100%" :data="file_list_prepare">
        <el-table-column type="index">
          <!-- <template slot-scope="scope">
            <img
              :src="'http://192.168.2.104:8000/' + scope.row.image"
              min-width="40"
              height="40"
            />
          </template> -->
        </el-table-column>
        <el-table-column align="center" label="文件名" width="300" prop="Dname">
          <!-- 图片的显示 -->
        </el-table-column>
        <el-table-column
          label="文件大小(kb)"
          width="100"
          prop="Dsize"
        ></el-table-column>

        <el-table-column label="是否可下载" width="120">
          <!-- scope.row包含这一行的数据 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Dstatus"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="上传时间"
          width="149"
          prop="Dtime"
        ></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" size="mini" @click="open(scope.row)"
              >打开</el-button
            >
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="del_file(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 底部区域 -->
  </div>
</template>

<script>
// 引入money过滤组件
import { toBit } from '../../filter/two'
export default {
  data() {
    return {
      mid: window.sessionStorage.getItem('mid'),
      file_list_prepare: [],
      //   上传地址
      uploadActionUrl: this.$url.get_fileList,
      //   上传附带数据
      data: {},
      //   上传请求头
      headers: { token: window.sessionStorage.getItem('token') }
    }
  },
  // 过滤器
  filters: {
    BitFilter(money) {
      return toBit(money)
    }
  },
  created() {
    console.log(this.mid)
    const that = this
    this.$http
      .get(that.$url.get_fileList, {
        params: {
          role: 'manage',
          mid: that.mid
        }
      })
      .then(res => {
        if (res.data.msg === 'ok') {
          that.file_list_prepare = res.data.data
          console.log(that.file_list_prepare)
          that.file_list_prepare.forEach(el => {
            el.Dsize = (el.Dsize / 1024).toFixed(2)
          })
        }
      })
      .catch()
  },
  methods: {
    // 打开文件
    open(e) {
      // this.$router.push({ path: './barrage-landscape.vue', query: { file: e } })
      this.$router.push({
        path: './interactive_wall',
        query: { file: e }
      })
    },
    //   上传成功
    upsuccess(respond) {
      console.log(respond)
      respond.data.Dsize = (respond.data.Dsize / 1024).toFixed(2)
      this.file_list_prepare.push(respond.data)
      console.log(this.file_list_prepare)
    },
    // 删除文件
    del_file(e) {
      const that = this
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .delete(this.$url.get_fileList, {
              params: { mid: e.meeting, fid: e.id }
            })
            .then(res => {
              console.log(res)
              if (res.data.msg === 'ok') {
                that.file_list_prepare = that.file_list_prepare.filter(el => {
                  return el.id !== e.id
                })
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                console.log(that.file_list_prepare)
              }
            })
          console.log(e)
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped></style>
