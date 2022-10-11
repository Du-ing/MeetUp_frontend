<template>
  <div class="table-classic-wrapper">

    <canvas id="canvas" ref="canvas" hidden></canvas>

    <el-card shadow="always">
      <!-- 操作栏 -->
      <div class="control-btns">
        <el-button type="primary" @click="handleCreate">新建数据</el-button>
        <el-button type="primary" @click="handleImport">导入数据</el-button>
        <el-button type="primary" @click="exportVisible = true">导出数据</el-button>
        <el-button type="danger" @click="batchDelete">批量删除</el-button>
      </div>
      <!-- 查询栏 -->
      <el-form
        ref="searchForm"
        :inline="true"
        :model="listQuery"
        label-width="90px"
        class="search-form"
      >
        <el-form-item label="名称">
          <el-input v-model="listQuery.name" placeholder="名称" />
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
        <el-table-column prop="id" label="编号" align="center"  sortable />
        <el-table-column prop="name" label="名称" align="center" />
        <el-table-column prop="address" label="产地" align="center" />
        <el-table-column prop="list" label="上市时间" align="center" sortable />
        <el-table-column prop="pick" label="采摘时间" align="center" sortable />
        <el-table-column prop="description" label="详情" align="center" />
        <el-table-column prop="cnt" label="查询次数" align="center" />
        <el-table-column label="二维码(点击下载)" align="center">
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 100px" :src="scope.row.qrcode" fit="fill" @click="downloadImg(scope.row.name, scope.row.qrcode)" />
          </template>
        </el-table-column>

        <el-table-column label="禁止编辑" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.forbid" @change="stateChange(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button size="mini" :disabled="scope.row.forbid" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete([scope.row.id])">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页栏 -->
      <Pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="fetchData" />
      <!-- 新增/编辑 弹出栏 -->
      <el-dialog
        :title="dialogFormTitle"
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
          <el-form-item label="编号：" v-if="dialogForm.id != undefined" prop="id">
            <el-input v-model="dialogForm.id" style="width:85%" disabled />
          </el-form-item>
          <el-form-item label="名称：" prop="name">
            <el-input v-model="dialogForm.name" style="width:85%" />
          </el-form-item>
          <el-form-item label="产地：" prop="address">
            <el-input v-model="dialogForm.address" style="width:85%" />
          </el-form-item>
          <el-form-item label="上市时间：" prop="list">
            <el-date-picker
              v-model="dialogForm.list"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              style="width:85%">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="采摘时间：" prop="pick">
            <el-date-picker
              v-model="dialogForm.pick"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              style="width:85%">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="详情：" prop="description">
            <el-input v-model="dialogForm.description" style="width:85%" />
          </el-form-item>
          <el-form-item label="查询次数：" v-if="dialogForm.cnt != undefined" prop="description">
            <el-input v-model="dialogForm.cnt" style="width:85%" disabled />
          </el-form-item>
          <el-form-item label="二维码(点击下载)：" v-if="dialogForm.qrcode != undefined" prop="qrcode">
            <el-image style="width: 100px; height: 100px" :src="dialogForm.qrcode" fit="fit" @click="downloadImg(dialogForm.name, dialogForm.qrcode)"></el-image>
          </el-form-item>
          
          <div class="footer-item">
            <el-button @click="cancleForm">取 消</el-button>
            <el-button type="primary" :disabled="isSubmit" @click="submitForm('dialogForm')">确 定</el-button>
          </div>
        </el-form>
      </el-dialog>
      <!-- 导入数据 弹出栏 -->
      <el-dialog
        title="导入数据"
        :visible.sync="importVisible"
        width="20%"
      >
        <div class="upload-box">
          <span>选择文件：</span>
          <Upload :files-format="filesFormat">
            <i class="vue-dsn-icon-upload" />上传文件
          </Upload>
        </div>
        <div class="hints">TIP：请选择要导出数据的格式。</div>
        <span slot="footer">
          <el-button @click="cancleImport">取 消</el-button>
          <el-button type="primary" @click="confirmImport">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 导出数据 弹出栏 -->
      <el-dialog
        title="导出数据"
        :visible.sync="exportVisible"
        width="30%"
      >
        <div class="export-data">
          <el-button type="primary" @click="exportTable('xlsx')">EXCEL格式</el-button>
          <el-button type="primary" @click="exportTable('csv')">CSV格式</el-button>
          <el-button type="primary" @click="exportTable('txt')">TXT格式</el-button>
        </div>
        <div class="hints">TIP：请选择要导出数据的格式。</div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import excel from '../../utils/excel'
import Pagination from '../../components/Pagination'
import Upload from '../../components/Upload'
import Hints from '../../components/Hints'
import service from '../../request'
import QRCode from 'qrcode'

export default {
  name: 'TitleList',
  components: { Pagination, Upload, Hints },
  data() {
    return {
      // 数据列表加载动画
      listLoading: true,
      // 查询列表参数对象
      listQuery: {
        id: undefined,
        name: undefined,
        currentPage: 1,
        pageSize: 10
      },
      // 新增/编辑提交表单对象
      dialogForm: {
        id: undefined,
        name: undefined,
        address: undefined,
        list: undefined,
        pick: undefined,
        description: undefined,
        qrcode: undefined
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
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        address: undefined,
        list: undefined,
        pick: undefined,
        description: undefined
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
  // mounted() {
  //   this.creatQrCode()
  //   let canvas = this.$refs.canvas
  //   console.log(canvas.toDataURL());
  // },
  methods: {
    // 多选操作
    handleSelectionChange(val) {
      let tmp = []
      for(let i in val){
        tmp.push(val[i].id)
      }
      this.multipleSelection = tmp
    },
    // 新建数据
    handleCreate() {
      this.formVisible = true
      this.dialogFormTitle = "新建"
      this.dialogForm = {
        id: undefined,
        name: undefined,
        address: undefined,
        list: undefined,
        pick: undefined,
        description: undefined,
        cnt: undefined,
        qrcode: undefined
      }
    },
    // 编辑数据
    handleEdit(row) {
      this.dialogFormTitle = "编辑"
      this.formVisible = true
      this.dialogForm = row
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
          url: "/peach/peach/deleteBrandByIds",
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
            type: 'error',
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
      this.formVisible = false
      this.$refs.dialogForm.resetFields()
    },
    // 获取数据列表
    fetchData() {
      this.listLoading = true
      // 获取数据列表接口
      service({
        url: '/peach/peach/getPeachLimit',
        method: 'get',
        params: {
          currentPage: this.listQuery.currentPage,
          size: this.listQuery.pageSize
        }
      }).then(res => {
        // console.log(res)
        this.total = res.obj.total
        this.tableData = res.obj.peaches
        this.listLoading = false
      }).catch(e => {
        // console.log(e)
        this.listLoading = false
      })
    },
    // 查询数据
    searchData() {
      this.listQuery.currentPage = 1
      service({
        url: '/peach/peach/getPeachByLike',
        method: 'get',
        params: {
          LikeName: this.listQuery.name
        }
      }).then(res => {
        // console.log(res)
        let dataList = res.obj
        // this.total = res.obj.total
        this.tableData = dataList
        this.listLoading = false
      }).catch(e => {
        // console.log(e)
        this.listLoading = false
      })
    },
    // 导入数据
    handleImport() {
      this.importVisible = true
    },
    // 新增/编辑表单确认提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 此处添加 新增/编辑数据的接口 新增成功后调用fetchData方法更新列表
          // 先 this.isSubmit = true 接口返回成功后 再 this.isSubmit = false
          this.formVisible = false
          let url = "/peach/peach/uploadPeach"
          if(this.dialogFormTitle == "编辑"){
            url = "/peach/peach/updatePeach"
          }
          service({
            url: url,
            method: "post",
            data: this.dialogForm
          })
          .then(res => {
            // console.log(res)
            if(this.dialogFormTitle == "新建"){
              let info = "http://43.140.193.162:8084/#/main?peachId=" + res.obj
              this.dialogForm.id = res.obj
              this.dialogForm.qrcode = this.creatQrCode(info)
              service({
                url: "/peach/peach/updatePeach",
                method: "post",
                data: this.dialogForm
              })
              .then(res1 => {
                this.$message({
                  type: 'success',
                  message: this.dialogFormTitle + '成功!'
                })
                this.fetchData()
              })
              .catch(e1 => {
                console.log(e1);
                this.$message({
                  type: 'error',
                  message: this.dialogFormTitle + '失败!'
                })
              })
            }
            else{
              this.$message({
                type: 'success',
                message: this.dialogFormTitle + '成功!'
              })
              this.fetchData()
            }
          })
          .catch(e => {
            console.log(e);
            this.$message({
              type: 'error',
              message: this.dialogFormTitle + '失败!'
            })
          })
        } else {
          this.isSubmit = false
          return false
        }
      })
    },
    // 新增/编辑表单取消提交
    cancleForm() {
      // this.$refs.dialogForm.resetFields()
      this.formVisible = false
    },
    // 导入数据弹出栏 确认操作
    confirmImport() {
      // 此处添加 后台接收的接口，将导入的数据传给后台处理
      this.importVisible = false
    },
    // 导入数据弹出栏 取消操作
    cancleImport() {
      // 将导入的数据清空
      this.importVisible = false
    },
    // 导出数据--excle格式
    exportTable(type) {
      if (this.tableData.length) {
        const params = {
          header: ['编号', '名称', '产地', '上市时间', '采摘时间', '详情', '查询次数', '二维码'],
          key: ['id', 'name', 'address', 'list', 'pick', 'description', 'cnt', 'qrcode'],
          data: this.tableData,
          autoWidth: true,
          fileName: '导出表格',
          bookType: type
        }
        excel.exportDataToExcel(params)
        this.exportVisible = false
      }
    },
    // 列表中婚姻状况栏，状态值改变时，调用
    selectChange(row) {
      // 此处添加后台接口，成功后调用fetchData方法更新列表
    },
    // 列表中禁止编辑栏，状态值改变时，调用
    stateChange(row) {
      // 此处添加后台接口，成功后调用fetchData方法更新列表
    },
    creatQrCode(info) {
      QRCode.toCanvas(
        this.$refs.canvas, 
        info,  //需要转换为二维码的内容
      )
      return this.$refs.canvas.toDataURL()
    },
    downloadImg(name, img){
      let alink = document.createElement("a");
      alink.href = img;
      alink.download = name; //图片名
      alink.click();
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
