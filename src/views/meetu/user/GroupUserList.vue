<template>
  <div class="table-classic-wrapper">
    <el-card shadow="always">
      <el-page-header style="margin-bottom: 15px" @back="goBack" title="返回">
      </el-page-header>
      <div class="group_name">{{group_name}}</div>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        style="margin-top: 20px;"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="1">群成员</el-menu-item>
        <el-menu-item index="2">群活动</el-menu-item>
      </el-menu>
      <el-button type="primary" style="margin: 10px" @click="dialogFormVisible = true">发布活动</el-button>
      <!-- <el-button type="primary" @click="solveJoin">发送全体消息</el-button> -->
      <!-- 表格栏 -->
      <el-table
        v-if="activeIndex == '1'"
        ref="multipleTable"
        v-loading="listLoading"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        size="medium"
      >
        <el-table-column type="selection" width="60" />
        <el-table-column prop="username" label="用户" align="center" />
        <el-table-column prop="update_time" label="加群时间" align="center" sortable />
        <el-table-column label="操作" align="center" width="400">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="openMessage(scope.row)">发消息</el-button>
            <el-button size="mini" type="danger" @click="removeUser(scope.row)">移出群</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="activeIndex == '2'" class="cards">
        <div class="card" v-for="(event, index) in tableData" :key="index">
          <div class="card-name">{{event.event_name}}</div>
          <a style="margin: 5px auto;" @click="toDetail(event.id)">
            <img class="card-img" src="https://whuthycgzh.cloud/app_files/demo/icon.jpg" />
          </a>
          <div class="card-info">{{event.event_information}}</div>
          <div class="card-type">标签：{{event.event_type}}</div>
          <div v-if="event.event_status == 1" style="font-size:small;color:green;">进行中</div>
          <div v-if="event.event_status == 2" style="font-size:small;color:red;">已结束</div>
          <!-- <div>{{event.admin_name}}</div> -->
        </div>
      </div>

      <!-- 分页栏 -->
      <Pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="fetchData" />

      <el-dialog width="30%" title="创建活动" :visible.sync="dialogFormVisible">
        <el-form :model="event_info" label-width="30%">
          <el-form-item label="活动名称" style="width:85%">
            <el-input v-model="event_info.event_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="活动简介" style="width:85%">
            <el-input v-model="event_info.event_information" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="活动类别" style="width:85%">
            <el-select v-model="event_info.event_type" placeholder="请选择类别">
              <el-option label="学习" value="1"></el-option>
              <el-option label="工作" value="2"></el-option>
              <el-option label="游戏" value="3"></el-option>
              <el-option label="动漫" value="4"></el-option>
              <el-option label="运动" value="5"></el-option>
              <el-option label="美食" value="6"></el-option>
              <el-option label="追星" value="7"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动封面" style="width:85%">
            <el-upload
              class="avatar-uploader"
              action="http://aitmaker.cn:6543/user/upload_file"
              name="file"
              :headers="headers"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="event_info.event_img" :src="event_info.event_img" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="createEvent">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="活动详情"
        :visible.sync="eventDetailVisible"
        width="30%"
        class="dialog-form"
        :before-close="handleEventClose"
      >
        <el-form
          ref="dialogForm"
          :model="dialogForm"
          :rules="formRules"
          label-width="20%"
        > 
          <el-form-item label="活动名称：">
            <el-input v-model="dialogForm.event_name" style="width:85%" :disabled="user_id != dialogForm.admin_id" />
          </el-form-item>
          <el-form-item label="活动简介：">
            <el-input v-model="dialogForm.event_information" style="width:85%" :disabled="user_id != dialogForm.admin_id" />
          </el-form-item>
          <el-form-item label="发布人：">
            <el-input v-model="dialogForm.admin_name" style="width:85%" disabled />
          </el-form-item>
          <el-form-item label="活动类别">
            <el-select v-model="dialogForm.event_type" style="width:85%" placeholder="请选择类别" :disabled="user_id != dialogForm.admin_id">
              <el-option label="学习" value="1"></el-option>
              <el-option label="工作" value="2"></el-option>
              <el-option label="游戏" value="3"></el-option>
              <el-option label="动漫" value="4"></el-option>
              <el-option label="运动" value="5"></el-option>
              <el-option label="美食" value="6"></el-option>
              <el-option label="追星" value="7"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="参与人数：">
            <el-input v-model="dialogForm.event_nums" style="width:85%" disabled />
          </el-form-item>
          <el-form-item label="状态：">
            <el-radio-group v-model="dialogForm.event_status">
              <el-radio label="1">进行中</el-radio>
              <el-radio label="2">已结束</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-link style="position: absolute;right: 50px;" :underline="false" type="success" @click="joinEvent(dialogForm.id)">
            加入活动<i class="el-icon-d-arrow-right"></i>
          </el-link>
          <div class="footer-item">
            <el-button @click="handleEventClose">取 消</el-button>
            <el-button type="primary" @click="updateEvent">确 定</el-button>
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
            <el-input v-model="sendMsgForm.receiver" style="width:85%" disabled />
          </el-form-item>
          <el-form-item label="主题：">
            <el-input v-model="sendMsgForm.title" style="width:85%" />
          </el-form-item>
          <el-form-item label="内容：">
            <el-input v-model="sendMsgForm.content" style="width:85%" />
          </el-form-item>
          <div class="footer-item">
            <el-button @click="handleSendClose">取 消</el-button>
            <el-button type="primary" :disabled="isSubmit" @click="sendMsg">发 送</el-button>
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
import {group_type_map} from '../../../config'
import {group_type_num_map} from '../../../config'
import {getToken} from '../../../utils/cookie'

export default {
  name: 'TitleList',
  components: { Pagination, Upload, Hints },
  data() {
    return {
      activeIndex: "1",
      dialogFormVisible: false,
      eventDetailVisible: false,
      event_info: {
        event_name: undefined,
        event_information: undefined,
        event_type: undefined,
        group_id: undefined,
        event_img: undefined,
      },
      group_id: undefined,
      group_name: undefined,
      user_id: this.$store.state.user.user_id,
      is_admin: undefined,
      sendMsgVisible: false,
      sendMsgForm: {
        title: undefined,
        content: undefined,
        to_ids: [],
        receiver: undefined
      },
      headers: {
        Authorization: getToken()
      },
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
        id: undefined,
        event_name: undefined,
        event_information: undefined,
        admin_id: undefined,
        admin_name: undefined,
        event_type: undefined,
        event_nums: undefined
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
    this.group_name = this.$route.params.group_name
    this.is_admin = this.$route.params.is_admin
    this.fetchData()
  },
  methods: {
    createEvent(){
      this.event_info.group_id = this.group_id
      service({
        url: "/event/create_event",
        method: "post",
        data: this.event_info
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
        eventInfo.event_status = eventInfo.event_status.toString()
        this.dialogForm = eventInfo
        this.eventDetailVisible = true
      })
    },
    openMessage(send_info){
      this.sendMsgVisible = true
      this.sendMsgForm.to_ids = [send_info.user_id]
      this.sendMsgForm.receiver = send_info.username
    },
    sendMsg(){
      service({
        url: "/message/send_message",
        method: "post",
        data: this.sendMsgForm
      }).then(() => {
        this.sendMsgVisible = false
        this.$message({
          type: 'success',
          message: '发送成功!'
        })
        this.fetchData()
      }).catch((e) => {
        this.sendMsgVisible = false
        console.log(e)
        this.$message({
          type: 'info',
          message: '发送失败!'
        })
      })
    },
    handleSelect(key){
      const index = key.toString()
      this.activeIndex = index
      this.fetchData()
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
    handleEventClose(){
      this.eventDetailVisible = false
    },
    // 获取数据列表
    fetchData() {
      this.listLoading = true
      if(this.activeIndex == '1'){
        service({
          url: "/group/query_user",
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
      }
      else{
        service({
          url: '/event/query_events',
          method: 'get',
          params: {
            page: this.listQuery.currentPage,
            count: this.listQuery.pageSize,
            group_id: this.group_id
          }
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
      }
    },
    removeUser(){
      service({
        url: "/message/send_message",
        method: "post",
        data: this.sendMsgForm
      }).then(() => {
        this.sendMsgVisible = false
        this.$message({
          type: 'success',
          message: '发送成功!'
        })
        this.fetchData()
      }).catch((e) => {
        this.sendMsgVisible = false
        console.log(e)
        this.$message({
          type: 'info',
          message: '发送失败!'
        })
      })
    },
    updateEvent(){
      let eventInfo = this.dialogForm
      let value = group_type_num_map[eventInfo.event_type]
      if(value){
        eventInfo.event_type = value
      }
      service({
        url: "/event/update_event",
        method: "post",
        data: eventInfo
      }).then(() => {
        this.eventDetailVisible = false
        this.$message({
          type: 'success',
          message: '更新成功!'
        })
        this.fetchData()
      }).catch((e) => {
        this.eventDetailVisible = false
        console.log(e)
        this.$message({
          type: 'info',
          message: '更新失败!'
        })
      })
    },
    joinEvent(event_id){
      let data = {
        event_id: event_id,
        group_id: this.group_id,
      }
      service({
        url: "/event/join_event",
        method: "post",
        data: data
      }).then(() => {
        this.eventDetailVisible = false
        this.$message({
          type: 'success',
          message: '成功加入活动!'
        })
        this.fetchData()
      }).catch((e) => {
        this.eventDetailVisible = false
        console.log(e)
        this.$message({
          type: 'info',
          message: '加入失败!'
        })
      })
    },
    handleAvatarSuccess(res, file) {
      this.event_info.event_img = res.data.file_url

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
.table-classic-wrapper {
  .group_name{
    font-size: large;
    font-weight: bold;
  }
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
    color: rgb(75, 91, 156);
    margin: 5px auto;
  }
  
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
}
</style>
