<template>
  <el-dropdown class="user-avatar-wrapper" @command="handleCommand">
    <div v-if="!token">
      <el-link type="primary" :underline="false" @click="goLogin">去登陆</el-link>
    </div>
    <div v-else>
      <div class="avatar-box">
        <el-avatar size="small" :src="avatarSrc" />
        <i class="el-icon-caret-bottom" />
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>用户:{{username}}</el-dropdown-item>
        <el-dropdown-item command="userMessage">我的消息</el-dropdown-item>
        <el-dropdown-item command="userGroup">我的群组</el-dropdown-item>
        <el-dropdown-item command="userCenter">个人信息</el-dropdown-item>
        <el-dropdown-item command="loginOut">注销登录</el-dropdown-item>
      </el-dropdown-menu>
    </div>
  </el-dropdown>
</template>

<script>
import { removeToken } from '../../utils/cookie'
import { getToken } from '../../utils/cookie'

export default {
  name: 'UserAvatar',
  data() {
    return {
      token: getToken(),
      avatarSrc: this.$store.state.user.avatar,
      username: this.$store.state.user.username,
    }
  },
  methods: {
    handleCommand(command) {
      if (command === 'userMessage') {
        this.$router.push({ name: 'MessageList' })
      }
      if (command === 'userGroup') {
        this.$router.push({ name: 'UserGroupList' })
      }
      if (command === 'userCenter') {
        this.$router.push({ name: 'UserCenter' })
      }
      if (command === 'loginOut') {
        this.loginOut()
      }
    },
    loginOut() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeToken()
        this.$store.commit("user/removeUserInfo")
        location.reload()
      })
    },
    goLogin(){
      this.$router.push({
          name: "Login"
      })
    }
  }
}
</script>

<style lang="less">
.user-avatar-wrapper {
  float: left;
  width: 48px;
  padding: 3px 0 3px 20px;
  margin-left: 20px;
  border-left: solid 1px #ddd;
  cursor: pointer;
  .avatar-box {
    outline: none;
  }
  .el-avatar--small {
    display: inline-block;
    vertical-align: middle;
    width: 32px;
    height: 32px;
    line-height: 32px;
  }
  i {
    display: inline-block;
    vertical-align: middle;
    margin-left: 2px;
  }
}
</style>
