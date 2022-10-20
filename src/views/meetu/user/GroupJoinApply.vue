<template>
  <div class="table-classic-wrapper">
    <el-card shadow="always">
      <el-page-header style="margin-bottom: 15px" @back="goBack" title="返回">
      </el-page-header>
      <!-- 表格栏 -->
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        size="medium"
      >
        <el-table-column type="selection" width="60" />
        <!-- <el-table-column v-else prop="s_name" label="接收人" align="center" /> -->
        <el-table-column prop="username" label="申请人" align="center" />
        <el-table-column prop="create_time" label="申请时间" align="center" sortable />
        <el-table-column label="操作" align="center" width="400">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="solveJoin(scope.row.group_id, 1, scope.row.user_id)">同意</el-button>
            <el-button size="mini" type="danger" @click="solveJoin(scope.row.group_id, 0, scope.row.user_id)">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页栏 -->
      <Pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="fetchData" />

    </el-card>
  </div>
</template>

<script>
import Pagination from '../../../components/Pagination'
import Upload from '../../../components/Upload'
import Hints from '../../../components/Hints'
import service from '../../../request'
import a from 'file-saver'

export default {
  name: 'TitleList',
  components: { Pagination, Upload, Hints },
  data() {
    return {
      group_id: undefined,
      // 数据列表加载动画
      listLoading: true,
      // 查询列表参数对象
      listQuery: {
        titleId: undefined,
        name: undefined,
        currentPage: 1,
        pageSize: 10
      },
      // 新增/编辑提交表单对象
      dialogForm: {
        titleId: undefined,
        name: undefined
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
    this.group_id = this.$route.params.group_id
    this.fetchData()
  },
  methods: {
    handleSelect(key){
      const index = key.toString()
      this.activeIndex = index
      this.fetchData()
    },
    solveJoin(group_id, allow, user_id){
      service({
        url: "/group/check_request",
        method: "post",
        data: {
          group_id: group_id,
          user_allow: allow,
          user_id: user_id
        }
      }).then(() => {
        const msg = allow == 1 ? "已同意" : "已拒绝"
        this.$message({
          type: 'success',
          message: msg
        })
        this.fetchData()
      }).catch((e) => {
        console.log(e)
        this.$message({
          type: 'info',
          message: '请求失败!'
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
    goBack(){
      this.$router.back()
    },
    handleClose() {
      this.msgDetailVisible = false
      this.$refs.dialogForm.resetFields()
    },
    // 获取数据列表
    fetchData() {
      this.listLoading = true
      service({
        url: "/group/query_checkuser",
        method: 'get',
        params: {
          page: this.listQuery.currentPage,
          count: this.listQuery.pageSize,
          group_id: this.group_id
        }
      }).then(res => {
        let dataList = res.data.users
        this.total = res.data.total
        this.tableData = dataList
        this.listLoading = false
      }).catch(e => {
        // console.log(e)
        this.listLoading = false
      })
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
