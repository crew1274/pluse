<template>
  <div>
    <v-rect :config="ImageConfig"/>
    <v-text :config="TextConfig" />
    <v-text :config="StatusTextConfig" />
    <v-rect :config="StatusConfig" @click="s_isPopupShow = true" />
    <div>
      <div v-for="(item, index) in bays" :key="index">
        <v-rect :config="item.config" @click="showup(index)"/>
        <v-text :config="item.TextConfig" />
      </div>
    </div>

    <div> 
      <div v-for="(item, index) in m_bays" :key="index">
        <v-rect :config="item.config" @click="m_showup(index)"/>
        <v-text :config="item.TextConfig" />
      </div>
    </div>
    <md-dialog v-model="s_isPopupShow" class="info">
      <div >
        <center>啟動允用強制開關</center>
        <md-switch v-model="D90" @change="D90Switch" />
      </div>
    </md-dialog>
  
    <md-dialog v-model="m_isPopupShow" class="info">
      <div >
      <center>手動上料(無料框編號)</center>
      <md-tabs>
              <md-tab-pane name="1" label="批號參數">
                  <md-detail-item title="批號:" :content="lot" bold />
                  <md-detail-item title="料號:" :content="part"  />
              </md-tab-pane>
      </md-tabs>
      </div>
    </md-dialog>

    <md-dialog v-model="isPopupShow" class="info">
      <div >
        <center>料框編號:{{recipe["target_number"]}}</center>
          <md-tabs>
              <md-tab-pane name="1" label="批號參數">
                  <md-detail-item title="批號:" :content="recipe.lotdata.no" bold />
                  <md-detail-item title="料號:" :content="recipe.lotdata.itemno"  />
                  <md-detail-item title="生產總片數:" :content="recipe.recipe.QTY" />
                  <md-detail-item title="每框片數:" :content="recipe.recipe.eachQTY" />
                  <div v-if="recipe.use_mode == '虛擬量測'">
                      <md-detail-item title="化鎳時間-虛擬量測(秒):" :content="recipe.predict_result.NI" >
                          <md-tag fill-color="#FC9153" type="fill" font-color="#fff">{{recipe.predict_result.NI}}</md-tag>
                      </md-detail-item>
                      <md-detail-item title="化金時間(秒):" :content="recipe.recipe.EAuPlatedtime" />
                      <md-detail-item title="厚金時間-虛擬量測(秒):" :content="recipe.predict_result.AU" >
                          <md-tag fill-color="#FC9153" type="fill" font-color="#fff">{{recipe.predict_result.AU}}</md-tag>
                      </md-detail-item>
                  </div>
                  <div v-else>
                      <md-detail-item title="化鎳時間(秒):" :content="recipe.recipe.ENiPlatedtime" />
                      <md-detail-item title="化金時間(秒):" :content="recipe.recipe.EAuPlatedtime" />
                      <md-detail-item title="厚金時間(秒):" :content="recipe.recipe.EHAuPlatedtime" />
                  </div>
              </md-tab-pane>
              <md-tab-pane name="2" label="生產資訊">
                  <md-detail-item title="入料時間:" :content="recipe.STARTDATETIME" />
                  <md-detail-item title="預估出料時間:" :content="recipe.Expected_ENDDATETIME" />
                  <md-detail-item title="當前槽位:" :content="recipe.Tank" />
                  <md-detail-item title="剩餘浸泡時間:" />
                  <md-detail-item title="前往目標槽:" />
              </md-tab-pane>
              <md-tab-pane name="3" label="操作動作">
                <md-button @click="edit_show=!edit_show" class="small">更新化鎳(NI)/厚金(AU)時間</md-button>
                  <div v-show="edit_show">
                    <md-input-item title="化鎳時間(秒):" type="digit" v-model="recipe.recipe.ENiPlatedtime" align="right"
                    is-highlight>
                    <div slot="right">
                      <el-button type="warning" @click="edit">
                        確認覆寫
                      </el-button>
                    </div>
                    </md-input-item>
                    <md-input-item title="厚金時間(秒):" type="digit" v-model="recipe.recipe.EHAuPlatedtime" align="right"
                    is-highlight>
                    <div slot="right">
                      <el-button type="warning" @click="edit">
                        確認覆寫
                      </el-button>
                    </div>
                    </md-input-item>
                  </div>
              </md-tab-pane>
          </md-tabs>
      </div>
    </md-dialog>
  </div> 
</template>

<script>
import { Dialog, Tabs, TabPane, DetailItem, Button, Icon, Toast, InputItem, Field, Tag, Switch} from "mand-mobile"
export default {
  name: "ENG10",
  components:
  {
    [Dialog.name]: Dialog,
    [Tag.name]: Tag,
    [TabPane.name]: TabPane,
    [Button.name]: Button,
    [Tabs.name]: Tabs,
    [Icon.name]: Icon,
    [DetailItem.name]: DetailItem,
    [InputItem.name]: InputItem,
    [Field.name]: Field,
    [Switch.name]: Switch,
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
      arrow: "arrow-down",
      D90: false,
      lot: "",
      part: "",
      edit_show: false,
      target_note: [],
      btns: [
          {
              text: "確認",
              handler: this.onCancel,
          },
      ],
      recipe: 
      {
        "target_number": 1,
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
      m_isPopupShow: false,
      s_isPopupShow: false,
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
      m_bays: [],
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
      this.updateStatus()
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
      },
      D90(value)
      {
          value ? this.StatusConfig["fill"] = "green" : this.StatusConfig["fill"] = "white"
      }
  },
  methods:
  {
    async D90Switch()
    {
      this.$store.commit('update_isLoading', true)
      await fetch('http://10.11.20.108:9999/api/D90',
      {
          method: "POST",
          body: JSON.stringify({ 
                  D90: this.D90,
              })
      })
      .then( response => {return response.json()})
      .then( response =>
      {
          if(response["Exception"])
          {
              throw response["Exception"]
          }
          response["response"]? 
          Toast.succeed("更新成功(狀態不會立即更動)") :
          Toast.failed("更新失敗")
      })
      .catch( err =>
      {
          this.$notify.warning({ title: '更新失敗', message: err})
      })
      .finally( () =>
      {
          this.$store.commit('update_isLoading', false)
      })
    },
    async edit()
    { 
        this.$store.commit('update_isLoading', true)
        this.edit_show = false
        this.isPopupShow = false
        await fetch('http://10.11.20.108:9999/api/target_tanks',
        {
            method: "POST",
            body: JSON.stringify({ 
                    target_tanks: this.recipe["target_number"],
                    recipe: this.recipe.recipe,
                })
        })
        .then( response => {return response.json()})
        .then( response =>
        {
            if(response["Exception"])
            {
                throw response["Exception"]
            }
            response["response"]? 
            Toast.succeed("更新成功") :
            Toast.failed("更新失敗")
        })
        .catch( err =>
        {
            this.$notify.warning({ title: '投料失敗', message: err})
        })
        .finally( () =>
        {
            this.$store.commit('update_isLoading', false)
        })

        this.$store.commit('update_isLoading', true)
        await this.$store.dispatch("_db", 
        {
            url: "_db/ENG-10/_api/document/TARGETS/" + this.recipe["target_number"],
            method: "PUT",
            payload: this.recipe
        })

        this.$store.commit('update_isLoading', false)
    },
    async move()
    {
      // 清空當前顯示
      this.bays.forEach(bay =>
      {
          bay["config"]["visible"] = false
          bay["TextConfig"]["visible"] = false
      })
      
      this.m_bays.forEach( m_bay =>
      {
          m_bay["config"]["visible"] = false
          m_bay["TextConfig"]["visible"] = false
      })
      for(let i=0; i< this.target_note.length; i++)
      {
        // 手動上料用
        if( typeof this.target_note[i]["number"] == "string" && this.target_note[i]["number"].includes("@"))
        {
          if(this.target_note[i]["pos"] == "天車")
          {
              this.m_bays[i]["config"]["y"] = this.ImageConfig.y - 20
              this.m_bays[i]["TextConfig"]["y"] = this.ImageConfig.y + 55
              this.m_bays[i]["config"]["visible"] = true
              this.m_bays[i]["TextConfig"]["visible"] = true
          }
          else
          {
              this.m_bays[i]["config"]["x"] = this.ImageConfig.x + 20 * (36 - ( + this.target_note[i]["pos"]))
              this.m_bays[i]["config"]["y"] = this.ImageConfig.y
              this.m_bays[i]["config"]["visible"] = true

              this.m_bays[i]["TextConfig"]["x"] = this.ImageConfig.x + 20 * (36 - ( + this.target_note[i]["pos"])) - 25
              this.m_bays[i]["TextConfig"]["y"] = this.ImageConfig.y + 75
              this.m_bays[i]["TextConfig"]["text"] = "#" + this.target_note[i]["pos"] + "_手動"
              this.m_bays[i]["TextConfig"]["visible"] = true
              this.m_bays[i]["Tank"] = "#" + this.target_note[i]["pos"]
              let s = this.target_note[i]["number"].split('@').join(',').split('[').join(',').split(']').join(',').split(',')
              this.m_bays[i]["lot"] = s[2]
              this.m_bays[i]["part"] = s[1]
          }
        }

        // 自動上料用
        for(let k=0; k<this.bays.length; k++)
        {        
          if(this.bays[k]["target_number"] == this.target_note[i]["number"])
          {
            if(this.target_note[i]["pos"] == "天車")
            {
                this.bays[k]["config"]["y"] = this.ImageConfig.y - 20
                this.bays[k]["TextConfig"]["y"] = this.ImageConfig.y + 55
                this.bays[k]["config"]["visible"] = true
                this.bays[k]["TextConfig"]["visible"] = true
            }
            else
            {
                this.bays[k]["config"]["x"] = this.ImageConfig.x + 20 * (36 - ( + this.target_note[i]["pos"]))
                this.bays[k]["config"]["y"] = this.ImageConfig.y
                this.bays[k]["config"]["visible"] = true

                this.bays[k]["TextConfig"]["x"] = this.ImageConfig.x + 20 * (36 - ( + this.target_note[i]["pos"])) - 25
                this.bays[k]["TextConfig"]["y"] = this.ImageConfig.y + 75
                this.bays[k]["TextConfig"]["text"] = "#" + this.target_note[i]["pos"] + ":" + this.target_note[i]["number"]
                this.bays[k]["TextConfig"]["visible"] = true
                this.bays[k]["Tank"] = "#" + this.target_note[i]["pos"]
            }
          }
        }
      }
    },
    updateStatus()
    {
        // console.log(this.realtimeData)
        // PLC 資料 render
        this.D90 = !! this.realtimeData["啟動允用"]

        let keys = Object.keys(this.realtimeData)
        let now_targets = []
        this._(keys).forEach( key =>
        {
            if( key.includes("批號編號") && this.realtimeData[key])
            {
                // 批號編號 料號編號
                let part = key.match(/\d+/)[0]
                if(! this.realtimeData["#" + part + "料框編號"] )
                {
                  part  = "#" + part + "料號編號"
                  part = this.realtimeData[part]
                  if(key.includes("天車"))
                  {
                    now_targets.push(
                      {
                        pos: "天車",
                        number: part + "[" + this.realtimeData[key] + "]"
                      })
                  } 
                  else
                  {
                    now_targets.push(
                      {
                        pos: key.match(/\d+/)[0],
                        number: "@" + part + "[" + this.realtimeData[key] + "]"
                      })
                  }
                }
            }
          
          else if( key.includes("料框編號") && this.realtimeData[key])
          {
            if(key.includes("天車"))
            {
                  now_targets.push(
                    {
                      pos: "天車",
                      number: this.realtimeData[key]
                    }
                  )
            } 
            else
            {
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
        this.m_isPopupShow = false
    },
    showup(index)
    {
      this.isPopupShow = true
      this.recipe = this.bays[index]
    },
    m_showup(index)
    {
      this.m_isPopupShow = true
      this.lot = this.m_bays[index]["lot"]
      this.part = this.m_bays[index]["part"]
    },
    async getdata()
    {
        // 初始化6個手動框架
        for(let i=0; i<6; i++)
        {
          let a = {}
          a["config"] = 
          {
              x: this.ImageConfig.x,
              y: this.ImageConfig.y,
              width: 15,
              height: 75,
              opacity: 1,
              stroke: "#6037db",
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
              fill: "#6037db",
              fontFamily: 'Microsoft JhengHei',
              visible: false,
          }
          this.m_bays.push(a)
        }
        
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
.small
{
  font-size: 14px
}
</style>