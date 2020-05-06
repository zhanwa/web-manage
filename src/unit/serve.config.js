// 端口配置文件
const baseUrl = 'http://192.168.2.104:8000/'
const wsBaseurl = 'ws://192.168.2.104:8000/'
const mid = window.sessionStorage.getItem('mid')
const uid = window.sessionStorage.getItem('uid')
const Url = {
  wsLogin: wsBaseurl + 'userapi/wslogin/web/', // 签到的websocket
  wsdanmu: wsBaseurl + `meetingapi/chat/web/${mid}/${uid}`, // 弹幕
  meeting_list: baseUrl + 'meetingapi/v1/setmeeting/', // 获取我的会议列表
  get_sign: baseUrl + 'meetingapi/v1/sign/', // 获取签到名单
  get_lotteryList: baseUrl + 'meetingapi/v1/lottery/', // 获取奖品列表
  get_voteList: baseUrl + 'meetingapi/v1/vote/', // 获取投票列表
  get_fileList: baseUrl + 'meetingapi/v1/file/', // 获取文件列表
  global_wss: wsBaseurl + 'userapi/wss/'
}
export default Url
