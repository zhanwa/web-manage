<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  created() {
    window.addEventListener('beforeunload', e => console.log(e))
    console.log('我刷完车')
    if (window.sessionStorage.getItem('mid')) {
      const timer = setInterval(() => {
        try {
          const sendData = {
            type: 'append',
            mid: window.sessionStorage.getItem('mid'),
            uid: window.sessionStorage.getItem('uid')
          }
          this.$socket.sendObj(sendData)
          clearInterval(timer)
        } catch {
          console.log('dddd')
        }
      }, 1000)
    }
  }
}
</script>
<style></style>
