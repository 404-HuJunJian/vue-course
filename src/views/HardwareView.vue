<template>
  <div style="width: 85%;margin: 50px auto;">
    <p style="color: #606266;font-weight: bolder;font-size: 25px;font-family: 'PingFang SC'">硬件中心</p>
    <el-table
      :data="tableData"
      style="border: 1px solid #DCDFE6;padding: 30px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)"
      @sort-change="sortPage"
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
        prop="uuid"
        label="uuid"
        width="200"
      >
        <template v-slot:default="scope">
          <el-popover trigger="hover" placement="top">
            <p>{{ scope.row.uuid }}</p>
            <template v-slot:reference>
              <div>{{ stateFormat(scope.$index, scope.column.no, scope.row.uuid) }}</div>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        sortable
        width="200"
        :formatter="timeFormat"
      >
      </el-table-column>
      <el-table-column
        prop="lastTime"
        label="最后时间"
        sortable
        width="200"
        :formatter="timeFormat"
      >
      </el-table-column>
      <el-table-column
        prop="functions"
        label="功能"
        width="200"
      >
        <template v-slot:default="scope">
          <el-popover trigger="hover" placement="top">
            <p v-for="(item,index) in String(scope.row.functions).split(',')" :key="index">{{ item }}</p>
            <template v-slot:reference>
              <div>{{ stateFormat(scope.$index, scope.column.no, scope.row.functions) }}</div>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="descriptions"
        label="描述"
        width="180"
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
      <el-table-column label="操作" width="600">
        <template v-slot:default="scope">
          <div>
            <el-button style="display: inline-block;margin: 5px" type="primary" plain
                       @click="dialogDataVisible1=true;activeHardware=scope.row;this.elStepIndex+=1;this.dataFromHardware={}">
              获取硬件数据
            </el-button>
            <el-button style="display: inline-block;margin: 5px" type="success" plain
                       @click="dialogDataVisible2=true;activeHardware=scope.row;this.elStepIndex+=1;this.dataFromHardware={};requestProcessData()">
              使用人工智能服务
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
        @current-change="getNewPage">
      </el-pagination>
    </div>
  </div>

  <el-dialog v-model="dialogDataVisible1" @close="dialogClear">
    <el-steps :active="elStepIndex" align-center finish-status="success">
      <el-step title="选择功能"></el-step>
      <el-step title="等待硬件响应"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <div v-if="elStepIndex===0"
         style="text-align: left; margin: 50px 10%;padding: 2%; font-weight: bold;border: 1px dashed #DCDFE6;border-radius: 4px;">
      <el-descriptions title="硬件信息" direction="vertical" column=4 border>
        <el-descriptions-item label="id" :span="1">{{ activeHardware.id }}</el-descriptions-item>
        <el-descriptions-item label="名称" :span="1">{{ activeHardware.name }}</el-descriptions-item>
        <el-descriptions-item label="uuid" :span="2">{{ activeHardware.uuid }}</el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{ activeHardware.createTime }}</el-descriptions-item>
        <el-descriptions-item label="最后时间" :span="2">{{ activeHardware.lastTime }}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="4">{{ activeHardware.descriptions }}</el-descriptions-item>
      </el-descriptions>
      <el-divider></el-divider>
      <p style="font-size: 16px;color: #303133">功能选择</p>
      <el-checkbox style="margin-bottom: 10px" :indeterminate="isIndeterminate" v-model="checkAll"
                   @change="handleCheckAllChange" border>全选
      </el-checkbox>
      <el-checkbox-group v-model="checkedFunctions" @change="handleCheckedFunctionsChange">
        <el-checkbox v-for="(item,index) in String(activeHardware.functions).split(',')" :label="item" :key="index"
                     border>{{ item }}
        </el-checkbox>
      </el-checkbox-group>
      <el-button style="margin-top: 20px" :disabled="checkedFunctions.length===0"
                 @click="this.deadline2=Date.now() + 1000 * 5;submitHardware(checkedFunctions)">提交
      </el-button>
    </div>
    <div v-else-if="elStepIndex===1">
      <div style="margin: 10% 0"><img style="width: 20%;height: 30%" src="@/assets/loading.gif"></div>
      <el-countdown format="ss" :value="deadline2" @finish="timeout=true"></el-countdown>
      <div>
        <p style="color: #303133;font-size: 20px" v-if="!timeout">等待响应</p>
        <p style="color: #F56C6C;font-size: 20px" v-else>响应超时</p>
      </div>
      <el-button :disabled="!timeout" type="danger" @click="dialogDataVisible1 = false;dialogClear()">关闭页面
      </el-button>
    </div>
    <div v-else-if="elStepIndex===2"
         style="text-align: left; margin: 50px 10%;padding: 2%; font-weight: bold;border: 1px dashed #DCDFE6;border-radius: 4px;">
      <el-descriptions title="返回信息" column=4 border>
        <el-descriptions-item v-for="(item,index) in dataFromHardware" :key="index" :label="index" :span="4">
          {{ item }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </el-dialog>
  <!--  第二个按钮的对话框-->
  <el-dialog v-model="dialogDataVisible2" @close="dialogClear">
    <el-steps :active="elStepIndex" align-center finish-status="success">
      <el-step title="选择人工智能服务"></el-step>
      <el-step title="数据源选择"></el-step>
      <el-step title="等待硬件及服务器响应"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <!--  第一个步骤  -->
    <div v-if="elStepIndex===0"
         style="text-align: left; margin: 50px 10%;padding: 2%; font-weight: bold;border: 1px dashed #DCDFE6;border-radius: 4px;">
      <div>
        <p>服务选择: </p>
        <el-select v-model="selectedProcess" placeholder="请选择">
          <el-option
            v-for="(item, index) in processData"
            :key="item.id"
            :label="item.name"
            :value="index">
          </el-option>
        </el-select>
        <el-divider></el-divider>
        <p>服务流程: </p>
      </div>
      <div style="margin-top: 20px">
        <el-steps :style="{height:(processData[selectedProcess].servers.length*50+'px')}" direction="vertical"
                  :active=processData[selectedProcess].servers.length+1>
          <el-step v-for="(item,index) in processData[selectedProcess].servers" :key="index"
                   :title="item.name"></el-step>
        </el-steps>
      </div>
      <div style="margin-top: 10px;text-align: center">
        <el-button @click="generateData()">下一步</el-button>
      </div>
    </div>
    <!--    第二个步骤-->
    <div v-else-if="elStepIndex===1"
         style="text-align: left; margin: 50px 10%;padding: 2%;font-weight: bold; border: 1px dashed #DCDFE6;border-radius: 4px;">
      <el-descriptions title="硬件信息" direction="vertical" column=4 border>
        <el-descriptions-item label="id" :span="1">{{ activeHardware.id }}</el-descriptions-item>
        <el-descriptions-item label="名称" :span="1">{{ activeHardware.name }}</el-descriptions-item>
        <el-descriptions-item label="uuid" :span="2">{{ activeHardware.uuid }}</el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{ activeHardware.createTime }}</el-descriptions-item>
        <el-descriptions-item label="最后时间" :span="2">{{ activeHardware.lastTime }}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="4">{{ activeHardware.descriptions }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions style="margin-top: 20px" title="服务信息" direction="vertical" column=2 border>
        <el-descriptions-item label="id" :span="1">{{ processData[selectedProcess].id }}</el-descriptions-item>
        <el-descriptions-item label="服务名称" :span="1">{{ processData[selectedProcess].name }}</el-descriptions-item>
        <el-descriptions-item label="服务描述" :span="2">{{ processData[selectedProcess].descriptions }}
        </el-descriptions-item>
      </el-descriptions>
      <p style="font-size: 16px;color: #303133">数据源设置</p>
      <div style="padding-left: 10px" v-for="(item,index) in processData[selectedProcess].servers[0].inputFunctions"
           :key="index">
        <p>数据名称: {{ item.name }}</p>
        <p>数据类型: {{ item.type }}</p>
        <div>硬件数据源
          <el-switch v-if="activeHardware.functions.indexOf(item.name)>-1" style="margin-left: 10px;margin-bottom: 2px"
                     v-model="getFromHardware[index]"></el-switch>
          <el-tag v-else style="margin-left: 10px;" type="danger">该硬件无法提供此数据</el-tag>
        </div>

        <div style="width: 50%" v-if="!getFromHardware[index]">
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
            v-model.trim="processSubmit[item.name]"
            clearable>
          </el-input>
        </div>
        <el-divider></el-divider>
      </div>
      <div style="text-align: center">
        <el-button @click="deadline2=Date.now() + 1000 * 5;submitServer()">提交</el-button>
        {{ getFromHardware }}{{ processSubmit }}
      </div>
    </div>
    <div v-else-if="elStepIndex===2">
      <div style="margin: 10% 0"><img style="width: 20%;height: 30%" src="@/assets/loading.gif"></div>
      <el-countdown format="ss" :value="deadline2" @finish="timeout=true"></el-countdown>
      <div>
        <p style="color: #303133;font-size: 20px" v-if="!timeout">等待响应</p>
        <p style="color: #F56C6C;font-size: 20px" v-else>响应超时</p>
      </div>
      <el-button :disabled="!timeout" type="danger" @click="dialogDataVisible2 = false;dialogClear()">关闭页面
      </el-button>
    </div>
    <div v-else-if="elStepIndex===3"
         style="text-align: left; margin: 50px 10%;padding: 2%; font-weight: bold;border: 1px dashed #DCDFE6;border-radius: 4px;">
      <el-descriptions title="返回信息" column=4 border>
        <el-descriptions-item v-for="(item,index) in responseData" :key="index" :label="index" :span="4">
          {{ item }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </el-dialog>
</template>

<script>
import axios from 'axios'

export default {
  name: 'HardwareView',
  data () {
    return {
      tableData: [],
      processData: [
        {
          id: 1,
          name: '人脸识别',
          servers: [
            {
              id: 1,
              name: '人脸目标检测',
              path: '/face',
              input_functions: [
                {
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
              output_functions: [
                {
                  id: 1,
                  name: '图片',
                  type: 'img',
                  descriptions: '硬件获取、服务输出的图片数据'
                }
              ],
              descriptions: '利用图片进行人脸目标检测'
            },
            {
              id: 2,
              name: '人脸目标检测的下一步',
              path: '/face',
              input_functions: [
                {
                  id: 1,
                  name: 'picture',
                  type: 'img',
                  descriptions: '硬件获取、服务输出的图片数据'
                }
              ],
              output_functions: [
                {
                  id: 1,
                  name: '图片',
                  type: 'img',
                  descriptions: '硬件获取、服务输出的图片数据'
                }
              ],
              descriptions: '利用图片进行人脸目标检测'
            }
          ],
          descriptions: '人脸识别项目'
        },
        {
          id: 2,
          name: '语音识别',
          servers: [
            {
              id: 1,
              name: '语音检测',
              path: '/radio',
              input_functions: [
                {
                  id: 1,
                  name: 'radio',
                  type: 'mp3',
                  descriptions: '硬件获取、服务输出的音频数据'
                }
              ],
              output_functions: [
                {
                  id: 1,
                  name: 'radio',
                  type: 'mp3',
                  descriptions: '硬件获取、服务输出的音频数据'
                }
              ],
              descriptions: '利用图片进行人脸目标检测'
            }
          ],
          descriptions: '人脸识别项目'
        }
      ],
      dialogDataVisible1: false,
      dialogDataVisible2: false,
      checkAll: false, // 是否全选
      checkedFunctions: [], // 选择获取的功能
      isIndeterminate: false, // 是否是有选择且非全选状态
      activeHardware: null, // 打开对话框时选择的硬件信息
      elStepIndex: -1, // 进度条到第几步
      selectedProcess: 0, // 选择的操作的Index
      getFromHardware: [], // 是否来自硬件
      processSubmit: {}, // 提交的数据
      dataFromHardware: {}, // 请求返回的硬件数据
      currentPage: 1, // 分页的当前页面
      pageSize: 5, // 分页的每页的项目数
      totalItem: 0, // 后端项目的总数目
      columnName: 'id', // 排序依据的列名
      ascOrder: true, // 排序是升序还是降序
      deadline2: Date.now() + 1000 * 5,
      timeout: false, // 请求硬件超时判断
      responseData: {} // 调用ai服务返回
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
    timeFormat (row, column, cellValue) {
      const date = new Date(cellValue)
      const formattedDate = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0')
      const formattedTime = date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0') + ':' + date.getSeconds().toString().padStart(2, '0')
      return formattedDate + ' ' + formattedTime
    },
    handleCheckAllChange (val) {
      this.checkedFunctions = val ? String(this.activeHardware.functions).split(',') : []
      this.isIndeterminate = false
    },
    handleCheckedFunctionsChange (value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === String(this.activeHardware.functions).split(',').length
      this.isIndeterminate = checkedCount > 0 && checkedCount < String(this.activeHardware.functions).split(',').length
    },
    dialogClear () {
      this.elStepIndex = -1
      this.checkedFunctions = []
      this.activeHardware = null
      this.checkAll = false
      this.isIndeterminate = false
      this.selectedProcess = 0
      this.getFromHardware = []
      this.processSubmit = {}
      this.dataFromHardware = {}
      this.timeout = false
      this.responseData = {}
    },
    generateData () {
      this.elStepIndex += 1
      let item
      for (item of this.processData[this.selectedProcess].servers[0].inputFunctions) {
        if (this.activeHardware.functions.indexOf(item.name) > -1) {
          this.getFromHardware.push(true)
        } else {
          this.getFromHardware.push(false)
        }
        this.processSubmit[item.name] = ''
      }
    },
    async submitServer () {
      let i
      let name
      let isWait = false // 是否等待过硬件
      for (i in this.getFromHardware) {
        if (!this.getFromHardware[i]) {
          name = Object.keys(this.processSubmit)[i]
          console.log(name)
          console.log(this.processSubmit[name].length)
          if (this.processSubmit[name].length === 0) {
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
      }
      for (i in this.getFromHardware) {
        if (this.getFromHardware[i]) {
          name = Object.keys(this.processSubmit)[i]
          await this.submitHardware([name])
          this.processSubmit[name] = this.dataFromHardware[name]
          isWait = true
          // 使用name（function）和uuid请求消息中心获取数据
        }
      }
      axios.post('http://localhost:8800/' + 'weatherserver/weather/predict', {
        processDTO: this.processData[this.selectedProcess],
        dataMap: this.processSubmit,
        processIndex: 0
      }).then((response) => {
        console.log(response)
        this.responseData = JSON.parse(response.data.data)
      })
      if (!isWait) {
        this.elStepIndex += 2
      }
      // 使用processSubmit的数据请求AI服务
      // this.elStepIndex += 1
    },
    async submitHardware (functions) {
      this.elStepIndex += 1
      let name
      const uuid = this.activeHardware.uuid
      for (name of functions) {
        await axios.post('http://localhost:8800/messagecenter/mqtt/sendMessage', {
          topic: uuid + '_server',
          payload: name
        }, { headers: { 'Content-Type': 'multipart/form-data' } }).then((response) => {
          console.log(response)
          this.dataFromHardware[name] = JSON.parse(response.data.data)[name]
        })
      }
      this.elStepIndex += 1
      // 使用name（function）和uuid请求消息中心获取数据
      // this.dataFromHardware[name] = uuid + '_' + name + '_消息中心返回的数据'
    },
    fileUpload (response, file, fileList, name) {
      this.processSubmit[name] = response.data
    },
    getNewPage () {
      axios.get('http://localhost:8800/registercenter/register/pageInfo?' + 'pageIndex=' + this.currentPage + '&pageSize=' + this.pageSize + '&ascOrder=' + this.ascOrder + '&columnName=' + this.columnName).then((response) => {
        console.log(response)
        this.totalItem = response.data.data.total
        this.tableData = response.data.data.records
      })
    },
    sortPage (pageInfo) {
      if (pageInfo.order === null) {
        this.columnName = 'id'
        this.ascOrder = true
      } else {
        this.columnName = pageInfo.prop
        this.ascOrder = pageInfo.order === 'ascending'
      }
      this.getNewPage()
    },
    requestProcessData () {
      axios.get('http://localhost:8800/registercenter/process/listAll').then((response) => {
        console.log(response)
        this.processData = response.data.data
      })
    }
  },
  created () {
    this.getNewPage()
  }
}
</script>

<style scoped>

</style>
