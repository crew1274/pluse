<template>
  <div>
    <v-rect :config="ImageConfig" @click="showup"/>
    <v-text :config="TextConfig" />
    <md-dialog v-model="isPopupShow" :btns="btns">
      <div>
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
                  <md-button icon="edit" @click="redrict('Prod')">投料</md-button>
                </el-row>
              </md-tab-pane>
          </md-tabs>
      </div>
    </md-dialog>
  </div> 
</template>

<script>
import { Dialog, Tabs, TabPane, DetailItem, Button } from "mand-mobile"
export default {
  name: "ENG10Loader",
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
        width: 140,
        height: 100,
        opacity: 0.5,
        stroke: "#FC9153",
        strokeWidth: 4,
      },
      TextConfig:
      {
          x: x,
          y: y,
          text: '化金上下料站',
          fontSize: 20,
          height: 50,
          width: 140,
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
  },
  methods:
  {
    redrict(comp)
    {
      this.$router.push({ name: 'ENG', params: { components: comp }})
    },
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