<template>
  <div class="comment">
    <el-button @click="announce" class="btn" type="warning">发布公告</el-button>
    <el-timeline v-for="(item, index) in aList" :key="index">
      <el-timeline-item :timestamp="item.Atime" placement="top">
        <el-card>
          <h4>更新会议公告</h4>
          <p>{{ item.Acontent }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <el-dialog
      title="发布公告"
      :visible.sync="announces"
      width="50%"
      center
      :lock-scroll="false"
    >
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="textarea"
      >
      </el-input>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      announces: false,
      textarea: '',
      mid: window.sessionStorage.getItem('mid'),
      //   公告列表
      aList: []
    }
  },
  created() {
    const that = this

    this.$http
      .get(this.$url.comment, {
        params: {
          mid: this.mid
        }
      })
      .then(res => {
        if (res.data.msg === 'ok') {
          that.aList = res.data.data.reverse()
          console.log(that.aList)
        }
      })
  },
  methods: {
    resetForm() {
      this.textarea = ''
    },
    // 提交表单
    submitForm() {
      const that = this

      this.$http
        .post(this.$url.comment, {
          mid: this.mid,
          announce: this.textarea
        })
        .then(res => {
          console.log(res)
          if (res.data.mag === 'ok') {
            that.textarea = ''
            that.announces = false
            that.aList = res.data.data.reverse()
          }
        })
    },
    // 发公告
    announce() {
      this.announces = true
      console.log('eee')
    }
  }
}
</script>

<style lang="less" scoped>
.comment {
  position: relative;

  .btn {
    position: absolute;
    top: -18px;
    right: 0;
  }
}
</style>
