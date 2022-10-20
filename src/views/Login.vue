<template>
  <div class="login-wrapper" :style="'background-image:url('+ Background +')'">
    <div class="form-box">
      <div class="form-title">
        <el-page-header style="margin-bottom: 15px" @back="goBack" title="首页"></el-page-header>
        <img src="../assets/img/logo.png" alt="icon">
        <p>用 户 登 录</p>
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-width="0px" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="请输入账号" prefix-icon="el-icon-user" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="请输入密码" prefix-icon="el-icon-lock" @keyup.enter.native="handleLogin" />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" size="small" type="primary" style="width:45%;" @click.native.prevent="handleLogin">
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
          <el-button size="small" style="width:45%; margin-left: 10%;" @click="to_register">
            <span>去注册</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from '../api/login'
import { setToken } from '../utils/cookie'
import Background from '../assets/img/login-background.png'

export default {
  name: 'Login',
  data() {
    return {
      Background,
      loginForm: {
        username: 'duing',
        password: '123456',
        rememberMe: true
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }]
      },
      loading: false,
      // redirect: "/"
    }
  },
  // watch: {
  //   $route: {
  //     handler: function(route) {
  //       this.redirect = route.query && route.query.redirect
  //     },
  //     immediate: true
  //   }
  // },
  methods: {
    to_register(){
      this.$router.push({
          name: "Register"
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        // const data = new FormData()
        // data.append("username", this.loginForm.username)
        // data.append("password", this.loginForm.password)
        const data = {
          username: this.loginForm.username,
          password: this.loginForm.password
        }
        if (valid) {
          this.loading = true
          login(data).then(res => {
            this.loading = false
            this.$message({
              type: 'success',
              message: '登陆成功!'
            })
            setToken(res.data.token)
            this.$store.commit("user/storeUserInfo", res.data.user_info)
            this.$router.push({ path: "/" })
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    goBack(){
      this.$router.push({ path: '/' })
    },
  }
}
</script>

<style lang="less">
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-size: cover;
  .form-box {
    width: 320px;
    padding: 15px 30px 20px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 15px 30px 0 rgba(0, 0, 1, .1);
    .form-title {
      margin: 0 auto 35px;
      text-align: center;
      color: #707070;
      font-size: 18px;
      letter-spacing: 2px;
    }
  }
}
</style>
