<template>
    <div class="user-center-wrapper clear-fix">
      <el-card shadow="always" :body-style="{padding: '50px'}">
        <div class="user-avatar">
          <img :src="userInfo.img" alt="avatar">
        </div>
        <ul class="user-info">
          <li>
            <label>用户名：</label>
            <span>{{ userInfo.username }}</span>
          </li>
          <li>
            <label>角色：</label>
            <span>{{ userInfo.roles }}</span>
          </li>
          <li>
            <label>昵称：</label>
            <span>{{ userInfo.nickname }}</span>
          </li>
          <li>
            <label>电话号码：</label>
            <span>{{ userInfo.phone }}</span>
          </li>
          <li>
            <label>邮箱：</label>
            <span>{{ userInfo.email }}</span>
          </li>
          <li>
            <label>创建时间：</label>
            <span>{{ userInfo.createtime }}</span>
          </li>
          <li>
            <label>更新时间：</label>
            <span>{{ userInfo.updatetime }}</span>
          </li>
        </ul>
      </el-card>
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
    }
  }
  </script>
  
  <style lang="less">
  .user-center-wrapper {
    .user-avatar {
      float: left;
      width: 150px;
      height: 150px;
    }
    .user-info {
      float: left;
      width: 800px;
      margin-left: 50px;
      margin-bottom: 50px;
      li {
        height: 34px;
        line-height: 34px;
        label,
        span {
          display: inline-block;
          vertical-align: middle;
        }
        label {
          width: 80px;
          margin-right: 12px;
          text-align: right;
        }
      }
    }
  }
  </style>
  