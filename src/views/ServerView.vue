<template>
  <div  style="width: 85%;margin: 50px auto;">
  <p style="color: #606266;font-weight: bolder;font-size: 25px;font-family: 'PingFang SC'">服务中心</p>
    <div>
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="服务列表" name="servers">
          <el-table
            :data="serverData"
            style="border: 1px solid #DCDFE6;padding: 30px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)"
            @sort-change="serverSortPage"
          >
            <el-table-column
              prop="id"
              label="id"
              sortable="custom"
              width="100">
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称"
              sortable
              width="300">
            </el-table-column>
            <el-table-column
              prop="inputFunctions"
              label="输入数据"
              width="200"
            >
              <template v-slot:default="scope">
                <el-popover trigger="hover" placement="top">
                  <p v-for="(item,index) in scope.row.inputFunctions" :key="index">{{ item.name }}</p>
                  <template v-slot:reference>
                    <p>{{ functionFormat(scope.row.inputFunctions) }}</p>
                  </template>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              prop="outputFunctions"
              label="输出数据"
              width="200"
            >
              <template v-slot:default="scope">
                <el-popover trigger="hover" placement="top">
                  <p v-for="(item,index) in scope.row.outputFunctions" :key="index">{{ item.name }}</p>
                  <template v-slot:reference>
                    <p>{{ functionFormat(scope.row.outputFunctions) }}</p>
                  </template>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              prop="descriptions"
              label="描述"
              width="300"
            >
              <template v-slot:default="scope">
                <el-popover trigger="hover" placement="top">
                  <p>{{ scope.row.descriptions }}</p>
                  <template v-slot:reference>
                    <div>{{ stateFormat(scope.$index, scope.column.no, scope.row.descriptions) }}</div>
                  </template>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="700">
              <template v-slot:default="scope">
                <div>
                  <el-button style="display: inline;margin: 5px" type="primary" plain @click="activeServer=scope.row;dialogDataVisible1=true;generateData(scope.row.inputFunctions)">
                    调用服务
                  </el-button>
                  <el-button style="display: inline;margin: 5px" type="success" plain @click="addProcess(scope.row)">加入聚合服务
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 50px">
            <el-pagination
              style="justify-content: center"
              layout="prev, pager, next"
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :total="totalItem"
              @current-change="getServerNewPage">
            </el-pagination>
          </div>
          <div v-if="submitProcessData.servers.length>0" style="padding: 30px;border: 1px solid #DCDFE6;margin-top: 50px; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) ">
            <p style="font-weight: bolder">已选择的聚合服务</p>
            <el-row>
              <el-col v-for="(item,index) in submitProcessData.servers" :key="index" style="margin: 10px 0" :span="6">
                <div v-if="index+1<submitProcessData.servers.length"><el-tag type="info" style="width: 70%">{{item.name}}</el-tag><el-button disabled style="width: 30%; border: none;" :icon="ArrowRightBold" size="small"></el-button></div>
                <div v-else><el-tag :type="lastTagType" style="width: 70%">{{item.name}}</el-tag><div style="display: inline-block;width: 30%"><el-button @mouseover="this.lastTagType='danger'" @mouseleave="this.lastTagType=''" @click="this.submitProcessData.servers.pop();this.lastTagType=''" type="danger" :icon="Delete" size="small" circle /></div></div>
              </el-col>
            </el-row>
            <el-form :inline="true">
              <el-form-item label="聚合服务名称"><el-input placeholder="请输入内容" v-model="submitProcessData.name" clearable></el-input></el-form-item>
              <el-form-item label="聚合服务描述">
                <el-input
                type="textarea"
                :rows="1"
                placeholder="请输入内容"
                v-model="submitProcessData.descriptions">
                </el-input>
              </el-form-item>
            </el-form>
            <el-button style="margin-top: 30px" @click="submitProcess">创建新的聚合服务</el-button>
          </div>
        添加的聚合服务:{{submitProcessData}}
        </el-tab-pane>
        <el-tab-pane label="聚合服务管理" name="process">
          <el-table
            :data="processData"
            style="border: 1px solid #DCDFE6;padding: 30px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)"
            @sort-change="processSortPage"
          >
            <el-table-column
              prop="id"
              label="id"
              sortable="custom"
              width="100">
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称"
              sortable
              width="150">
            </el-table-column>
            <el-table-column
              prop="descriptions"
              label="描述"
              width="300"
            >
              <template v-slot:default="scope">
                <el-popover trigger="hover" placement="top">
                  <p>{{ scope.row.descriptions }}</p>
                  <template v-slot:reference>
                    <div>{{ stateFormat(scope.$index, scope.column.no, scope.row.descriptions) }}</div>
                  </template>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              prop="servers"
              label="服务流程"
              width="500"
            >
              <template v-slot:default="scope">
                <div style="margin-top:10px;display: inline-block" v-for="(item,index) in scope.row.servers" :key="index"><el-tag>{{item.name}}</el-tag><el-button v-if="index+1<scope.row.servers.length" disabled style="border: none;" :icon="ArrowRightBold" size="small"></el-button></div>
              </template>
            </el-table-column>
            <el-table-column width="800" label="操作">
              <template v-slot:default="scope">
                <div>
                  <el-button style="display: inline;margin: 5px" type="primary" plain @click="dialogDataVisible2=true;activeProcess=scope.row;generateData(scope.row.servers[0].inputFunctions)">
                    调用聚合服务
                  </el-button>
                  <el-button style="display: inline;" type="danger" plain disabled>
                    删除聚合服务
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 50px">
            <el-pagination
              style="justify-content: center"
              layout="prev, pager, next"
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :total="totalItem"
              @current-change="getProcessNewPage">
            </el-pagination>
          </div>
          activeProcess:{{activeProcess}}
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <el-dialog v-model="dialogDataVisible1" @close="dialogClear">
    <p style="color: #606266;font-weight: bolder;font-size: 25px;font-family: 'PingFang SC'">调用服务</p>
    <div style="text-align: left; margin: 50px 10%;padding: 2%;font-weight: bold; border: 1px dashed #DCDFE6;border-radius: 4px;">
      <el-descriptions style="margin-top: 20px" title="服务信息" direction="vertical" column="2" border>
        <el-descriptions-item label="id" :span="1">{{activeServer.id}}</el-descriptions-item>
        <el-descriptions-item label="服务名称" :span="1">{{activeServer.name}}</el-descriptions-item>
        <el-descriptions-item label="服务描述" :span="2">{{activeServer.descriptions}}</el-descriptions-item>
      </el-descriptions>
      <p style="font-size: 16px;color: #303133">数据源设置</p>
      <div style="padding-left: 10px" v-for="(item,index) in activeServer.inputFunctions" :key="index">
        <p>数据名称:  {{item.name}}</p>
        <p>数据类型:  {{item.type}}</p>
        <div style="width: 50%">
          <p>自定义数据: </p>
          <el-upload
            v-if="['mp4','img','mp3'].indexOf(item.type)>-1"
            drag
            action="http://localhost:8800/uploadcenter/upload"
            :on-success="(response,file,fileList) => fileUpload(response,file,fileList,item.name)">
            <!--            multiple>-->
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
          <el-input
            v-else
            placeholder="请输入内容"
            v-model.trim="submitServerData[item.name]"
            clearable>
          </el-input>
        </div>
        <el-divider></el-divider>
      </div>
      <div style="text-align: center">
        <el-button @click="submitServer()">提交</el-button>
      </div>
      <el-descriptions v-if="Object.keys(responseData).length!==0" title="返回信息" column=4 border>
        <el-descriptions-item v-for="(item,index) in responseData" :key="index" :label="index" :span="4">{{item}}</el-descriptions-item>
      </el-descriptions>
    </div>
  </el-dialog>
  <el-dialog v-model="dialogDataVisible2" @close="dialogClear">
    <p style="color: #606266;font-weight: bolder;font-size: 25px;font-family: 'PingFang SC'">调用聚合服务</p>
    <div style="text-align: left; margin: 50px 10%;padding: 2%;font-weight: bold; border: 1px dashed #DCDFE6;border-radius: 4px;">
      <el-descriptions style="margin-top: 20px" title="服务信息" direction="vertical" column="2" border>
        <el-descriptions-item label="id" :span="1">{{activeProcess.id}}</el-descriptions-item>
        <el-descriptions-item label="服务名称" :span="1">{{activeProcess.name}}</el-descriptions-item>
        <el-descriptions-item label="服务描述" :span="2">{{activeProcess.descriptions}}</el-descriptions-item>
      </el-descriptions>
      <p style="font-size: 16px;color: #303133">数据源设置</p>
      <div style="padding-left: 10px" v-for="(item,index) in activeProcess.servers[0].inputFunctions" :key="index">
        <p>数据名称:  {{item.name}}</p>
        <p>数据类型:  {{item.type}}</p>
        <div style="width: 50%">
          <p>自定义数据: </p>
          <el-upload
            v-if="['mp4','img','mp3'].indexOf(item.type)>-1"
            drag
            action="http://localhost:8800/uploadcenter/upload"
            :on-success="(response,file,fileList) => fileUpload(response,file,fileList,item.name)">
            <!--            multiple>-->
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
          <el-input
            v-else
            placeholder="请输入内容"
            v-model.trim="submitServerData[item.name]"
            clearable>
          </el-input>
        </div>
        <el-divider></el-divider>
      </div>
      <div style="text-align: center">
        <el-button @click="submitServer()">提交</el-button>
        {{submitServerData}}
      </div>
      <el-descriptions v-if="Object.keys(responseData).length!==0" title="返回信息" column=4 border>
        <el-descriptions-item v-for="(item,index) in responseData" :key="index" :label="index" :span="4">{{item}}</el-descriptions-item>
      </el-descriptions>
    </div>
  </el-dialog>
</template>

<script>
import { Delete, ArrowRightBold } from '@element-plus/icons-vue'
import axios from 'axios'
export default {
  setup () {
    return {
      Delete, ArrowRightBold
    }
  },
  name: 'ServerView',
  data () {
    return {
      serverData: [{
        id: 1,
        name: '人脸目标检测',
        path: '/face',
        inputFunctions: [{
          id: 1,
          name: 'picture',
          type: 'img',
          descriptions: '硬件获取、服务输出的图片数据'
        },
        {
          id: 2,
          name: 'humid',
          type: 'float',
          descriptions: '硬件获取、服务输出的湿度'
        },
        {
          id: 3,
          name: 'temperature',
          type: 'float',
          descriptions: '硬件获取、服务输出的温度'
        }
        ],
        outputFunctions: [{
          id: 1,
          name: '图片',
          type: 'img',
          descriptions: '硬件获取、服务输出的图片数据'
        }],
        descriptions: '利用图片进行人脸目标检测'
      }, {
        id: 2,
        name: '人脸目标检测的下一步',
        path: '/face',
        inputFunctions: [{
          id: 1,
          name: 'picture',
          type: 'img',
          descriptions: '硬件获取、服务输出的图片数据'
        }],
        outputFunctions: [{
          id: 1,
          name: '图片',
          type: 'img',
          descriptions: '硬件获取、服务输出的图片数据'
        }],
        descriptions: '利用图片进行人脸目标检测'
      }],
      processData: [],
      submitProcessData: {
        id: null,
        name: '',
        servers: [],
        descriptions: ''
      }, // 提交的新的聚合服务的数据
      activeName: 'servers', // 激活服务列表或聚合服务列表
      lastTagType: '', // 新增聚合服务最后一个Tag的样式
      dialogDataVisible1: false,
      activeServer: {}, // 调用的服务
      submitServerData: {}, // 调用的服务需要提交的数据
      activeProcess: {}, // 掉用的聚合服务
      dialogDataVisible2: false,
      ascOrder: true,
      columnName: 'id',
      totalItem: 0,
      currentPage: 1,
      pageSize: 5,
      responseData: {}
    }
  },
  methods: {
    stateFormat (row, column, cellValue) {
      let result = ''
      if (typeof (cellValue) === 'string') {
        result = cellValue
      } else {
        if (cellValue.length === 0) return ''
        for (let i = 0; i < cellValue.length; i++) {
          result += cellValue[i] + ','
        }
      }
      if (result.length > 15) {
        // 最多显示15个字符
        return result.slice(0, 15) + '...'
      }
      return result
    },
    functionFormat (value) {
      let result = ''
      for (const item of value) {
        result += item.name + ','
      }
      return this.stateFormat(null, null, result.slice(0, -1))
    },
    tabClick () {
      this.ascOrder = true
      this.columnName = 'id'
      this.totalItem = 0
      this.currentPage = 1
      this.pageSize = 5
      if (this.activeName === 'servers') {
        this.getProcessNewPage()
      } else {
        this.getServerNewPage()
      }
    },
    serverSortPage (pageInfo) {
      if (pageInfo.order === null) {
        this.columnName = 'id'
        this.ascOrder = true
      } else {
        this.columnName = pageInfo.prop
        this.ascOrder = pageInfo.order === 'ascending'
      }
      this.getServerNewPage()
    },
    processSortPage (pageInfo) {
      if (pageInfo.order === null) {
        this.columnName = 'id'
        this.ascOrder = true
      } else {
        this.columnName = pageInfo.prop
        this.ascOrder = pageInfo.order === 'ascending'
      }
      this.getProcessNewPage()
    },
    addProcess (server) {
      function isObjectEqual (obj1, obj2) {
        const obj1Keys = Object.keys(obj1)
        const obj2Keys = Object.keys(obj2)

        if (obj1Keys.length !== obj2Keys.length) return false

        for (const key of obj1Keys) {
          const val1 = obj1[key]
          const val2 = obj2[key]
          if (val1 !== val2) {
            return false
          }
        }
        return true
      }
      let isLegal = true
      const len = this.submitProcessData.servers.length - 1
      if (len >= 0) {
        const output = this.submitProcessData.servers[len].outputFunctions
        const input = server.inputFunctions
        console.log(this.submitProcessData.servers[len].outputFunctions)
        console.log(server.inputFunctions)
        if (output.length !== input.length) {
          isLegal = false
        } else {
          for (let i = 0; i < output.length; i++) {
            if (!isObjectEqual(output[i], input[i])) {
              isLegal = false
              break
            }
          }
        }
      }
      if (isLegal) {
        this.submitProcessData.servers.push(server)
        this.$message({
          message: '成功加入聚合服务',
          type: 'success'
        })
      } else {
        this.$message.error({
          message: '该服务的输入与上一个服务的输出不匹配'
        })
      }
    },
    submitProcess () {
      for (const key in this.submitProcessData) {
        if (key !== 'id' && this.submitProcessData[key].length === 0) {
          this.$alert('请补充完整数据或等待数据上传完成', '缺少自定义数据', {
            confirmButtonText: '确定',
            callback: action => {
              this.$message.error({
                message: '请重新填写数据'
              })
            }
          })
          return
        }
      }
      axios.post('http://localhost:8800/registercenter/process/add', this.submitProcessData).then((response) => {
        console.log(response)
        if (response.data.code === 100) {
          this.$message.success({
            message: '提交数据成功'
          })
          this.submitProcessData = {
            id: null,
            name: '',
            servers: [],
            descriptions: ''
          }
        }
      })
    },
    fileUpload (response, file, fileList, name) {
      this.submitServerData[name] = response.data
    },
    dialogClear () {
      this.submitServerData = {}
      this.activeServer = {}
      this.activeProcess = {}
      this.responseData = {}
    },
    submitServer () { // 提交给第一个AI服务
      for (const key in this.submitServerData) {
        if (this.submitServerData[key].length === 0) {
          this.$alert('请补充完整数据或等待数据上传完成', '缺少自定义数据', {
            confirmButtonText: '确定',
            callback: action => {
              this.$message.error({
                message: '请重新填写数据'
              })
            }
          })
          return
        }
      }
      if (Object.keys(this.activeProcess).length === 0) {
        this.activeProcess = {
          id: null,
          name: '',
          servers: [],
          descriptions: ''
        }
        this.activeProcess.servers.push(this.activeServer)
      }
      axios.post('http://localhost:8800/' + this.activeProcess.servers[0].path.toLowerCase(), { processDTO: this.activeProcess, dataMap: this.submitServerData, processIndex: 0 }).then((response) => {
        console.log(response)
        this.responseData = JSON.parse(response.data.data)
      })
      // 使用submitServerData的数据请求AI服务
    },
    generateData (inputFunctions) { // 点击调用后生产提交给AI的数据模板
      console.log(inputFunctions)
      let item
      for (item of inputFunctions) {
        console.log(item)
        this.submitServerData[item.name] = ''
      }
    },
    getServerNewPage () {
      axios.get('http://localhost:8800/registercenter/server/pageInfo?' + 'pageIndex=' + this.currentPage + '&pageSize=' + this.pageSize + '&ascOrder=' + this.ascOrder + '&columnName=' + this.columnName).then((response) => {
        console.log(response)
        this.totalItem = response.data.data.total
        this.serverData = response.data.data.records
      })
    },
    getProcessNewPage () {
      axios.get('http://localhost:8800/registercenter/process/pageInfo?' + 'pageIndex=' + this.currentPage + '&pageSize=' + this.pageSize + '&ascOrder=' + this.ascOrder + '&columnName=' + this.columnName).then((response) => {
        console.log(response)
        this.totalItem = response.data.data.total
        this.processData = response.data.data.records
      })
    }
  },
  created () {
    this.getServerNewPage()
  }
}
</script>

<style scoped>

</style>
