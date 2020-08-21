<template>
  <div class="hello">
      <!-- <p class="hello">料框定位:</p> -->
      <el-row>
          料框定位:
          <md-tag v-for="(stop, index) in cassette_info" :key="index" size="large" shape="circle" type="fill"
            :fill-color="stop.color" font-color="#fff">
            {{stop["name"]}}
          </md-tag>
      </el-row>
    <el-divider>自動操作類型</el-divider>
    <el-row :gutter="20">
      <el-col :span="8">
        <md-button type="primary" @click="askCassete">取得料框</md-button>
      </el-col>
      <el-col :span="16">
        <md-button type="primary" @click="confirmDialog.open = true" >送料到噴砂上料站(需先帶入參數)</md-button>
      </el-col>
    </el-row>
    <el-divider>手動操作類型</el-divider>
    <el-row :gutter="20">
      <el-col :span="8">
        <md-button type="primary" @click="askCassete" inactive>強制回應</md-button>
      </el-col>
      <el-col :span="8">
        <md-button type="primary" @click="askCassete" inactive>RESET</md-button>
      </el-col>
    </el-row>
    <el-divider />
      <div v-show="errMsg" class="errMsg">
          {{errMsg}}
      </div>
    <el-divider />
    <div v-show="wait_time">
      到站等待時間: {{wait_time}}(秒)
    </div>
    <md-dialog title="" v-model="confirmDialog.open" :btns="confirmDialog.btns" :closable="false">
      <!-- <div style="height:600px"> -->
      <div>
          <md-field title="確認生產資訊" brief="RFID感應工單、識別證可自動帶入">
            <md-input-item title="批號:" v-model="confirmDialog.lot.target" :solid="false" >
                <div slot="right">
                    <span @click="doPaste()">貼上</span>
                </div>
            </md-input-item>            
            <md-input-item title="工號:" v-model="confirmDialog.op.target" :solid="false" />
            <md-agree v-model="checked" @change="onChange">
              已確認先投料完成
          </md-agree>
          </md-field>
      </div>
    </md-dialog>
    <div style="height:220px">
      <md-selector v-model="isSelectorShow" :data="cassette_info" 
      title="選擇料框來源" describe="需先進行料框定位(下拉頁面取得)" okText="確認" cancel-text="取消"
      @confirm="onSelectorConfirm" large-radius />
    </div>
    <audio ref="audio" src="http://10.11.0.156/inflicted.mp3"></audio>
  </div>
</template>

<script>
import { Button, Toast, Steps, Tag, Dialog, Field, FieldItem, InputItem, Agree, Selector} from "mand-mobile";

export default {
  name: "AGV",
  components: {
    [Selector.name]: Selector,
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
    isRefresh: Boolean,
  },
  data()
  {
    return {
      errMsg: "",
      wait_time: "0",
      checked: false,
      isSelectorShow: false,
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
        {name: "調整站", stop: "210", status: "", color: "#FC7353", text:"調整站", value:"210", disabled:true},
        {name :"噴砂上料區", stop: "211", status: "", color: "#FC7353", text:"噴砂上料區", value:"211", disabled:true},
        {name :"噴砂下料區", stop: "212", status: "", color: "#FC7353", text:"噴砂下料區", value:"212", disabled:true},
        {name :"化金上下料區", stop: "213", status: "", color: "#FC7353", text:"化金上下料區", value:"212", disabled:true}
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
    async isRefresh(val)
    {
        if(val)
        {
            await this.getCasseteInfo(false)
            this.$emit('finishRefresh')
        }
    },
    agv_response(val)
    {
      if(this._.isArray(val) && val.length)
      {
        this._.forEach(val,  ele =>
        {
            if(ele["CMD"] == "24")
            {
              let msg = JSON.parse(ele["MSG"])
              if(this._.isArray(msg)) 
              {
                this.wait_time = msg[this._.sortedIndexBy(msg, 'SORT')]["MSG"]
              }
            }
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
    // this.getCasseteInfo(true)
  },
  async mounted()
  { 
    this.getCasseteInfo(false)
  },
  async beforeDestroy()
  {

  },
  async destroy()
  {

  },
  methods:
  {
    async onSelectorConfirm({value})
    {
      this.isSelectorShow = false
      this.$store.commit('update_isLoading', true)
      let payload =
      {
        EECODE: "",
        LOTNO: "",
        RCCODE: "",
        TITLE: "W",
        MSGID: "3017",
        CMD: "1",
        FLOOR: "2" ,
        STOP: "10",
        EQPTID: value,
        MSGTYPE: "API",
        MSG: "",
      }  
      this.errMsg = ""
      await this.$store.dispatch("call_agv", payload) /*發送指令*/
      await Promise.race([
        this.waitFor( () => this._.find(this.agv_response, {"CMD": payload["CMD"]})),
        this.waitFor( () => this._.find(this.agv_response, {"CMD": "23"})),
        this.timeoutCheck(5000)]) /*等待回應*/
      .then( (res) =>
      {
        if(res == "Timeout")
        {
          throw res
        }
        else if(res["CMD"] == "23")
        {
          throw "拒絕叫車"
        }
        Toast.info("叫車成功")
      })
      .catch( err =>
      {
        Toast.failed(err)
        this.errMsg = err
      })
      this.$store.commit('update_isLoading', false)
    },
    resetDialog()
    {
      this.checked = false
    },
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
        this.checked = false
    },
    async goCar()
    {
      // if(!this.confirmDialog.op.code || !this.confirmDialog.lot.target || !this.confirmDialog.lot.code)
      // {
      //   Toast.failed("資料缺少")
      //   return
      // }
      this.confirmDialog.open = false
      this.$store.commit('update_isLoading', true)
      let payload =
      {
        EECODE: this.confirmDialog.op.code,
        LOTNO: this.confirmDialog.lot.target,
        RCCODE: this.confirmDialog.lot.code,
        TITLE: "W",
        MSGID: "3017",
        CMD: "1",
        // CMD: "31",
        FLOOR: "2" ,
        STOP: "11",
        EQPTID: "210",
        MSGTYPE: "API",
        MSG: "",
      }      
      // console.log(payload)
      await this.$store.dispatch("call_agv", payload) /*發送指令*/
      this.errMsg = ""
      await Promise.race([ 
        this.waitFor( () => this._.find(this.agv_response, {"CMD": payload["CMD"]})),
        this.waitFor( () => this._.find(this.agv_response, {"CMD": "23"})),
        this.timeoutCheck(5000)]) /*等待回應*/
      .then( (res) =>
      {
        if(res == "Timeout")
        {
          throw res
        }
        else if(res["CMD"] == "23")
        {
          throw "拒絕叫車"
        }
        Toast.info("叫車成功")
        this.confirmDialog.lot.target = ""
        this.confirmDialog.lot.code = ""
        this.confirmDialog.op.target = ""
        this.confirmDialog.op.code = ""
        this.checked = false
        this.confirmDialog["btns"][1]["disabled"] = true
      })
      .catch( err =>
      {
        Toast.failed(err)
        this.errMsg = err
      })
      this.$store.commit('update_isLoading', false)
    },
    async askCassete()
    {
      // 檢查料框
      if(this.cassette_info[0]["status"] == "1")
      {
        Toast.info("調整站已有料框")
        return
      }
      this.isSelectorShow = true
    },
    async timeoutCheck(delay)
    {
        return new Promise( reject =>
        {
          setTimeout( () => { reject("Timeout") }, delay)
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
        {
          "ID": "213",
          "Status": "",
        },
      ]
      let payload =
      {
        EECODE: "",
        TITLE: "W",
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
          if(ele["Status"] != "2")
          {
            this.cassette_info[ind]["color"] = "#ada9a8"
            this.cassette_info[ind]["disabled"] = true
          }
          else
          {
            this.cassette_info[ind]["color"] = "#FC7353"
            this.cassette_info[ind]["disabled"] = false
          }
        })
        Toast.succeed("更新料框定位資料")
      })
      .catch( () =>
      {
        Toast.failed("請求回應逾時!")
      })
      .finally( () =>
      {
        if(isAwait)
        {
          this.$store.commit('update_isLoading', false)
        }
      })
    },
    doPaste()
    {
      navigator.clipboard.readText()
      .then( text => {
        this.confirmDialog.lot.target = text
        this.confirmDialog.lot.code = text
        Toast.succeed("貼上:" + text)
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
