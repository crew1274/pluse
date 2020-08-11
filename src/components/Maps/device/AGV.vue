<template>
  <div>
    <v-text :config="TextConfig" />
    <v-text :config="TextConfig2" />
  </div> 
</template>

<script>
import { Dialog, Tabs, TabPane, DetailItem, Button } from "mand-mobile"
export default {
  name: "AGV",
  components:
  {
    [Dialog.name]: Dialog,
    [TabPane.name]: TabPane,
    [Tabs.name]: Tabs,
    [DetailItem.name]: DetailItem,
    [Button.name]: Button,
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
        TextConfig:
        {
            x: x,
            y: y,
            text: 'AGV預計到站時間',
            fontSize: 20,
            height: 30,
            width: 200,
            fontFamily: 'Microsoft JhengHei',
            fill: '#4a4b54',
        },
        TextConfig2:
        {
            x: x,
            y: y + 30,
            text: "",
            fontSize: 20,
            height: 50,
            width: 200,
            fontFamily: 'Microsoft JhengHei',
            fill: '#4a4b54',
        }
    }
  },
  async created()
  {

  },
  async mounted()
  {

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
        updateStatus()
        {
            this.TextConfig2["text"] = this.realtimeData["到站時間"]
        }
  }
}
</script>

<style>

</style>