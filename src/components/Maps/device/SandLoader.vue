<template>
  <div>
    <v-rect :config="ImageConfig" @click="showup"/>
    <v-text :config="TextConfig" />
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
                修正
              </md-tab-pane>
          </md-tabs>
      </div>
    </md-dialog>
  </div> 
</template>

<script>
import { Dialog, Tabs, TabPane, DetailItem } from "mand-mobile"
export default {
  name: "SandLoader",
  components:
  {
    [Dialog.name]: Dialog,
    [TabPane.name]: TabPane,
    [Tabs.name]: Tabs,
    [DetailItem.name]: DetailItem,
  },
  props:
  {
    x: Number,
    y: Number,
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
      }
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
  },
  methods:
  {
    onCancel()
    {
        this.isPopupShow = false
    },
    showup()
    {
      this.isPopupShow = true
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