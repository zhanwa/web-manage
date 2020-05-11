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
          <el-button type="primary" @click="changDialog">添加投票</el-button>
        </el-col>
      </el-row>

      <!-- 列表 ：data绑定数据源  prop从数据源中取值-->
      <el-table stripe border style="width: 100%" :data="votelist">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="题目">
                <span>{{ props.row.question }}</span>
              </el-form-item>
              <el-form-item
                v-for="(option, index) in props.row.choices"
                :key="index"
                label="选项"
              >
                <span>{{ option.option }}</span>
              </el-form-item>
              <el-form-item label="发起时间">
                <span>{{ props.row.time }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="题目"
          width="240"
          prop="question"
        ></el-table-column>
        <el-table-column
          label="发起时间"
          width="180"
          prop="time"
        ></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="props">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
            ></el-button>
            <el-button @click="govote(props.row.flag)" type="mini"
              >去投票</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 修改数据对话框 -->
    <el-dialog
      title="增加投票"
      :visible.sync="addDialogVisible"
      width="50%"
      center
      :lock-scroll="false"
    >
      <!-- 内容主题区域 -->
      <span>
        <el-form
          label-width="80px"
          :model="addForm"
          :rules="addFormRules"
          ref="editForRef"
        >
          <el-form-item label="题目" prop="number">
            <el-input v-model.number="addForm.number"></el-input>
          </el-form-item>
          <el-form-item label="选项" prop="goods">
            <el-input v-model="addForm.goods"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Url from '../../unit/serve.config'

export default {
  data() {
    return {
      // 添加抽奖表单数据
      addForm: {
        leval: '',
        number: '',
        goods: '',
        limit: ''
      },
      // 添加用户验证规则
      addFormRules: {
        leval: [
          {
            required: true,
            message: '请选择奖品等级',
            trigger: 'blur'
          }
        ],
        number: [
          {
            required: true,
            message: '数量不能为空',
            trigger: 'blur'
          },
          {
            type: 'number',
            message: '奖品数量必须为数字值',
            trigger: 'blur'
          }
        ],
        goods: [
          {
            required: true,
            message: '请输入奖品名称',
            trigger: 'blur'
          }
        ],
        limit: [
          {
            required: true,
            message: '中奖人数不能为空',
            trigger: 'blur'
          },
          {
            type: 'number',
            message: '中奖人数必须为数字值',
            trigger: 'blur'
          }
        ]
      },
      // 修改数据对话框状态
      addDialogVisible: false,
      queryInfo: {
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      votelist: [],
      total: 0,
      mid: window.sessionStorage.getItem('mid')
    }
  },
  methods: {
    // 前往投票页
    govote(flag) {
      this.$router.push({ path: './vote_wall', query: { vote_id: flag } })
    },
    //   重置表单
    resetForm() {
      this.$refs.editForRef.resetFields()
    },
    // 提交表单
    submitForm() {
      this.$refs.editForRef.validate(vali => {
        if (vali) {
          this.lotterylist = this.lotterylist.concat(this.addForm)
          window.localStorage.setItem(
            'awaws' + this.mid,
            JSON.stringify(this.lotterylist)
          )
          console.log(this.lotterylist)
          this.addDialogVisible = false
        } else {
          console.log('err')
          return false
        }
      })
    },
    async getuserlist() {
      const { data: res } = await this.$http.get(Url.get_voteList, {
        params: {
          mid: this.mid
        }
      })
      console.log(res)
      if (res.msg === 'ok') {
        this.votelist = res.data
        console.log(this.votelist)
      }
    },
    // 监听pagesize改变
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      // 要重新发起请求来跟新页面
      this.getuserlist()
    },
    // 监听 页码值改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getuserlist()
    },
    // 监听状态开关
    user_status_change(data) {
      // this.$http.put('userList', { data: { user: data } })
    },
    // 监听添加用户，弹出对话框
    changDialog() {
      this.addForm = {
        leval: '',
        number: '',
        goods: '',
        limit: ''
      }
      this.addDialogVisible = true
    }
  },
  created() {
    this.getuserlist()
  },
  mounted() {
    const awaws = window.localStorage.getItem('awaws' + this.mid)
    console.log(JSON.parse(awaws))
  }
}
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
