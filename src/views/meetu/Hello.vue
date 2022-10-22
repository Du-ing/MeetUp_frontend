<template>
    <div class="hello">
        <el-container>
            <el-main class="el-main">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div  class="first-row">
                            <div class="title">欢迎来到MeetU</div>
                            <div class="intro">
                                <p>你可以在这里找到情投意合的朋友，</p>
                                <p>你可以在这里加入温馨有爱的组织，</p>
                                <p>你可以在这里收到满心欢喜的讯息，</p>
                                <p>快来加入我们吧！</p>
                            </div>
                            <el-link class="link" type="success" @click="goTo(1)">
                                进入<i class="el-icon-right"></i>
                            </el-link>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <el-image
                        style="width: 100%"
                        src="https://whuthycgzh.cloud/app_files/demo/hello.png"
                        fit="fill">
                        </el-image>
                    </el-col>
                </el-row>

                <el-divider><i class="el-icon-arrow-down"></i></el-divider>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-image
                        style="width: 100%"
                        src="https://whuthycgzh.cloud/app_files/demo/hello1.png"
                        fit="fill">
                        </el-image>
                    </el-col>
                    <el-col :span="12">
                        <div  class="first-row">
                            <div class="title">Groups</div>
                            <div class="intro">
                                <p>你可以在这里找到情投意合的朋友，</p>
                                <p>你可以在这里加入温馨有爱的组织，</p>
                                <p>你可以在这里收到满心欢喜的讯息，</p>
                                <p>快来加入我们吧！</p>
                            </div>
                            <el-link class="link" type="primary" @click="goTo(2)">
                                <i class="el-icon-back"></i>进入
                            </el-link>
                        </div>
                    </el-col>
                </el-row>

                <el-divider><i class="el-icon-arrow-down"></i></el-divider>
                
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div  class="first-row">
                            <div class="title">Events</div>
                            <div class="intro">
                                <p>你可以在这里找到情投意合的朋友，</p>
                                <p>你可以在这里加入温馨有爱的组织，</p>
                                <p>你可以在这里收到满心欢喜的讯息，</p>
                                <p>快来加入我们吧！</p>
                            </div>
                            <el-link class="link" type="warning" @click="goTo(3)">
                                进入<i class="el-icon-right"></i>
                            </el-link>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <el-image
                        style="width: 100%"
                        src="https://whuthycgzh.cloud/app_files/demo/hello2.png"
                        fit="fill">
                        </el-image>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
  </template>
  
  <script>
  
  export default {
    name: 'Hello',
    data() {
      return {
        
      }
    },
    methods: {
        to_register(){
            this.$router.push({
                name: "Register"
            })
        },
        to_login(){
            this.$router.push({
                name: "Login"
            })
        },
        goTo(key){
            if(key == 1){
                this.$router.push({
                    name: "UserCenter"
                })
            }
            else if(key == 2){
                this.$router.push({
                    name: "GroupList"
                })
            }
            else if(key == 3){
                this.$router.push({
                    name: "EventList"
                })
            }
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
    .link{
        margin-top: 20px;
        font-size: 30px;
    }
  </style>
  