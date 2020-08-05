<template>
  <div>
    <v-rect :config="ImageConfig" @click="showup"/>
    <v-text :config="TextConfig" />
    <v-text :config="StatusTextConfig" />
    <v-text :config="AGVTextConfig" />
    <v-rect :config="RedConfig" />
    <v-rect :config="YellowConfig" />
    <v-rect :config="GreenConfig" />

    <md-dialog v-model="isPopupShow" :btns="btns">
      <div >
          <md-tabs>
              <md-tab-pane name="1" label="詳細資料">
                  <md-detail-item title="批號:" :content="recipe.lotdata.no" bold />
                  <md-detail-item title="料號:" :content="recipe.lotdata.itemno"  />
                  <md-detail-item title="板高:" :content="recipe.recipe.Height" />
                  <md-detail-item title="板寬:" :content="recipe.recipe.Width" />
                  <md-detail-item title="生產總片數:" :content="recipe.recipe.QTY" />
              </md-tab-pane>
              <md-tab-pane name="2" label="操作動作">
                <el-row class="row-bg">
                  <md-button icon="edit" @click="redirect('Sand', 'Prod')">投料</md-button>
                </el-row>
                <el-row class="row-bg">
                  <md-button icon="setting" @click="redirect('Sand', 'Setting')">PLC重新連線</md-button>
                </el-row>
              </md-tab-pane>
          </md-tabs>
      </div>
    </md-dialog>
  </div> 
</template>

<script>
import { Dialog, Tabs, TabPane, DetailItem, Button} from "mand-mobile"
export default {
  name: "Fix",
  components:
  {
    [Dialog.name]: Dialog,
    [Button.name]: Button,
    [TabPane.name]: TabPane,
    [Tabs.name]: Tabs,
    [DetailItem.name]: DetailItem,
  },
  props:
  {
    x: Number,
    y: Number,
    realtimeData: Object,
  },
  data()
  {
    let x = this.x
    let y = this.y
    return {
      btns: [
          {
              text: "確認",
              handler: this.onCancel,
          },
      ],
      recipe: {},
      isPopupShow: false,
      GreenConfig:
      {
        x: x + 60,
        y: y,
        width: 15,
        height: 15,
        stroke: "green",
        strokeWidth: 1.5,
        fill: "white",
        shadowBlur: 10,
      },
      YellowConfig:
      {
        x: x + 60,
        y: y + 25,
        width: 15,
        height: 15,
        stroke: "yellow",
        strokeWidth: 1.5,
        fill: "white",
        shadowBlur: 10,
      },
      RedConfig:
      {
        x: x + 60,
        y: y + 50,
        width: 15,
        height: 15,
        stroke: "red",
        strokeWidth: 1.5,
        fill: "white",
        shadowBlur: 10,
      },
      ImageConfig:
      { 
        x: x,
        y: y,
        width: 50,
        height: 150,
        opacity: 0.5,
        stroke: "#FC9153",
        strokeWidth: 4,
      },
      TextConfig:
      {
          x: x,
          y: y,
          text: '噴砂上料站',
          fontSize: 20,
          height: 50,
          width: 100,
          fontFamily: 'Microsoft JhengHei',
          fill: '#FC9153',
      },
      StatusTextConfig:
      {
          x: x + 85,
          y: y,
          text: '',
          fontSize: 20,
          height: 50,
          width: 200,
          fontFamily: 'Microsoft JhengHei',
          fill: '#423c39',
      },
      AGVTextConfig:
      {
          x: x + 85,
          y: y + 100,
          text: '',
          fontSize: 20,
          height: 50,
          width: 200,
          fontFamily: 'Microsoft JhengHei',
          fill: '#423c39',
      },
    }
  },
  async created()
  {
      //定位 text
      this.TextConfig["x"] = this.ImageConfig["x"] +  ( this.ImageConfig["width"] / 2 ) - ( this.TextConfig["width"] / 2 )
      this.TextConfig["y"] = this.ImageConfig["y"] + 5 +  this.ImageConfig["height"]
  },
  async mounted()
  {
      // await this.get_token()
      // let a = await this.$store.dispatch("_db", { url: "_db/ENG-10/_api/gharial/ENG_TO_SAND", method: "GET", payload: {}})
      // console.log(a)
      // this.move_timer = await setInterval( () => { this.move() }, 500) //定期更新token
      await this.getdata()
  },
  async beforeDestroy()
  {
    // clearInterval(this.move_timer)
  },
  computed:
  {
  },
  watch:
  {
      realtimeData:
      {
          handler()
          {
              // console.log(newValue)
              this.updateStatus()
          },
          deep: true
      }
  },
  methods:
  {
    redirect(path, comp)
    {
      this.isPopupShow = false
      this.$router.push({ name: path, params: { components: comp }}).catch(() => {})
    },
    onCancel()
    {
      this.isPopupShow = false
    },
    showup()
    {
      this.isPopupShow = true
    },
    updateStatus()
    {
      this.realtimeData["三色燈-紅"] ? this.RedConfig["fill"] = "red" : this.RedConfig["fill"] = "white"
      this.realtimeData["三色燈-綠"] ? this.GreenConfig["fill"] = "green" : this.GreenConfig["fill"] = "white"
      this.realtimeData["三色燈-黃"] ? this.YellowConfig["fill"] = "yellow" : this.YellowConfig["fill"] = "white"
      
      if(this.realtimeData["機台狀況"] == 0)
      {
        this.StatusTextConfig['text'] = "系統正常"
      }
      else if(this.realtimeData["機台狀況"] == 1)
      {
        this.StatusTextConfig['text'] = "DRY RUN"
      }
      else if(this.realtimeData["機台狀況"] == 2)
      {
        this.StatusTextConfig['text'] = "自動運轉中"
      }
      else if(this.realtimeData["機台狀況"] == 3)
      {
        this.StatusTextConfig['text'] = "原點需復歸"
      }
      else if(this.realtimeData["機台狀況"] == 4)
      {
        this.StatusTextConfig['text'] = "系統總復歸中"
      }
      else if(this.realtimeData["機台狀況"] == 5)
      {
        this.StatusTextConfig['text'] = "暫停中"
      }
      else if(this.realtimeData["機台狀況"] == 6)
      {
        this.StatusTextConfig['text'] =  "機械原點"
      }
      else if(this.realtimeData["機台狀況"] == 7)
      {
        this.StatusTextConfig['text'] = "安全門開啟警報"
      }
      else if(this.realtimeData["機台狀況"] == 8)
      {
        this.StatusTextConfig['text'] = "急停開關被壓下"
      }
      else if(this.realtimeData["機台狀況"] == 9)
      {
        this.StatusTextConfig['text'] = "系統異常"
      }
      else if(this.realtimeData["機台狀況"] == 10)
      {
        this.StatusTextConfig['text'] = "單循環中"
      }
      else if(this.realtimeData["機台狀況"] == 11)
      {
        this.StatusTextConfig['text'] = "N/A"
      }
      else if(this.realtimeData["機台狀況"] == 12)
      {
        this.StatusTextConfig['text'] =  "物料警報"
      }

      if(this.realtimeData["AGV站執行流程"] == 0)
      {
        this.AGVTextConfig['text'] = "TRAY站，無循環"
      }
      else if(this.realtimeData["AGV站執行流程"] == 1)
      {
        this.AGVTextConfig['text'] = "TRAY叫車-中"
      }
      else if(this.realtimeData["AGV站執行流程"] == 2)
      {
        this.AGVTextConfig['text'] = "TRAY輸送-中"
      }
      else if(this.realtimeData["AGV站執行流程"] == 3)
      {
        this.AGVTextConfig['text'] = "TRAY出料-中"
      }
      else if(this.realtimeData["AGV站執行流程"] == 4)
      {
        this.AGVTextConfig['text'] = "TRAY調整-中"
      }
      else if(this.realtimeData["AGV站執行流程"] == 5)
      {
        this.AGVTextConfig['text'] = "TRAY自動調整-中"
      }

    },
    async getdata()
    {
        this.recipe = await this.$store.dispatch("_db", 
        {
            url: "_db/ENG-10/_api/document/DEVICES/Tray",
            method: "GET",
            payload: {}
        })
    },
  }
}
</script>

<style>

</style>