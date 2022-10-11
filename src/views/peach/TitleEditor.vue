<template>
  <div class="rich-text-editor">
    <el-form ref="eidtData" :model="eidtData" :rules="rules" label-width="100px" class="form-list">
      <el-form-item label="标题：">
        <el-input v-model="titleName" maxlength="15" disabled :placeholder="titleName" />
      </el-form-item>
      <el-form-item label="detail编号：" prop="detailId">
        <el-input v-model="eidtData.detailId" maxlength="15" disabled placeholder="" />
      </el-form-item>
      <el-form-item label="图片：" prop="description">
        <el-upload
          class="avatar-uploader"
          action="http://47.102.99.215:9090/peach/picture/uploadPicture"
          :headers="headers"
          :data="params"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="eidtData.pictureUrl" :src="eidtData.pictureUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="描述：" prop="description">
        <el-input v-model="eidtData.description" />
      </el-form-item>
      <el-form-item label="内容：" prop="content">
        <Editor v-model="eidtData.content" :placeholder="eidtData.content" />
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="submitEditor" round>提交</el-button>
  </div>
</template>

<script>
import Hints from '../../components/Hints'
import Editor from '../../components/Editor'
import service from '../../request'
// import { deepClone } from '../../utils'
import { getToken } from '../../utils/cookie'

export default {
  name: 'RichTextEditor',
  components: { Editor, Hints },
  data() {
    return {
      mode: "新建",
      titleName: undefined,
      eidtData: {
        detailId: undefined,
        masterId: undefined,
        pictureUrl: undefined,
        description: undefined,
        content: undefined
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ]
      },
      headers: undefined,
      params: {
        description: "elementui插件上传图片"
      }
    }
  },
  created() {
    this.mode = this.$route.params.mode
    // if (this.mode == "edit"){
    //   this.eidtData = this.$route.params.data
    // }
    if (this.mode == "新建"){
      this.eidtData.masterId = this.$route.params.data.titleId
      this.titleName = this.$route.params.data.name
    }
    else {
      this.eidtData = this.$route.params.data
      this.titleName = this.$route.params.titleName
    }
    this.placeholder = this.content

    const token = getToken()
    if (token) {
      this.headers = {
        "Authorization": "Bearer " + token
      }
    }
  },
  methods: {
    submitEditor() {
      let url = "/peach/detail/uploadDetail"
      if(this.mode == "编辑"){
        url = "/peach/detail/updateDetail"
      }
      service({
        url: url,
        method: "post",
        data: this.eidtData
      })
      .then(res => {
        this.$message({
          type: 'success',
          message: this.mode + '成功!'
        })
        this.$router.push({
          name: "TitleDetailList",
          params: {
            data: {
              titleId: this.eidtData.masterId,
              name: this.titleName
            }
          }
        })
      })
      .catch(e => {
        this.$message({
          type: 'error',
          message: this.mode + '失败!'
        })
      })
    },
    handleAvatarSuccess(res, file) {
      this.eidtData.pictureUrl = res.obj.url;
      // console.log(this.eidtData.pictureUrl);
    },
    beforeAvatarUpload(file) {
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
      const isLt2M = (file.size / 1024 / 1024) < 5;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!');
      }
      return isJPG && isLt2M;
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
