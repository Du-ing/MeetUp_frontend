<template>
  <div class="table-classic-wrapper">
    <el-card shadow="always">
      <el-page-header style="margin-bottom: 15px" @back="goBack" title="返回"></el-page-header>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        style="margin-top: 20px;"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="1">未读</el-menu-item>
        <el-menu-item index="2">已读</el-menu-item>
        <el-menu-item index="3">已发送</el-menu-item>
      </el-menu>
      <!-- 查询栏 -->
      <el-form
        ref="searchForm"
        :inline="true"
        :model="listQuery"
        label-width="90px"
        class="search-form"
      >
        <el-form-item label="主题">
          <el-input v-model="listQuery.kw" placeholder="根据主题模糊筛选" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchData">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格栏 -->
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        size="medium"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="60" />
        <el-table-column v-if="activeIndex == '1' || activeIndex == '2'" prop="s_name" label="发送人" align="center" />
        <!-- <el-table-column v-else prop="s_name" label="接收人" align="center" /> -->
        <el-table-column prop="title" label="主题" align="center" />
        <el-table-column prop="content" label="内容" align="center" />
        <el-table-column prop="create_time" label="时间" align="center"  sortable />
        <el-table-column label="操作" align="center" width="400">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="toDetail(scope.row)">查看消息</el-button>
            <el-button size="mini" type="danger" @click="handleDelete([scope.row.titleId])">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页栏 -->
      <Pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.count" @pagination="fetchData" />
      
      <el-dialog
        title="消息详情"
        :visible.sync="msgDetailVisible"
        width="30%"
        class="dialog-form"
        :before-close="handleClose"
      >
        <el-form
          ref="dialogForm"
          :model="dialogForm"
          :rules="formRules"
          label-width="20%"
        >
          <el-form-item v-if="activeIndex == '1' || activeIndex == '2'" label="发送人：">
            <el-input v-model="dialogForm.s_name" style="width:85%" disabled />
          </el-form-item>
          <el-form-item label="主题：">
            <el-input v-model="dialogForm.title" style="width:85%" disabled />
          </el-form-item>
          <el-form-item label="内容：">
            <el-input v-model="dialogForm.content" style="width:85%" disabled />
          </el-form-item>
          <el-form-item label="时间：">
            <el-input v-model="dialogForm.create_time" style="width:85%" disabled />
          </el-form-item>
          <div class="footer-item">
            <el-button @click="handleClose">取 消</el-button>
            <!-- <el-button type="primary" :disabled="isSubmit" @click="submitForm('dialogForm')">确 定</el-button> -->
            <el-button type="primary" v-if="activeIndex == '1' || activeIndex == '2'" @click="replyMsg(dialogForm)">回 复</el-button>
          </div>
        </el-form>
      </el-dialog>

      <el-dialog
        title="消息回复"
        :visible.sync="sendMsgVisible"
        width="30%"
        class="dialog-form"
        :before-close="handleSendClose"
      >
        <el-form
          ref="sendMsgForm"
          :model="sendMsgForm"
          :rules="formRules"
          label-width="20%"
        >
          <el-form-item label="接收人">
            <el-input v-model="dialogForm.s_name" style="width:85%" disabled />
          </el-form-item>
          <el-form-item label="主题：">
            <el-input v-model="sendMsgForm.title" style="width:85%" />
          </el-form-item>
          <el-form-item label="内容：">
            <el-input v-model="sendMsgForm.content" style="width:85%" />
          </el-form-item>
          <div class="footer-item">
            <el-button @click="handleSendClose">取 消</el-button>
            <el-button type="primary" :disabled="isSubmit" @click="sendMsg">确 定</el-button>
          </div>
        </el-form>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Pagination from '../../../components/Pagination'
import Upload from '../../../components/Upload'
import Hints from '../../../components/Hints'
import service from '../../../request'

export default {
  name: 'TitleList',
  components: { Pagination, Upload, Hints },
  data() {
    return {
      activeIndex: '1',
      msgDetailVisible: false,
      sendMsgVisible: false,
      sendMsgForm: {
        to_ids: undefined,
        receiver: undefined,
        title: undefined,
        content: undefined
      },
      // 数据列表加载动画
      listLoading: true,
      // 查询列表参数对象
      listQuery: {
        kw: undefined,
        page: 1,
        count: 10
      },
      // 新增/编辑提交表单对象
      dialogForm: {
        
      },
      dialogFormTitle: undefined,
      // 数据总条数
      total: 0,
      // 表格数据数组
      tableData: [],
      // 多选数据暂存数组
      multipleSelection: [],
      // 新增/编辑 弹出框显示/隐藏
      formVisible: false,
      // 表单校验 trigger: ['blur', 'change'] 为多个事件触发
      formRules: {
        name: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ]
      },
      // 防止多次连续提交表单
      isSubmit: false,
      // 导入数据 弹出框显示/隐藏
      importVisible: false,
      // 导出文件格式
      filesFormat: '.txt, .csv, .xls, .xlsx',
      // 导出数据 弹出框显示/隐藏
      exportVisible: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    toDetail(msg){
      this.msgDetailVisible = true,
      this.dialogForm = msg
      if(this.activeIndex == "1"){
        this.batchReadMsg([msg.id])
      }
    },
    handleSelect(key){
      const index = key.toString()
      this.activeIndex = index
      this.fetchData()
    },
    batchReadMsg(ids){
      service({
        url: "/message/read_messages",
        method: "post",
        data: {
          message_ids: ids
        }
      }).then(() => {
        this.$message({
          type: 'success',
          message: '已读成功!'
        })
        this.fetchData()
      }).catch((e) => {
        console.log(e)
        this.$message({
          type: 'info',
          message: '已读失败!'
        })
      })
    },
    replyMsg(dialogForm){
      this.sendMsgVisible = true
      this.sendMsgForm.to_ids = [dialogForm.s_id]
      this.sendMsgForm.receiver = dialogForm.s_name
    },
    handleSendClose() {
      this.sendMsgVisible = false
      this.$refs.sendMsgForm.resetFields()
    },
    sendMsg(){
      service({
          url: "/message/send_message",
          method: "post",
          data: this.sendMsgForm
        }).then(() => {
          this.msgDetailVisible = false
          this.sendMsgVisible = false
          this.$message({
            type: 'success',
            message: '发送成功!'
          })
          this.fetchData()
        }).catch((e) => {
          this.msgDetailVisible = false
          this.sendMsgVisible = false
          console.log(e)
          this.$message({
            type: 'info',
            message: '发送失败!'
          })
        })
    },
    goBack(){
      this.$router.back()
    },
    // 多选操作
    handleSelectionChange(val) {
      let tmp = []
      for(let i in val){
        tmp.push(val[i].titleId)
      }
      this.multipleSelection = tmp
    },
    // 删除数据
    handleDelete(data) {
      // console.log(data)
      this.$confirm('此操作将删除选中数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 此处可添加--删除接口
        // 删除成功调用fetchData方法更新列表
        service({
          url: "/peach/title/deleteTitleByIds",
          method: "post",
          data: data
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.fetchData()
        }).catch((e) => {
          console.log(e)
          this.$message({
            type: 'info',
            message: '删除失败!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 批量删除
    batchDelete() {
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: '请先选择要删除的数据！',
          type: 'warning'
        })
      } else {
        this.handleDelete(this.multipleSelection)
      }
    },
    // 新增/编辑弹出框 关闭时操作
    handleClose() {
      this.msgDetailVisible = false
      this.$refs.dialogForm.resetFields()
    },
    // 获取数据列表
    fetchData() {
      this.listLoading = true
      let url = ""
      let params = this.listQuery
      if(this.activeIndex == "1"){
        url = "/message/get_receiver_message"
        params.is_read = 0
      }
      else if(this.activeIndex == "2"){
        url = "/message/get_receiver_message"
        params.is_read = 1
      }
      else if(this.activeIndex == "3"){
        url = "/message/get_sender_message"
      }

      service({
        url,
        method: 'get',
        params
      }).then(res => {
        console.log(res)
        let dataList = res.data.messages
        // for(let i in dataList){
        //   dataList[i].nums = dataList[i].details.length
        // }
        this.total = res.data.total
        this.tableData = dataList
        this.listLoading = false
      }).catch(e => {
        // console.log(e)
        this.listLoading = false
      })
    },
    // 查询数据
    searchData() {
      this.listQuery.page = 1
      this.fetchData()
    },
  }
}
</script>

<style lang="less">
.table-classic-wrapper {
  .el-card {
    min-height: 656px;
  }
  .control-btns {
    margin-bottom: 20px;
  }
  .search-form {
    padding-top: 18px;
    margin-bottom: 15px;
    background-color: #f7f8fb;
  }
  .el-table thead {
    font-weight: 600;
    th {
      background-color: #f2f3f7;
    }
  }
  .dialog-form {
    .el-input {
      width: 380px;
    }
    .footer-item {
      margin-top: 50px;
      text-align: right;
    }
  }
  .upload-box,
  .export-data {
    width: 300px;
    margin: 0 auto 30px;
  }
  .upload-box {
    width: 156px;
    .files-upload {
      color: #20a0ff;
    }
  }
  .hints {
    font-size: 12px;
    color: #aaa;
    text-align: center;
  }
}
</style>
