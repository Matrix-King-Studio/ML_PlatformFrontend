<template>
  <el-container>
    <el-header style="height:50px">
      <Header></Header>
    </el-header>
    <el-container>
      <el-aside width="208px">
        <div style="padding-left: 10px; margin-top: 20px">
          <el-button type="primary" @click="addServerDialogFormVisible = true">
            添加服务器
          </el-button>
          <el-divider></el-divider>
          <el-menu
              mode="vertical"
              :default-active="activeServerIndex"
              @select="handleSelectServer">
            <el-menu-item
                v-for="server in serverList"
                :key="server.id"
                :index="server.id.toString()">
              {{ server.name }}
            </el-menu-item>
          </el-menu>
          <el-dialog title="服务器配置" :visible.sync="addServerDialogFormVisible">
            <el-steps :active="0" finish-status="success" style="margin-bottom: 20px">
              <el-step title="配置SSH" ></el-step>
              <el-step title="配置TorchServe" ></el-step>
              <el-step title="步骤 3" ></el-step>
            </el-steps>
            <el-form :model="serverForm">
              <el-form-item label="服务器名" :label-width="formLabelWidth">
                <el-input v-model="serverForm.name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="主机地址" :label-width="formLabelWidth">
                <el-input v-model="serverForm.host" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="SSH用户名" :label-width="formLabelWidth">
                <el-input v-model="serverForm.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="SSH密码" :label-width="formLabelWidth">
                <el-input v-model="serverForm.password" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addServerDialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="addServerDialogFormVisible = false">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </el-aside>
      <el-main>
        <el-button type="primary" @click="configTorchServeDialogFormVisible = true">
          配置TorchServe
        </el-button>
        <el-button type="primary" @click="addModelDialogFormVisible = true">
          上传模型
        </el-button>
        <el-dialog title="模型信息" :visible.sync="addModelDialogFormVisible">
          <el-form :model="addModelForm">
            <el-form-item label="模型url" :label-width="formLabelWidth">
              <el-input
                  v-model="addModelForm.url"
                  autocomplete="off"
                  placeholder="模型存档下载地址"></el-input>
            </el-form-item>
            <el-form-item label="模型名" :label-width="formLabelWidth">
              <el-input
                  v-model="addModelForm.model_name"
                  autocomplete="off"
                  placeholder="模型名（可选）"></el-input>
            </el-form-item>
            <el-form-item label="工作进程" :label-width="formLabelWidth">
              <el-input-number
                  v-model="addModelForm.initial_workers"
                  :min="1"
                  :max="10"></el-input-number>
            </el-form-item>
            <el-form-item label="批量推理大小" :label-width="formLabelWidth">
              <el-input-number
                  v-model="addModelForm.batch_size"
                  :min="1"
                  :max="4"></el-input-number>
            </el-form-item>
            <el-form-item label="是否同步" :label-width="formLabelWidth">
              <el-switch
                  v-model="addModelForm.synchronous"
                  active-color="#13ce66">
              </el-switch>
            </el-form-item>
            <el-form-item label="超时时间（s）" :label-width="formLabelWidth">
              <el-input-number
                  v-model="addModelForm.response_timeout"
                  :min="1"
                  :max="120"></el-input-number>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addModelDialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addModel">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog :title="`${editModelForm.modelName}模型信息`" :visible.sync="editModelDialogFormVisible">
          <el-form :model="editModelForm">
            <el-form-item label="版本号" :label-width="formLabelWidth">
              {{ editModelForm.modelVersion }}
            </el-form-item>
            <el-form-item label="运行引擎" :label-width="formLabelWidth">
              {{ editModelForm.runtime }}
            </el-form-item>
            <el-form-item label="批量推理大小" :label-width="formLabelWidth">
              {{ editModelForm.batchSize }}
            </el-form-item>
            <el-form-item label="最小工作进程" :label-width="formLabelWidth">
              <el-input-number
                  v-model="editModelForm.minWorkers"
                  :min="1"
                  :max="10"></el-input-number>
            </el-form-item>
            <el-form-item label="最大工作进程" :label-width="formLabelWidth">
              <el-input-number
                  v-model="editModelForm.maxWorkers"
                  :min="1"
                  :max="10"></el-input-number>
            </el-form-item>
            <el-form-item label="是否同步" :label-width="formLabelWidth">
              <el-switch
                  v-model="editModelForm.synchronous"
                  active-color="#13ce66">
              </el-switch>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editModelDialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmEditModel(editModelForm.modelName)">确 定</el-button>
          </div>
        </el-dialog>
        <el-table
            :data="modelTableData.filter(data => !searchModel || data['modelName'].toLowerCase().includes(searchModel.toLowerCase()))"
            style="width: 100%">
          <el-table-column
              label="模型URL"
              prop="modelUrl">
          </el-table-column>
          <el-table-column
              label="模型名称"
              prop="modelName">
          </el-table-column>
          <el-table-column
              align="right">
            <template slot="header" slot-scope="scope">
              <el-input
                  v-model="searchModel"
                  size="searchModel"
                  placeholder="输入关键字搜索"/>
            </template>
            <template slot-scope="scope">
              <el-button
                  size="mini"
                  type="primary"
                  v-if="scope.row['modelName']"
                  @click="handleEdit(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                  size="mini"
                  type="info"
                  v-if="scope.row['modelName']"
                  @click="handleDebug(scope.$index, scope.row)">调试
              </el-button>
              <el-button
                  size="mini"
                  type="danger"
                  v-if="scope.row['modelName']"
                  @click="handleOffline(scope.$index, scope.row)">下线
              </el-button>
              <el-button
                  size="mini"
                  type="success"
                  v-if="!scope.row['modelName']"
                  @click="handleOnline(scope.$index, scope.row)">上线
              </el-button>
              <el-button
                  size="mini"
                  type="danger"
                  v-if="!scope.row['modelName']"
                  @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-drawer
            :title="`${editModelForm.modelName} 模型调试`"
            :visible.sync="debugDrawerVisible"
            size="50%">
          <div>
            <el-tabs type="card">
              <el-tab-pane label="接口测试">接口测试</el-tab-pane>
              <el-tab-pane label="延迟测试">
                <div style="padding-left: 30px">
                  <el-form ref="form" :model="debugDelayTestForm" label-width="80px">
                    <el-form-item label="测试次数">
                      <el-input-number v-model="debugDelayTestForm.frequency" :min="10" :max="100"></el-input-number>
                    </el-form-item>
                    <el-form-item label="测试输入">
                      <el-checkbox-group v-model="debugDelayTestForm.input">
                        <el-checkbox v-for="option of delayTestInputOptions" :label="option" name="input"></el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="submitDelayTestForm">立即创建</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-drawer>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import server from "@/config/api/server";
import axios from "axios";
import Header from "../components/public/Header";

export default {
  name: "deploy",
  components: {
    Header
  },
  data() {
    return {
      // 服务器列表相关 start
      addServerDialogFormVisible: false,
      serverForm: {
        name: '',
        host: '',
        username: '',
        password: '',
      },
      formLabelWidth: '110px',
      serverList: [],
      activeServerIndex: '1',
      // 服务器列表相关 end
      // TorchServe相关 start
      configTorchServeDialogFormVisible: false,
      // TorchServe相关 end
      // 模型管理相关 start
      addModelDialogFormVisible: false,
      editModelDialogFormVisible: false,
      addModelForm: {
        url: '',
        model_name: '',
        initial_workers: 1,
        batch_size: 1,
        synchronous: false,
        response_timeout: 60,
      },
      editModelForm: {
        modelName: '',
        modelVersion: '',
        modelUrl: '',
        runtime: '',
        batchSize: 1,
        minWorkers: 1,
        maxWorkers: 1,
        synchronous: false,
      },
      modelTableData: [],
      searchModel: '',
      // 模型管理相关 end
      // 模型调试相关 start
      debugDrawerVisible: false,
      delayTestInputOptions: ["保险都是骗人的", "我之前做了心脏支架，能买你们保险吗", "保险等待期什么意思", "我现在不需要保险",
        "保险合同有纸质版的吗？"],
      debugDelayTestForm: {
        frequency: 10,
        input: [],
      }
      // 模型调试相关 end
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      server.getServerList().then(res => {
        this.serverList = res.data;
        this.handleSelectServer(1);
      }).catch(err => {
        console.log(err);
      })
    },
    handleSelectServer(key) {
      /**
       * 切换服务器
       * @type {string}
       */
      this.activeServerIndex = key.toString();
      // 模型列表置空
      this.modelTableData = [];
      // 获取模型列表
      this.getAllModelList();
    },
    async getAllModelList() {
      this.getTorchServeModelList();
      this.getServerModelList();
    },
    getTorchServeModelManagementUrl(serverIdx) {
      let serverHost = this.serverList[serverIdx - 1].host;
      return `http://${serverHost}:18081/models`;
    },
    getTorchServeModelList() {
      // Server索引转换为整数类型
      let serverIdx = parseInt(this.activeServerIndex);
      let serverHost = this.serverList[serverIdx - 1]["host"];
      let data = {"host": serverHost};
      server.getTorchServeModelList(data).then(res => {
        console.log(res);
        if (res.data["models"]) {
          this.modelTableData = res.data["models"];
        } else {
          this.modelTableData = [];
        }
      }).catch(err => {
        console.log(err);
      })
    },
    getServerModelList() {
      // Server索引转换为整数类型
      let serverIdx = parseInt(this.activeServerIndex);
      let serverData = this.serverList[serverIdx - 1];
      server.getModelList(serverData).then(res => {
        if (res.data["models"]) {
          for (let modelUrl of res.data["models"]) {
            // 如果 modelUrl 不在 modelTableData 中，则添加进 modelTableData
            if (!this.modelTableData.some(data => data.modelUrl === modelUrl)) {
              this.modelTableData.push({
                modelUrl: modelUrl,
              });
            }
          }
        } else {
          this.modelTableData = [];
        }
      }).catch(err => {
        console.log(err);
      })
    },
    handleEdit(index, row) {
      /**
       * 请求模型配置信息
       * @type {boolean}
       */
      this.editModelDialogFormVisible = true;
      let serverIdx = parseInt(this.activeServerIndex);
      let url = this.getTorchServeModelManagementUrl(serverIdx);
      axios.get(url + "/" + row.modelName).then(res => {
        this.editModelForm = res.data[0];
        this.editModelForm["url"] = row.modelUrl;
      }).catch(err => {
        console.log(err);
      })
    },
    handleDebug(index, row) {
      this.debugDrawerVisible = true;
      let serverIdx = parseInt(this.activeServerIndex);
      let url = this.getTorchServeModelManagementUrl(serverIdx);
      axios.get(url + "/" + row.modelName).then(res => {
        this.editModelForm = res.data[0];
      }).catch(err => {
        console.log(err);
      })
    },
    handleOffline(index, row) {
      let serverIdx = parseInt(this.activeServerIndex);
      let serverHost = this.serverList[serverIdx - 1]["host"];
      let data = {"host": serverHost, "modelName": row.modelName};
      server.offlineTorchServeModel(data).then(res => {
        console.log(res);
        this.getAllModelList();
      }).catch(err => {
        console.log(err);
      })
    },
    handleOnline(index, row) {
      // Server索引转换为整数类型
      let serverIdx = parseInt(this.activeServerIndex);
      let baseUrl = this.getTorchServeModelManagementUrl(serverIdx);
      let modelInfo = {
        url: row["modelUrl"],
        initial_workers: 1,
      };
      let queryList = [];
      for (let [key, value] of Object.entries(modelInfo)) {
        if (value) {
          queryList.push(`${key}=${value}`);
        }
      }
      let queryStr = queryList.join("&");
      let url = `${baseUrl}?${queryStr}`;
      this.registerModel(url);
    },
    handleDelete(index, row) {
      let serverIdx = parseInt(this.activeServerIndex);
      // 发送 ssh 信息，请求服务器删除模型
      let data = this.serverList[serverIdx - 1];
      data["modelName"] = row.modelUrl;
      server.deleteServerModel(data).then(res => {
        console.log(res);
        this.getAllModelList();
      }).catch(err => {
        console.log(err);
      })
    },
    addModel() {
      // 拼接模型注册地址
      let serverIdx = parseInt(this.activeServerIndex);
      let baseUrl = this.getTorchServeModelManagementUrl(serverIdx);
      let queryList = [];
      for (let [key, value] of Object.entries(this.addModelForm)) {
        if (value) {
          queryList.push(`${key}=${value}`);
        }
      }
      let queryStr = queryList.join("&");
      let url = `${baseUrl}?${queryStr}`;
      this.registerModel(url);
    },
    confirmEditModel(modelName) {
      // 拼接模型注册地址
      let serverIdx = parseInt(this.activeServerIndex);
      let serverHost = this.serverList[serverIdx - 1]["host"];
      console.log(this.editModelForm);
      let data = {
        "host": serverHost,
        "modelName": modelName,
        "minWorkers": this.editModelForm["minWorkers"],
        "maxWorkers": this.editModelForm["maxWorkers"],
        "synchronous": this.editModelForm["synchronous"],
      };
      server.updateTorchServeModel(data).then(res => {
        console.log(res);
        this.updateModelDialogFormVisible = false;
        // 刷新模型列表
        this.getAllModelList();
        // 清空添加模型表单
        this.updaModelForm = {
          modelName: '',
          modelVersion: '',
          modelUrl: '',
          runtime: '',
          batchSize: 1,
          minWorkers: 1,
          maxWorkers: 1,
          synchronous: false,
        };
      }).catch(err => {
        console.log(err);
      })
    },
    registerModel(url) {
      axios.post(url).then(res => {
        this.addModelDialogFormVisible = false;
        // 刷新模型列表
        this.getAllModelList();
        // 清空添加模型表单
        this.addModelForm = {
          url: '',
          model_name: '',
          initial_workers: 1,
          batch_size: 1,
          synchronous: false,
          response_timeout: 60,
        };
      }).catch(err => {
        console.log(err);
      })
    },
    submitDelayTestForm() {
      let latencies = [];
      for (let i = 0; i < this.debugDelayTestForm["frequency"]; i++) {
        let randomIdx = Math.floor(Math.random() * this.debugDelayTestForm["input"].length);
        let input = this.debugDelayTestForm["input"][randomIdx];
        let data = {
          "host": this.serverList[this.activeServerIndex - 1]["host"],
          "modelName": this.editModelForm["modelName"],
          "input": input,
        };
        let sendDate = (new Date()).getTime();
        this.requestModel(data);
        let latency = (new Date()).getTime() - sendDate;
        latencies.push(latency);
      }
      console.log(`latencies: ${latencies}`);
    },
    requestModel(data) {
      server.testTorchServeModel(data).then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      })
    },
  },
}
</script>

<style scoped>

</style>