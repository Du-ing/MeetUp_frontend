<template>
  <div class="rich-text-editor">
    <el-form ref="eidtData" :model="eidtData" :rules="rules" label-width="100px" class="form-list">
      <el-form-item label="编号：" prop="brandId">
        <el-input v-model="eidtData.brandId" disabled placeholder="待新建" />
      </el-form-item>
      <el-form-item label="名称：" prop="name">
        <el-input v-model="eidtData.name" maxlength="15" show-word-limit placeholder="请输入" />
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
import { deepClone } from '../../utils'

export default {
  name: 'RichTextEditor',
  components: { Editor, Hints },
  data() {
    return {
      mode: "新建",
      eidtData: {
        brandId: undefined,
        name: undefined,
        content: undefined,
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.mode = this.$route.params.mode
    if (this.mode == "编辑"){
      this.eidtData = this.$route.params.data
    }
  },
  methods: {
    submitEditor() {
      let url = "/peach/brand/uploadBrand"
      if(this.mode == "编辑"){
        url = "/peach/brand/updateBrandById"
      }
      service({
        url: url,
        method: "post",
        data: this.eidtData
      }).then(res => {
        this.$message({
          type: 'success',
          message: this.mode + '成功!'
        })
        this.$router.push({
          name: "BrandList"
        })
      }).catch(e => {
        this.$message({
          type: 'error',
          message: this.mode + '失败!'
        })
      })
    }
  }
}
</script>
