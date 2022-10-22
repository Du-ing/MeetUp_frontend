<template>
  <div class="table-classic-wrapper">
    <el-card shadow="always">
      <el-page-header style="margin-bottom: 15px" @back="goBack" title="返回">
      </el-page-header>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">我管理的</el-menu-item>
        <el-menu-item index="2">我加入的</el-menu-item>
      </el-menu>
      <!-- 操作栏 -->
      <div class="control-btns">
        <el-button type="primary" @click="dialogFormVisible = true">创建群组</el-button>
        <!-- <el-button type="primary" @click="handleCreate">新建Title</el-button> -->
      </div>
      <!-- 查询栏 -->
      <el-form
        ref="searchForm"
        :inline="true"
        :model="listQuery"
        label-width="90px"
        class="search-form"
      >
        <el-form-item label="群名称">
          <el-input v-model="listQuery.kw" placeholder="根据群名称搜索" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchData">查询</el-button>
        </el-form-item>
      </el-form>

      <el-dialog width="30%" title="创建群组" :visible.sync="dialogFormVisible">
        <el-form :model="group_info" label-width="30%">
          <el-form-item label="群组名称" style="width:85%">
            <el-input v-model="group_info.group_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="群组简介" style="width:85%">
            <el-input v-model="group_info.group_information" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="群组类别" style="width:85%">
            <el-select v-model="group_info.group_type" placeholder="请选择类别">
              <el-option label="学习" value="1"></el-option>
              <el-option label="工作" value="2"></el-option>
              <el-option label="游戏" value="3"></el-option>
              <el-option label="动漫" value="4"></el-option>
              <el-option label="运动" value="5"></el-option>
              <el-option label="美食" value="6"></el-option>
              <el-option label="追星" value="7"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="createGroup">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="群组信息"
        :visible.sync="formVisible"
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
          <el-form-item label="群组名称：">
            <el-input v-model="dialogForm.group_name" style="width:85%" :disabled="activeIndex == '2'" />
          </el-form-item>
          <el-form-item label="群简介：">
            <el-input v-model="dialogForm.group_information" style="width:85%" :disabled="activeIndex == '2'" />
          </el-form-item>
          <el-form-item label="群组类别">
            <el-select v-model="dialogForm.group_type" style="width:85%" placeholder="请选择类别" :disabled="activeIndex == '2'">
              <el-option label="学习" value="1"></el-option>
              <el-option label="工作" value="2"></el-option>
              <el-option label="游戏" value="3"></el-option>
              <el-option label="动漫" value="4"></el-option>
              <el-option label="运动" value="5"></el-option>
              <el-option label="美食" value="6"></el-option>
              <el-option label="追星" value="7"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="群主：">
            <el-input v-model="dialogForm.admin_name" style="width:85%" disabled />
          </el-form-item>
          <el-form-item label="群人数：">
            <el-input v-model="dialogForm.group_nums" style="width:85%" disabled />
          </el-form-item>
          <el-link style="position: absolute;right: 50px;" :underline="false" type="primary" @click="checkUsers(dialogForm.id, dialogForm.group_name)">
            进入群<i class="el-icon-d-arrow-right"></i>
          </el-link>
          <div class="footer-item">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" :disabled="isSubmit" @click="updateGroup">确 定</el-button>
          </div>
        </el-form>
      </el-dialog>

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
        <el-table-column prop="id" label="编号" align="center"  sortable />
        <el-table-column prop="group_name" label="群名称" align="center" />
        <el-table-column prop="admin_name" label="群主" align="center" />
        <!-- <el-table-column prop="group_information" label="群简介" align="center" /> -->
        <!-- <el-table-column label="禁止编辑" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.forbid" @change="stateChange(scope.row)" />
          </template>
        </el-table-column> -->
        <el-table-column label="操作" align="center" width="400">
          <template slot-scope="scope">
            <el-button size="mini" :disabled="scope.row.forbid" @click="toDetail(scope.row.id)">查看详情</el-button>
            <el-button v-if="activeIndex == '1'" size="mini" type="success" @click="chackJoin(scope.row.id)">处理申请</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页栏 -->
      <Pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.count" @pagination="fetchData" />
    </el-card>
  </div>
</template>

<script>
import Pagination from '../../../components/Pagination'
import Upload from '../../../components/Upload'
import Hints from '../../../components/Hints'
import service from '../../../request'
import {group_type_map} from '../../../config'
import {group_type_num_map} from '../../../config'

export default {
  name: 'TitleList',
  components: { Pagination, Upload, Hints },
  data() {
    return {
      activeIndex: '1',
      dialogFormVisible: false,
      group_info: {
        group_name: undefined,
        group_information: undefined,
        group_type: undefined
      },
      dialogFormTitle: undefined,
      // 数据总条数
      total: 0,
      // 表格数据数组
      tableData: [],

      dialogForm: {
        id: undefined,
        group_name: undefined,
        group_information: undefined,
        admin_name: undefined,
        group_nums: undefined,
        group_type: undefined
      },

      // 数据列表加载动画
      listLoading: true,
      // 查询列表参数对象
      listQuery: {
        page: 1,
        count: 10,
        kw: undefined,
        is_admin: 1
      },
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
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    createGroup(){
      service({
        url: "/group/create",
        method: "post",
        data: this.group_info
      }).then(() => {
        this.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: '创建成功!'
        })
        this.fetchData()
      }).catch((e) => {
        console.log(e)
        this.$message({
          type: 'info',
          message: '创建失败!'
        })
      })
    },
    handleSelect(key){
      const index = key.toString()
      this.activeIndex = index
      this.fetchData()
    },
    goBack(){
      this.$router.back()
    },
    chackJoin(group_id){
      this.$router.push({
        name: "GroupJoinApply",
        params: {
          group_id: group_id
        }
      })
    },
    updateGroup(){
      let groupInfo = this.dialogForm
      let value = group_type_num_map[groupInfo.group_type]
      if(value){
        groupInfo.group_type = value
      }
      service({
        url: "/group/update",
        method: "post",
        data: groupInfo
      }).then(() => {
        this.formVisible = false
        this.$message({
          type: 'success',
          message: '更新成功!'
        })
        this.fetchData()
      }).catch((e) => {
        console.log(e)
        this.$message({
          type: 'info',
          message: '更新失败!'
        })
      })
    },

    // 多选操作
    handleSelectionChange(val) {
      let tmp = []
      for(let i in val){
        tmp.push(val[i].titleId)
      }
      this.multipleSelection = tmp
    },
    // 编辑数据
    toDetail(group_id) {
      this.dialogFormTitle = "编辑"
      // this.dialogForm = row
      service({
          url: "group/query",
          method: "get",
          params: {
            group_id: group_id
          }
        }).then((res) => {
          let groupInfo = res.data
          groupInfo.group_type = group_type_map[groupInfo.group_type]
          this.dialogForm = groupInfo
          this.formVisible = true
        })
    },
    handleJoin(id) {
      // console.log(data)
      this.$confirm('是否申请加入该群组？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        service({
          url: "/group/join_group",
          method: "post",
          data: {
            group_id: id
          }
        }).then(() => {
          this.$message({
            type: 'success',
            message: '申请成功!'
          })
          this.fetchData()
        })
      })
    },
    // 新增/编辑弹出框 关闭时操作
    handleClose() {
      this.formVisible = false
      this.$refs.dialogForm.resetFields()
    },
    // 获取数据列表
    fetchData() {
      this.listLoading = true
      const url = this.activeIndex == '1' ? "/group/query_allgroup" : "/group/query_user_group"
      service({
        url,
        method: 'get',
        params: this.listQuery
      }).then(res => {
        // console.log(res)
        this.total = res.data.total
        this.tableData = res.data.groups
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
    cancleForm() {
      this.$refs.dialogForm.resetFields()
      this.formVisible = false
    },
    checkUsers(group_id, group_name){
      const is_admin = this.activeIndex == '1' ? true : false;
      this.$router.push({
        name: "GroupUserList",
        params: {
          group_id: group_id,
          group_name: group_name,
          is_admin: is_admin
        }
      })
    }
  }
}
</script>

<style lang="less">
.table-classic-wrapper {
  .el-card {
    min-height: 656px;
  }
  .control-btns {
    margin-top: 20px;
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
