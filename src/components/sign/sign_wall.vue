<template>
  <div class="s_wall">
    <el-dialog
      :before-close="handleDialogClose"
      title="签到墙"
      :visible="wall_open"
      width="70%"
      center
    >
      <div class="contaner flex-r">
        <div class="avator" v-for="(item, index) in sign_list" :key="index">
          <img
            :src="'http://192.168.2.104:8000/media/' + item"
            height="100px"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 一个签到墙组件
export default {
  data() {
    return {
      key: 'd'
    }
  },
  methods: {
    handleDialogClose() {
      // 当关闭时,自定义一个wall_change事件,把wall_open的值传回给父组件
      this.$emit('wall_change', false)
    }
  },
  props: {
    sign_list: {
      type: Array
    },
    wall_open: {
      type: Boolean
    }
  }
}
</script>

<style lang="less" scoped>
.contaner {
  width: 90%;
  height: 500px;
  margin: 0 auto;
  overflow: scroll;
  flex-flow: row wrap;
  background-color: black;
  align-content: flex-start;
  .avator {
    width: 100px;
    height: 100px;
    padding: 7px;
  }
}
.contaner::-webkit-scrollbar {
  display: none;
}
</style>
