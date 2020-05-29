<template>
  <div class="hello">
      <!-- <p class="hello">料框定位:</p> -->
      <el-row>
        <el-col :span="18">
          料框定位:
          <md-tag v-for="(stop, index) in cassette_info" :key="index" size="large" shape="circle" type="fill"
            :fill-color="stop.color" font-color="#fff">
            {{stop["name"]}}
          </md-tag>
        </el-col>
        <el-col :span="6">
          <md-button type="primary" @click="getCasseteInfo(true)" >刷新料框資料</md-button>
        </el-col>
      </el-row>
  
    <el-divider />
    <el-row :gutter="10">
      <el-col :span="8">
        <md-button type="primary" @click="askCassete" inactive >取得料框</md-button>
      </el-col>
      <el-col :span="8">
        <md-button type="primary" @click="confirmDialog.open = true" >送料(需先帶入參數)</md-button>
      </el-col>
      <el-col :span="8">
        <md-button type="primary" @click="getCasseteInfo" inactive>輸送料框</md-button>
      </el-col>
    </el-row>
      <md-dialog title="" v-model="confirmDialog.open" :btns="confirmDialog.btns">
        <!-- <div style="height:600px"> -->
        <div>
            <md-field title="確認生產資訊" brief="RFID感應工單、識別證可自動帶入">
              <md-input-item title="批號:" v-model="confirmDialog.lot.target" :solid="false" />
              <md-input-item title="工號:" v-model="confirmDialog.op.target" :solid="false" />
              <md-agree v-model="checked" @change="onChange">
                已確認先投料完成
            </md-agree>
            </md-field>
        </div>
    </md-dialog>
  </div>
</template>

<script>
import { Button, Toast, Steps, Tag, Dialog, Field, FieldItem, InputItem, Agree} from "mand-mobile";

export default {
  name: "AGV",
  components: {
    [Agree.name]: Agree,
    [Field.name]: Field,
    [FieldItem.name]: FieldItem,
    [InputItem.name]: InputItem,
    [Button.name]: Button,
    [Steps.name]: Steps,
    [Tag.name]: Tag,
    [Dialog.name]: Dialog,
  },
  props: {
    msg: String
  },
  data()
  {
    return {
      checked: false,

      confirmDialog:
      {
        open: false, // 控制開關
        lot: {
          target: "",
          code: ""
        },
        op: {
          target: "",
          code: ""
        },
        btns: [
          {
            text: '取消',
            warning : true,
            icon: "wrong",
            handler: this.confirmCancel,
          },
          {
            text: 'AGV目的:噴砂上料區',
            warning : false,
            icon: "rectangle",
            handler: this.goCar,
            disabled: true,
          },
        ],
        
      },
      steps: [
        {
          name: '取得料框',
        },
        {
          name: '調整治具',
        },
        {
          name: '投入參數',
        },
        {
          name: '送出料框',
        },
      ],
      cassette_info: [ 
        {name: "調整站", stop: "210", status: "", color: "#FC7353"},
        {name :"噴砂上料區", stop: "211", status: "", color: "#FC7353"},
        {name :"噴砂下料區", stop: "212", status: "", color: "#FC7353"}
      ]
    }
  },
  computed:
  {
    agv_response()
    {
      return this.$store.state.agv_response
    },
    redis_msg()
    {
        return this.$store.state.redis_msg
    },
  },
  watch:
  {
    agv_response(val)
    {
      if(this._.isArray(val) && val.length)
      {
        this._.forEach(val,  ele =>
        {
            console.log(ele["CMD"])
        })
      }
    },
    redis_msg(value)
    {
        let val = value['msg']
        if(this.confirmDialog.open)
        {
            if(val["target"].length < 8)
            {
                Toast.info("RFID讀取到識別證:" + val["target"])
                this.confirmDialog.op.target = val["target"]
                this.confirmDialog.op.code = val["code"]
            }
            else
            {
                Toast.info("RFID讀取到工單:" + val["target"])
                this.confirmDialog.lot.target = val["target"]
                this.confirmDialog.lot.code = val["code"]
            }
        }
    },
  },
  async beforeCreate()
  {
  },
  async beforeMount()
  {

  },
  async created()
  {
    // this.getCasseteInfo(false)
  },
  async mounted()
  { 

  },
  async beforeDestroy()
  {

  },
  async destroy()
  {

  },
  methods:
  {
    onChange()
    {
      this.confirmDialog["btns"][1]["disabled"] = !this.checked
    },
    confirmCancel()
    {
        this.confirmDialog.open = false
        this.confirmDialog.op = {
            code: "", target: ""
        }
        this.confirmDialog.lot = {
            code: "", target: ""
        }
    },
    async goCar()
    {
      if(!this.confirmDialog.op.code || !this.confirmDialog.lot.target || !this.confirmDialog.lot.code)
      {
        Toast.failed("資料缺少")
        return
      }
      this.$store.commit('update_isLoading', true)
      let payload =
      {
        EECODE: this.confirmDialog.op.code,
        LOTNO: this.confirmDialog.lot.target,
        RCCODE: this.confirmDialog.lot.code,
        TITLE: "W",
        MSGID: "3017",
        CMD: "31",
        FLOOR: "2" ,
        STOP: "11",
        EQPTID: "210",
        MSGTYPE: "API",
        MSG: "",
      }      
      await this.$store.dispatch("call_agv", payload) /*發送指令*/
      await Promise.race([this.waitFor( () => this._.find(this.agv_response, {"CMD": "31"})), this.timeoutCheck(7000)]) /*等待回應*/
      .then( () =>
      {
        Toast.info("叫車成功")
      })
      .catch( () =>
      {
        Toast.failed("Timeout Error!")
      })
      this.$store.commit('update_isLoading', false)

    },
    async askCassete()
    {
      if(this.cassette_info[0]["status"] == "1")
      {
        Toast.info("調整站已有料框")
        return
      }
    },
    greet()
    {
      Toast.info("I'm Batman!")
    },
    async timeoutCheck(delay)
    {
        return new Promise( (reject) =>
        {
          setTimeout( () => { reject() }, delay)
        })
    },
    async getCasseteInfo(isAwait) //取得料框資訊
    {
      if(isAwait)
      {
        this.$store.commit('update_isLoading', true)
      }
      let query_command = 
      [
        {
          "ID": "210",
          "Status": "",
        },
        {
          "ID": "211",
          "Status": "",
        },
        {
          "ID": "212",
          "Status": "",
        },
      ]
      let payload =
      {
        EECODE: "",
        LOTNO: "",
        RCCODE: "",
        MSGID: "3017",
        CMD: "28",
        EQPTID: "210",
        MSGTYPE: "API",
        MSG: JSON.stringify(query_command),
      }
      await this.$store.dispatch("call_agv", payload) /*發送指令*/
      await Promise.race([this.waitFor( () => this._.find(this.agv_response, {"CMD": "28"})), this.timeoutCheck(5000)]) /*等待回應*/
      .then( result =>
      {
        // this.cassette_info = JSON.parse(result["MSG"])
        this._.forEach(JSON.parse(result["MSG"]),  ele =>
        {
          // 取得目前料盤狀態
          let ind = this._.findIndex(this.cassette_info, { 'stop': ele["ID"]})
          this.cassette_info[ind]["status"] = ele["Status"]
          if(ele["Status"] != "1")
          {
            this.cassette_info[ind]["color"] = "#ada9a8"
          }
          else
          {
            this.cassette_info[ind]["color"] = "#FC7353"
          }
        })
        Toast.info("更新成功")
      })
      .catch( () =>
      {
        Toast.failed("Timeout Error!")
      })
      .finally( () =>
      {
        if(isAwait)
        {
          this.$store.commit('update_isLoading', false)
        }
      })
    },
    async waitFor(conditionLogic) 
    {
        let poll = resolve =>
        {
          let result = conditionLogic()
          if( result )
          {
            resolve( result )
          }
          else
          {
            setTimeout( () => { poll(resolve) }, 100)
          }
        }
        return new Promise(poll)
    },
  }
};
</script>

<style scoped>
.hello {
  text-align: center;
  padding: 20px;
  font-size: 32px;
  color: #666;
  line-height: 56px;
}

.hello h1 {
  color: #333;
  line-height: 1.15;
  font-size: 64px;
  margin-bottom: 32px;
}

.hello h1 span {
  position: relative;
}

.hello h1 span::after {
  content: "";
  position: absolute;
  z-index: -1;
  left: 0;
  bottom: 8px;
  width: 100%;
  height: 20px;
  background: #ecf6ff;
}
</style>
