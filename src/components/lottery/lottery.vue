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
          <el-button type="primary" @click="changDialog">增加奖项</el-button>
        </el-col>
      </el-row>

      <!-- 列表 ：data绑定数据源  prop从数据源中取值-->
      <el-table stripe border style="width: 100%" :data="lotterylist"
        >>
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="等级"
          width="100"
          prop="award_leval"
        ></el-table-column>
        <el-table-column
          label="名称"
          width="100"
          prop="award_leval"
        ></el-table-column>
        <el-table-column label="奖品(数量)" width="180">
          <template slot-scope="scope">
            <el-popover placement="right" width="200" trigger="click">
              <el-table :data="scope.row.award_name">
                <el-table-column
                  width="100"
                  property="award"
                  label="奖品"
                ></el-table-column>
                <el-table-column
                  width="100"
                  property="num"
                  label="数量"
                ></el-table-column>
              </el-table>
              <el-button slot="reference" style="border:none"
                >{{ scope.row.award_name[0].award }}({{
                  scope.row.award_name[0].num
                }})</el-button
              >
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="人数"
          width="120"
          prop="award_member"
        ></el-table-column>
        <el-table-column
          label="发起时间"
          width="240"
          prop="award_time"
        ></el-table-column>
        <el-table-column label="操作" width="180">
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
          <!-- 分配权限 -->
          <el-tooltip
            effect="dark"
            content="分配权限"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              circle
            ></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>
      <el-button @click="golottrery">去抽奖</el-button>
    </el-card>
    <!-- 修改数据对话框 -->
    <el-dialog
      title="增加抽奖"
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
          <el-form-item label="等级" prop="leval">
            <el-select v-model="addForm.leval" placeholder="请选择奖品等级">
              <el-option label="特等奖" value="特等奖"></el-option>
              <el-option label="一等奖" value="一等奖"></el-option>
              <el-option label="二等奖" value="二等奖"></el-option>
              <el-option label="三等奖" value="三等奖"></el-option>
              <el-option label="参与奖" value="参与奖"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数量" prop="number">
            <el-input v-model.number="addForm.number"></el-input>
          </el-form-item>
          <el-form-item label="奖品" prop="goods">
            <el-input v-model="addForm.goods"></el-input>
          </el-form-item>
          <el-form-item label="人数" prop="limit">
            <el-input v-model.number="addForm.limit"></el-input>
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
      // 奖项列表
      lotterylist: [],
      total: 0,
      mid: window.sessionStorage.getItem('mid')
    }
  },
  methods: {
    // 前往抽奖页
    golottrery() {
      this.$router.push({
        path: './lottery_wall',
        query: { lotteryList: this.lotterylist }
      })
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
      console.log('请求')
      const { data: res } = await this.$http.get(Url.get_lotteryList, {
        params: {
          type: 'getLotteryList',
          mid: this.mid
        }
      })
      console.log(res)
      if (res.msg === 'ok') {
        this.lotterylist = res.data
        console.log(this.lotterylist)
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

<style></style>
