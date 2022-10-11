<template>
  <div class="editor-wrapper">
    <div ref="editorEle" class="editor-container" />
  </div>
</template>

<script>
import E from 'wangeditor'
import { getToken } from '../../utils/cookie'

export default {
  name: 'Editor',
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editor: null
    }
  },
  watch: {
    value(val) {
      this.editor.txt.html(val)
    }
  },
  mounted() {
    this.editor = new E(this.$refs.editorEle)
    this.editor.customConfig.onchange = (html) => {
      this.$emit('input', html)
    }
    this.editor.customConfig.uploadImgServer = 'http://47.102.99.215:9090/peach/picture/uploadPicture'
    this.editor.customConfig.uploadFileName = 'file'
    this.editor.customConfig.uploadImgMaxSize = 10 * 1024 * 1024
    this.editor.customConfig.uploadImgMaxLength = 20
    this.editor.customConfig.uploadImgParams = {
      description: "wangEditor上传图片"
    }
    const token = getToken()
    if (token) {
      this.editor.customConfig.uploadImgHeaders = {
        "Authorization": "Bearer " + token
      }
    }
    else{
      this.$message({
        type: 'error',
        message: '无权限！'
      })
      return
    }
    // 下面是最重要的的方法
    this.editor.customConfig.uploadImgHooks = {
      before: function(xhr, editor, files) {
        // 图片上传之前触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

        // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
        // return {
        //     prevent: true,
        //     msg: '放弃上传'
        // }
      },
      success: function(xhr, editor, result) {
        // 图片上传并返回结果，图片插入成功之后触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        // this.imgUrl = result.obj.url
        this.$message({
          type: 'success',
          message: '上传成功！'
        })
      },
      fail: function(xhr, editor, result) {
        // 图片上传并返回结果，但图片插入错误时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        this.$message({
          type: 'error',
          message: '插入失败！'
        })
      },
      error: function(xhr, editor) {
        // 图片上传出错时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        this.$message({
          type: 'error',
          message: '上传失败！'
        })
      },
      timeout: function(xhr, editor) {
        // 图片上传超时时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        this.$message({
          type: 'error',
          message: '上传超时！'
        })
      },

      // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
      // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
      customInsert: function(insertImg, result, editor) {
        // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
        // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

        // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
        // result.data就是服务器返回的图片名字和链接
        const url = result.obj.url
        // 在这里转成JSON格式
        // JSON.stringify(url)
        insertImg(url)
        // result 必须是一个 JSON 格式字符串！！！否则报错
      }
    }

    // 创建富文本实例
    this.editor.create()
    this.editor.txt.html(this.placeholder)
  },
  beforeDestroy() {
    if(this.editor.destroy != undefined){
      this.editor.destroy()
    }
    this.editor = undefined
  }
}
</script>

<style lang="less">
  .editor-wrapper{
    .editor-container{
      text-align:left;
      box-shadow: rgba(0, 0, 0, 0.1) 0 2px 12px 0;
      .w-e-toolbar{
        padding: 5px;
        border: none!important;
      }
      .w-e-text-container{
        min-height: 450px !important;
        border: none!important;
        .w-e-text{
          padding: 10px;
          overflow-y: auto;
        }
      }
    }
  }
</style>
