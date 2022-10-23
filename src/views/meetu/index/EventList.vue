<template>
  <div class="table-classic-wrapper">
    <el-card shadow="always">
      <!-- 查询栏 -->
      <el-form
        ref="searchForm"
        :inline="true"
        label-width="90px"
        class="search-form"
      >
        <el-form-item label="活动名称">
          <el-input v-model="listQuery.kw" placeholder="根据活动名称模糊搜索" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchData">查询</el-button>
        </el-form-item>
        <el-form-item label="活动类别">
          <el-select v-model="listQuery.event_type" style="width:85%" placeholder="根据类别筛选" @change="fetchData">
            <el-option label="全部"></el-option>
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

      <el-dialog
        title="活动详情"
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
          <el-form-item label="活动名称：">
            <el-input v-model="dialogForm.event_name" style="width:85%" disabled />
          </el-form-item>
          <el-form-item label="活动简介：">
            <el-input v-model="dialogForm.event_information" style="width:85%" disabled />
          </el-form-item>
          <el-form-item label="发布人：">
            <el-input v-model="dialogForm.admin_name" style="width:85%" disabled />
          </el-form-item>
          <el-form-item label="群组：">
            <el-input v-model="dialogForm.group_name" style="width:85%" disabled />
          </el-form-item>
          <el-form-item label="活动类型：">
            <el-input v-model="dialogForm.event_type" style="width:85%" disabled />
          </el-form-item>
          <el-form-item label="参与人数：">
            <el-input v-model="dialogForm.event_nums" style="width:85%" disabled />
          </el-form-item>
          <el-form-item label="状态：">
            <div v-if="dialogForm.event_status == 1" style="color:green;">进行中</div>
            <div v-if="dialogForm.event_status == 2" style="color:red;">已结束</div>
          </el-form-item>
          <div class="footer-item">
            <el-button @click="cancleForm">取 消</el-button>
            <el-button type="primary" @click="joinGroup(dialogForm.group_id)">申请加群</el-button>
          </div>
        </el-form>
      </el-dialog>

      <div class="cards">
        <div class="card" v-for="(event, index) in tableData" :key="index">
          <div class="card-name">{{event.event_name}}</div>
          <a style="margin: 5px auto;" @click="toDetail(event.id)">
            <img class="card-img" :src="event.event_img" />
          </a>
          <div class="card-info">{{event.event_information}}</div>
          <div class="card-type">标签：{{event.event_type}}</div>
          <div v-if="event.event_status == 1" style="font-size:small;color:green;">进行中</div>
          <div v-if="event.event_status == 2" style="font-size:small;color:red;">已结束</div>
          <!-- <div>{{event.admin_name}}</div> -->
        </div>
      </div>
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

export default {
  name: 'TitleList',
  components: { Pagination, Upload, Hints },
  data() {
    return {
      dialogFormVisible: false,
      event_info: {
        event_name: undefined,
        event_information: undefined,
        event_type: undefined
      },
      dialogFormTitle: undefined,
      // 数据总条数
      total: 0,
      // 表格数据数组
      tableData: [],

      dialogForm: {
        id: undefined,
        event_name: undefined,
        event_information: undefined,
        admin_name: undefined,
        event_nums: undefined
      },

      // 数据列表加载动画
      listLoading: true,
      // 查询列表参数对象
      listQuery: {
        page: 1,
        count: 10,
        kw: undefined,
        event_type: undefined
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
    // 多选操作
    handleSelectionChange(val) {
      let tmp = []
      for(let i in val){
        tmp.push(val[i].titleId)
      }
      this.multipleSelection = tmp
    },
    // 编辑数据
    toDetail(event_id) {
      this.dialogFormTitle = "编辑"
      // this.dialogForm = row
      service({
        url: "/event/query_event",
        method: "get",
        params: {
          event_id: event_id
        }
      }).then((res) => {
        let eventInfo = res.data
        eventInfo.event_type = group_type_map[eventInfo.event_type]
        this.dialogForm = eventInfo
        this.formVisible = true
      })
    },
    joinGroup(group_id) {
      // console.log(data)
      this.$confirm('是否申请加入该活动？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        service({
          url: "/group/join_group",
          method: "post",
          data: {
            group_id: group_id
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
      // 获取数据列表接口
      service({
        url: '/event/query_events',
        method: 'get',
        params: this.listQuery
      }).then(res => {
        // console.log(res)
        let events = res.data.events
        for(let i in events){
          events[i].event_type = group_type_map[events[i].event_type]
        }
        this.total = res.data.total
        this.tableData = events
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
  }
}
</script>

<style lang="less">
.table-classic-wrapper {
  .cards{
    display: flex;
    flex-direction: row;
  }
  .card{
    width: 15vw;
    height: 20vw;
    border: #aaa 1px solid;
    border-radius: 10px;
    box-shadow: 3px 5px 15px 2px ;
    margin: 5px 15px;
    padding: 10px;
    display: flex;
    flex-direction: column;
  }
  .card-name{
    font-size: large;
    font-weight: bolder;
    margin: 5px auto;
  }
  .card-info{
    font-size: 15px;
    margin-bottom: 5px;
    margin: 5px auto;
  }
  .card-img{
    width: 12vw;
    height: 12vw;
  }
  .card-type{
    font-size: 13px;
    color: rgb(65, 57, 84);
    margin: 5px auto;
  }

  .el-card {
    min-height: 656px;
  }
  .control-btns {
    margin-bottom: 10px;
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
