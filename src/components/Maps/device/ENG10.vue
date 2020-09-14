<template>
  <div>
    <v-rect :config="ImageConfig"/>
    <v-text :config="TextConfig" />
    <v-text :config="StatusTextConfig" />
    <v-rect :config="StatusConfig" />
    <div v-for="(item, index) in bays" :key="index">
      <v-rect :config="item.config" @click="showup(index)"/>
      <v-text :config="item.TextConfig" />
    </div>
  
    <md-dialog v-model="isPopupShow" :btns="btns" class="info">
      <div >
          <md-tabs>
              <md-tab-pane name="1" label="批號參數">
                  <md-detail-item title="批號:" :content="recipe.lotdata.no" bold />
                  <md-detail-item title="料號:" :content="recipe.lotdata.itemno"  />
                  <md-detail-item title="生產總片數:" :content="recipe.recipe.QTY" />
                  <md-detail-item title="每框片數:" :content="recipe.recipe.eachQTY" />
                  <md-detail-item title="化鎳時間(秒):" :content="recipe.recipe.ENiPlatedtime" />
                  <md-detail-item title="化金時間(秒):" :content="recipe.recipe.EAuPlatedtime" />
                  <md-detail-item title="厚金時間(秒):" :content="recipe.recipe.EHAuPlatedtime" />
              </md-tab-pane>
              <md-tab-pane name="2" label="生產資訊">
                  <md-detail-item title="入料時間:" :content="recipe.STARTDATETIME" />
                  <md-detail-item title="預估出料時間:"  />
                  <md-detail-item title="當前槽位:"  />
                  <md-detail-item title="當前浸泡時間:" />
                  <md-detail-item title="前往目標槽:" />
              </md-tab-pane>
              <md-tab-pane name="3" label="操作動作">
                <md-button icon="edit" @click="edit('NI')">更新化鎳時間</md-button>
                <md-button icon="edit" @click="edit('AU')">更新厚金時間</md-button>
              </md-tab-pane>
          </md-tabs>
      </div>
    </md-dialog>
  </div> 
</template>

<script>
import { Dialog, Tabs, TabPane, DetailItem, Button, Icon, Toast} from "mand-mobile"
export default {
  name: "ENG10",
  components:
  {
    [Dialog.name]: Dialog,
    [TabPane.name]: TabPane,
    [Button.name]: Button,
    [Tabs.name]: Tabs,
    [Icon.name]: Icon,
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
      target_note: [],
      btns: [
          {
              text: "確認",
              handler: this.onCancel,
          },
      ],
      recipe: 
      {
        "STARTDATETIME": "2020-09-03 11:20:28",
        "lotdata": {
          "itemno": "RD-2018100412",
          "itemver": "A1D01",
          "mfver": "AB",
          "no": "2020071020-1-1-1",
          "procseq": "031"
        },
        "procdata": {
          "procname": "化金(1)",
          "procprams": {
            "procpram": [
              {
                "_ErpName": "化鎳厚度(μ)",
                "procprammes": "ENiThick",
                "procvalue": "0"
              },
              {
                "_ErpName": "化金厚度(μ)",
                "procprammes": "EAuThick",
                "procvalue": "0"
              },
              {
                "_ErpName": "化金面積(上)SQ/IN",
                "procprammes": "EFrontareaSQ",
                "procvalue": "96.659"
              },
              {
                "_ErpName": "化金面積(下)SQ/IN",
                "procprammes": "EBackareaSQ",
                "procvalue": "102.748"
              },
              {
                "_ErpName": "化金程式選擇",
                "procprammes": "Program",
                "procvalue": "1"
              },
              {
                "_ErpName": "化鎳時間",
                "procprammes": "ENiPlatedtime",
                "procvalue": "2400"
              },
              {
                "_ErpName": "化金時間",
                "procprammes": "EAuPlatedtime",
                "procvalue": "480"
              },
              {
                "_ErpName": "厚金時間",
                "procprammes": "EHAuPlatedtime",
                "procvalue": "2200"
              },
              {
                "_ErpName": "銑邊後尺寸-長",
                "procprammes": "Height",
                "procvalue": "431"
              },
              {
                "_ErpName": "銑邊後尺寸-寬",
                "procprammes": "Width",
                "procvalue": "297.33"
              },
              {
                "_ErpName": "入料輸送速度",
                "procprammes": "LoadSpeed",
                "procvalue": "2"
              },
              {
                "_ErpName": "水洗輸送速度",
                "procprammes": "WaterSpeed",
                "procvalue": "2"
              },
              {
                "_ErpName": "噴砂輸送速度",
                "procprammes": "SandblastingSpeed",
                "procvalue": "2"
              },
              {
                "_ErpName": "上噴砂壓力",
                "procprammes": "UpPressure",
                "procvalue": "1.5"
              },
              {
                "_ErpName": "下噴砂壓力",
                "procprammes": "DownPressure",
                "procvalue": "1.5"
              },
              {
                "_ErpName": "烘乾溫度",
                "procprammes": "Temperature",
                "procvalue": "60"
              },
              {
                "_ErpName": "片數",
                "procprammes": "QTY",
                "procvalue": "2"
              }
            ]
          }
        },
        "recipe": {
          "EAuPlatedtime": 480,
          "EHAuPlatedtime": "2250",
          "ENiPlatedtime": "2800",
          "Height": 431,
          "QTY": "6",
          "Width": 297.33,
          "eachQTY": "2"
        },
      },
      isPopupShow: false,
      ImageConfig:
      { 
        x: x,
        y: y,
        width: 720,
        height: 100,
        opacity: 0.5,
        stroke: "#538bfc",
        strokeWidth: 4,
      },
      StatusConfig:
      { 
        x: x + 100,
        y: y - 50 ,
        width: 15,
        height: 15,
        stroke: "green",
        strokeWidth: 1.5,
        fill: "white",
        shadowBlur: 10,
      },
      TextConfig:
      {
          x: x,
          y: y,
          text: '化金主站',
          fontSize: 20,
          height: 50,
          width: 100,
          fontFamily: 'Microsoft JhengHei',
          fill: '#538bfc',
      },
       StatusTextConfig:
      {
          x: x,
          y: y - 50,
          text: '啟動允用:',
          fontSize: 20,
          height: 50,
          width: 100,
          fontFamily: 'Microsoft JhengHei',
          fill: '#423c39',
      },
      bays: [],
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
      await this.getdata()
  },
  async beforeDestroy()
  {
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
              this.updateStatus()
          },
          deep: true
      }
  },
  methods:
  {
    edit()
    { 
      Toast.info("功能尚未開放")
    },
    updateTransformer()
    {
    
      this.$refs.transformer.getNode().getLayer().batchDraw()
    },
    async move()
    {
      // 清空當前顯示
      this.bays.forEach(bay =>
      {
          bay["config"]["visible"] = false
          bay["TextConfig"]["visible"] = false
      })
      for(let i=0; i<this.target_note.length; i++)
      {
        for(let k=0; k<this.bays.length; k++)
        {
          if(this.bays[k]["target_number"] == this.target_note[i]["number"])
          {
            this.bays[k]["config"]["x"] = this.ImageConfig.x + 20 * (36 - ( + this.target_note[i]["pos"]))
            this.bays[k]["config"]["visible"] = true

            this.bays[k]["TextConfig"]["x"] = this.ImageConfig.x + 20 * (36 - ( + this.target_note[i]["pos"])) - 25
            this.bays[k]["TextConfig"]["text"] = "#" + this.target_note[i]["pos"] + ":" + this.target_note[i]["number"]
            this.bays[k]["TextConfig"]["visible"] = true
          }
        }
      }
    },
    updateStatus()
    {
        // PLC 資料 render
        this.realtimeData["啟動允用"] ? this.StatusConfig["fill"] = "green" : this.StatusConfig["fill"] = "white"

        let keys = Object.keys(this.realtimeData)
        let now_targets = []
        this._(keys).forEach( key =>
        {
          if( key.includes("料框編號"))
          {
            if(this.realtimeData[key])
            {
              // 有料框編號值
              now_targets.push(
                {
                  pos: key.match(/\d+/)[0],
                  number: this.realtimeData[key]
                }
              )
            }
          }        
        })
        //比對
        if(! this._.isEqual(this.target_note, now_targets))
        {
          //不一樣代表狀態有變更
          this.target_note = now_targets
          this.move()
        }
    },
    onCancel()
    {
        this.isPopupShow = false
    },
    showup(index)
    {
      this.isPopupShow = true
      this.recipe = this.bays[index]
    },
    async getdata()
    {
        //取得料框資料
        for(let i=1; i<4; i++)
        {
          let a  = await this.$store.dispatch("_db", 
          {
              url: "_db/ENG-10/_api/document/TARGETS/" + i ,
              method: "GET",
              payload: {}
          })
          if(a.lotdata)
          {
            a["config"] = 
            {
                x: this.ImageConfig.x,
                y: this.ImageConfig.y,
                width: 15,
                height: 75,
                opacity: 1,
                stroke: "#fc5386",
                strokeWidth: 3,
                visible: false,
            }
            a["TextConfig"] = 
            {
                x: this.ImageConfig.x,
                y: this.ImageConfig.y + 75,
                text: '#',
                fontSize: 20,
                width: 75,
                height: 75,
                fill: "#fc5386",
                fontFamily: 'Microsoft JhengHei',
                visible: false,
            }
            // 給定靶號
            a["target_number"] = i
            this.bays.push(a)
          }
        }
    },
  }
}
</script>

<style>
.info
{
  width: 80%
}
</style>