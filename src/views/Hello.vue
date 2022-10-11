<template>
    <div class="hello">
        <el-container>
            <el-header>
                <el-menu
                :default-active="activeIndex"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelect"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b">
                    <el-menu-item index="1"><a @click="to_login" target="_blank">注册</a></el-menu-item>
                    <el-menu-item index="2"><a @click="to_login" target="_blank">登陆</a></el-menu-item>    
                </el-menu>
            </el-header>
            <el-main class="el-main">
                <el-image
                    style="width: 100%"
                    src="https://whuthycgzh.cloud/app_files/demo/hello.png"
                    :fit="fill">
                </el-image>
            </el-main>
            <el-footer>
                <p>底部</p>
            </el-footer>
        </el-container>
    </div>
  </template>
  
  <script>
  import { getUserInfo } from '../api/login'
  import { getToken } from '../utils/cookie'
  import img from '../assets/img/icon.jpg'
  
  export default {
    name: 'UserCenter',
    data() {
      return {
        userInfo: {}
      }
    },
    created() {
      // getUserInfo().then(res => {
      //   console.log("res", res);
      //   this.userInfo = res
      // })
      if (getToken()){
        this.userInfo = {
          img: img,
          username: "admin",
          roles: "管理员",
          nickname: "管理员",
          phone: "183********",
          email: "23********@qq.com",
          createtime: "2022-1-1",
          updatetime: "2022-1-1"
        }
      }
    },
    methods: {
        to_login(){
            this.$router.push({
                name: "Login"
            })
        }
    }
  }
  </script>
  
  <style lang="less">
//   .el-main{
//     height: 500px;
//     width: 500px;
//   }
  </style>
  