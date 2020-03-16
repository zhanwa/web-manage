// 端口配置文件
const baseUrl = 'http://192.168.2.104:8000/'
const wsBaseurl = 'ws://192.168.2.104:8000/'
const Url = {
  login: baseUrl + 'index', // 首页信息
  wsLogin: wsBaseurl + 'userapi/wslogin/web/',
  meeting_list: baseUrl + 'meetingapi/v1/setmeeting/',
  get_sign: baseUrl + 'meetingapi/v1/sign/'
}
export default Url
