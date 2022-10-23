<template>
  <div class="user-center-wrapper clear-fix">
    <el-card shadow="always" :body-style="{padding: '50px'}">
      <el-page-header style="margin-bottom: 30px" @back="goBack" title="返回">
      </el-page-header>
      <el-row>
        <el-col :span="12" class="user-avatar">
          <img :src="userInfo.icon" alt="avatar">
        </el-col>
        <el-col :span="12">
          <ul class="user-info">
            <li>
              <label>id：</label>
              <span>{{ userInfo.id }}</span>
            </li>
            <li>
              <label>用户名：</label>
              <span>{{ userInfo.username }}</span>
            </li>
            <li>
              <label>性别：</label>
              <span>{{ userInfo.gender }}</span>
            </li>
            <li>
              <label>年龄：</label>
              <span>{{ userInfo.age }}</span>
            </li>
            <li>
              <label>邮箱：</label>
              <span>{{ userInfo.email }}</span>
            </li>
            <li>
              <label>电话号码：</label>
              <span>{{ userInfo.phone }}</span>
            </li>
            <li>
              <label>联系方式：</label>
              <span>{{ userInfo.social_media }}</span>
            </li>
            <li>
              <label>爱好：</label>
              <span>{{ userInfo.interest }}</span>
            </li>
            <li>
              <label>简介：</label>
              <span>{{ userInfo.profit }}</span>
            </li>
          </ul>
          <el-button size="mini" type="primary" @click="updateInfo">修改资料</el-button>
        </el-col>
      </el-row>

      <el-dialog
        title="修改资料"
        :visible.sync="formVisible"
        width="30%"
        class="dialog-form"
        :before-close="handleClose"
      >
        <el-form
          ref="dialogForm"
          :model="userInfo"
          label-width="20%"
        >
          <el-form-item label="id：">
            <el-input v-model="userInfo.id" style="width:85%" disabled />
          </el-form-item>
          <el-form-item label="用户名：">
            <el-input v-model="userInfo.username" style="width:85%" disabled />
          </el-form-item>
          <el-form-item label="性别：" style="width:85%">
            <el-select v-model="userInfo.gender" placeholder="请选择性别">
              <el-option label="男" value="1"></el-option>
              <el-option label="女" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄：">
            <el-input v-model="userInfo.age" style="width:85%" />
          </el-form-item>
          <el-form-item label="邮箱：">
            <el-input v-model="userInfo.email" style="width:85%" />
          </el-form-item>
          <el-form-item label="电话：">
            <el-input v-model="userInfo.phone" style="width:85%" />
          </el-form-item>
          <el-form-item label="联系方式：">
            <el-input v-model="userInfo.social_media" style="width:85%" />
          </el-form-item>
          <el-form-item label="爱好：">
            <el-input v-model="userInfo.interest" style="width:85%" />
          </el-form-item>
          <el-form-item label="简介：">
            <el-input v-model="userInfo.profit" style="width:85%" />
          </el-form-item>
          <el-form-item label="头像" style="width:85%">
            <el-upload
              class="avatar-uploader"
              action="http://aitmaker.cn:6543/user/upload_file"
              name="file"
              :headers="headers"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="userInfo.icon" :src="userInfo.icon" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <div class="footer-item">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="submitForm">提 交</el-button>
          </div>
        </el-form>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getUserInfo } from '../api/login'
import service from '../request'
import { getToken } from '../utils/cookie'

export default {
  name: 'UserCenter',
  data() {
    return {
      userInfo: {
        age: undefined,
        email: undefined,
        gender: undefined,
        icon: undefined,
        id: undefined,
        interest: undefined,
        password: undefined,
        phone: undefined,
        profit: undefined,
        social_media: undefined,
        username: undefined
      },
      formVisible: false,
      headers: {
        Authorization: getToken()
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(){
      getUserInfo().then(res => {
        this.userInfo = res.data
        this.userInfo.gender = res.data.gender == 1 ? "男" : "女"
      })
    },
    goBack(){
      this.$router.back()
    },
    updateInfo(){
      this.formVisible = true
    },
    handleClose() {
      this.formVisible = false
      this.$refs.dialogForm.resetFields()
    },
    submitForm() {
      let info = this.userInfo
      if(info.gender == "男"){
        info.gender = 1
      }
      else if(info.gender == "女"){
        info.gender = 0
      }
      service({
        url: "/user/update",
        method: "post",
        data: info
      }).then(() => {
        this.$message({
          type: 'success',
          message: "更新成功!"
        })
        this.formVisible = false
        this.$refs.dialogForm.resetFields()
        this.fetchData()
      }).catch((e) => {
        console.log(e)
        this.$message({
          type: 'info',
          message: '更新失败!'
        })
      })
    },
    handleAvatarSuccess(res, file) {
      this.userInfo.icon = res.data.file_url
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 10;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG或PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 10MB!');
      }
      return isJPG && isLt2M;
    },
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
