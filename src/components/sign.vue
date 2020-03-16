<template>
  <div>
    我是签到页
  </div>
</template>

<script>
import Url from '../unit/serve.config'
export default {
  created() {
    this.sign_init()
  },
  methods: {
    async sign_init() {
      const { data: res } = await this.$http.get(Url.get_sign, {
        params: {
          m_id: window.sessionStorage.getItem('mid')
        }
      })
      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped></style>
