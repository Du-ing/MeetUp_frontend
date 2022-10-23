<template>
  <div class="login-wrapper" :style="'background-image:url('+ Background +')'">
    <div class="form-box">
      <div class="form-title">
        <el-page-header style="margin-bottom: 15px" @back="goBack" title="首页"></el-page-header>
        <img src="../assets/img/logo.png" alt="icon">
        <p>用 户 注 册</p>
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-width="0px" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="请输入账号" prefix-icon="el-icon-user" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="请输入密码" prefix-icon="el-icon-lock" @keyup.enter.native="handleLogin" />
        </el-form-item>
        <!-- <el-form-item>
          <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
        </el-form-item> -->
        <el-form-item>
          <el-button :loading="loading" size="small" type="primary" style="width:45%;" @click.native.prevent="handleRegister">
            <span v-if="!loading">注册</span>
            <span v-else>注 册 中...</span>
          </el-button>
          <el-button size="small" style="width:45%; margin-left: 10%;" @click="to_login">
            <span>去登陆</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { register } from '../api/login'
import { setToken } from '../utils/cookie'
import Background from '../assets/img/register-background.png'

export default {
  name: 'Login',
  data() {
    return {
      Background,
      loginForm: {
        username: undefined,
        password: undefined,
        // rememberMe: true
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
    to_login(){
      this.$router.push({
          name: "Login"
      })
    },
    handleRegister() {
      this.$refs.loginForm.validate(valid => {
        const data = {
          username: this.loginForm.username,
          password: this.loginForm.password
        }
        if (valid) {
          this.loading = true
          register(data).then(res => {
            this.$message({
              type: 'success',
              message: '注册成功，请登录！'
            })
            this.$router.push({ name: "Login" })
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
