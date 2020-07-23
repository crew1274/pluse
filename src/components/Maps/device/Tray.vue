<template>
  <div>
    <v-rect :config="configTray" @click="showup"/>
    <v-text :config="configTrayText" />
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
  name: "Tray",
  components: {
    [Dialog.name]: Dialog,
    [TabPane.name]: TabPane,
    [Tabs.name]: Tabs,
    [DetailItem.name]: DetailItem,
  },
  props: 
  {
      isRefresh: Boolean,
  },
  data()
  {
    return {
      btns: [
          {
              text: "確認",
              handler: this.onBasicCancel,
          },
      ],
      isPopupShow: false,
      move_timer: undefined,
      configTray:
      { 
        x: 160,
        y: 500,
        width: 80,
        height: 50,
        opacity: 0.5,
        stroke: "#383634",
        strokeWidth: 4,
      },
      configTrayText:
      {
          x: 160,
          y: 550,
          text: '治具載盤',
          fontSize: 20,
          height: 50,
          width: 80,
          fontFamily: 'Microsoft JhengHei',
          fill: '#383634',
      },
      recipe: {}
    }
  },
  async created()
  {
      //定位 text
      this.configTrayText["x"] = this.configTray["x"]
      this.configTrayText["y"] = this.configTray["y"] + 50
  },
  async mounted()
  {
      // this.move_timer = await setInterval( () => { this.move() }, 500) //定期更新token

      await this.getdata()
  },
  async beforeDestroy()
  {
    clearInterval(this.move_timer)
  },
  computed:
  {
  },
  watch:
  {    
    isRefresh(val)
    {
      if(val)
      {
        this.$emit('finishRefresh')
      }
    }
  },
  methods:
  {
    onBasicCancel()
    {
        this.isPopupShow = false
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
    move()
    {
      this.configTray['x'] = this.configTray['x'] + 10
      if(this.configTray['x'] > 600)
      {
        this.configTray['x'] = 0
      }
      this.configTrayText['x'] = this.configTrayText['x'] + 10
      if(this.configTrayText['x'] > 600)
      {
        this.configTrayText['x'] = 0
      }
    },
    showup()
    {
      this.isPopupShow = true
    }
  }
}
</script>

<style>

</style>