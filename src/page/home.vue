<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div class="logol">
        <div class="user_message flex-c">
          <img src="../assets/logo.png" alt="图标" />
          <p>{{ meeting_detail.m_title }}</p>
        </div>
        <h2>会议实时互动管理系统</h2>
      </div>
      <el-button type="info" @click="loginout">后退</el-button>
      <el-button type="info" @click="startwall()">互动墙</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 左边 -->
      <el-aside :width="meun_width">
        <!-- 点击收缩菜单栏 -->
        <div class="toggle_menu" @click="toggle_menu">|||</div>
        <!-- 菜单
        router为菜单开启路由模式
        default-active 为子菜单保持高亮显示
        -->
        <el-menu
          :collapse-transition="false"
          :unique-opened="true"
          :collapse="iscollaps"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
          :default-active="binpath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="list.id + ''"
            v-for="list in listMenuLists"
            :key="list.id"
          >
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ list.authName }}</span>
            </template>
            <!-- 二级菜单 开启菜单router这时候index就是跳转地址-->
            <el-menu-item-group>
              <el-menu-item
                :index="'/' + listc.path"
                v-for="listc in list.children"
                :key="listc.id"
                @click="getpath('/' + listc.path)"
              >
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{ listc.authName }}</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 导航列表
      listMenuLists: [
        {
          id: 1,
          authName: '人员管理',
          path: 'null',
          children: [
            {
              id: 1,
              authName: '报名列表',
              path: 'sign'
            },
            {
              id: 2,
              authName: '签到列表',
              path: 'sign_list'
            }
          ]
        },
        {
          id: 2,
          authName: '抽奖管理',
          path: 'null',
          children: [
            {
              id: 1,
              authName: '抽奖',
              path: 'lottery'
            },
            {
              id: 2,
              authName: '中奖人员',
              path: 'lottery_zhong'
            }
          ]
        },
        {
          id: 3,
          authName: '投票管理',
          path: 'null',
          children: [
            {
              id: 1,
              authName: '投票列表',
              path: 'vote_list'
            },
            {
              id: 2,
              authName: '结果统计',
              path: 'vote_account'
            }
          ]
        },
        {
          id: 4,
          authName: '文件管理',
          path: 'null',
          children: [
            {
              id: 1,
              authName: '管理员上传文件',
              path: 'file'
            },
            {
              id: 2,
              authName: '用户上传文件',
              path: 'others'
            }
          ]
        },
        {
          id: 5,
          authName: '会议数据',
          path: 'null',
          children: [
            {
              id: 1,
              authName: '会议信息',
              path: 'meeting_message'
            },
            {
              id: 2,
              authName: '评论评分',
              path: 'comment'
            },
            {
              id: 3,
              authName: '会议公告',
              path: 'announce'
            }
          ]
        }
      ],
      meeting_detail: {},
      // 是否折叠
      iscollaps: false,
      meun_width: '200px',
      // 被激活的链接
      binpath: ''
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    getpath(path) {
      this.binpath = path
    },
    loginout() {
      // 清空seecton,没有了seection只有再次扫码登录
      window.sessionStorage.clear()
      this.$router.go(-1)
    },
    toggle_menu() {
      this.iscollaps = !this.iscollaps
      if (!this.iscollaps) return (this.meun_width = '200px')
      this.meun_width = '60px'
    },
    async getMenuList() {
      const mid = window.sessionStorage.getItem('mid')
      const { data: res } = await this.$http.get('meetingapi/v1/getmeeting/', {
        params: {
          mid: mid,
          type: 'getmeetingdetail'
        }
      })
      console.log(res)
      if (res.msg !== 'ok') return this.$message.errror(res.meta.msg)
      this.meeting_detail = res.data
    },
    // 开启互动墙
    startwall() {
      this.$router.push('./interactive_wall')
    },
    // 前往直播页面
    towebrtc() {
      this.$router.push('./webrtc-room')
    }
  }
}
</script>

<style lang="less" scoped>
.home_container {
  width: 1200px;
  height: 100%;
  margin: 0 auto;
}
// 可以直接拿标签名当类名
.el-header {
  background-color: aqua;
  display: flex;
  align-items: center;
  color: white;
  .logol {
    height: 100%;
    display: flex;
    align-items: center;
    margin-right: auto;
    .user_message {
      height: 100%;
      img {
        width: 30px;
        height: 30px;
        margin-right: 15px;
      }
      p {
        margin: 0;
      }
    }
  }
}

.el-aside {
  background-color: #545c64;
}
.el-main {
  background-color: #fffff2;
}
.el-aside {
  overflow: hidden;
  .toggle_menu {
    height: 20px;
    background-color: darkorange;
    text-align: center;
    line-height: 20px;
    font-size: 0.3rem;
    cursor: pointer;
  }
  .el-menu {
    border: none;
    .el-menu-item-group__title {
      padding-top: 0 !important;
    }
  }
}
</style>
