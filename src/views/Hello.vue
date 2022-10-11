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
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div  class="first-row">
                            <div class="title">欢迎来到MeetUp</div>
                            <div class="intro">
                                <p>你可以在这里找到情投意合的朋友，</p>
                                <p>你可以在这里加入温馨有爱的组织，</p>
                                <p>你可以在这里收到满心欢喜的讯息，</p>
                                <p>快来加入我们吧！</p>
                            </div>
                            <div class="login-btns">
                                <el-button type="primary" round>注册</el-button>
                                <el-button type="success" round>登陆</el-button>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <el-image
                        style="width: 100%"
                        src="https://whuthycgzh.cloud/app_files/demo/hello.png"
                        :fit="fill">
                        </el-image>
                    </el-col>
                </el-row>

                <el-divider><i class="el-icon-arrow-down"></i></el-divider>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-image
                        style="width: 100%"
                        src="https://whuthycgzh.cloud/app_files/demo/hello1.png"
                        :fit="fill">
                        </el-image>
                    </el-col>
                    <el-col :span="12">
                        <div  class="first-row">
                            <div class="title">Events</div>
                            <div class="intro">
                                <p>你可以在这里找到情投意合的朋友，</p>
                                <p>你可以在这里加入温馨有爱的组织，</p>
                                <p>你可以在这里收到满心欢喜的讯息，</p>
                                <p>快来加入我们吧！</p>
                            </div>
                            <div class="login-btns">
                            </div>
                        </div>
                    </el-col>
                </el-row>

                <el-divider><i class="el-icon-arrow-down"></i></el-divider>
                
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div  class="first-row">
                            <div class="title">Groups</div>
                            <div class="intro">
                                <p>你可以在这里找到情投意合的朋友，</p>
                                <p>你可以在这里加入温馨有爱的组织，</p>
                                <p>你可以在这里收到满心欢喜的讯息，</p>
                                <p>快来加入我们吧！</p>
                            </div>
                            <div class="login-btns">
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <el-image
                        style="width: 100%"
                        src="https://whuthycgzh.cloud/app_files/demo/hello2.png"
                        :fit="fill">
                        </el-image>
                    </el-col>
                </el-row>
            </el-main>
            <el-footer>
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
            </el-footer>
        </el-container>
    </div>
  </template>
  
  <script>
  import { getUserInfo } from '../api/login'
  import { getToken } from '../utils/cookie'
  import img from '../assets/img/icon.jpg'
  
  export default {
    name: 'Hello',
    data() {
      return {
        
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
    .first-row{
        margin-left: 10vw;
    }
    .title{
        font-size: 50px;
        margin-top: 10vh;
    }
    .intro{
        margin-top: 5vh;
        font-size: 20px;
    }
    .login-btns{
        margin-top: 5vh;
    }
  </style>
  