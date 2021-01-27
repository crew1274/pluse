<template>
    <div>
        <el-menu
            :default-active="activeIndex"
            @select="handleSelect"
            mode="horizontal"
            background-color="#545c64"
            text-color="#fff" active-text-color="#ffd04b">
            <el-menu-item index="Map">物料狀況</el-menu-item>
            <el-menu-item index="Error">異常履歷</el-menu-item>
            <el-menu-item index="Action">化金自動上下料動作紀錄</el-menu-item>
            <el-menu-item index="System">程式資訊</el-menu-item>
        </el-menu>
        <keep-alive>
            <component :is="activeIndex" :isRefresh="isRefresh" v-on:finishRefresh="finishRefresh" :realtimeData="realtimeData" />
        </keep-alive>
    </div>
</template>

<script>
import Map from "@/components/Map.vue"
import Error from "@/components/Error.vue"
import Action from "@/components/Action.vue"
import System from "@/components/System.vue"

export default {
    name: "Graphical",
    components:
    {
        Map,
        Error,
        Action,
        System,
    },
    props: 
    {
        isRefresh: Boolean,
    },
    data()
    {
      return {
        activeIndex: 'Map',
        realtimeData: {},
      }
    },
    async created()
    {

    },
    mounted()
    {

    },
    beforeDestroy()
    {
        // clearInterval(this.token_timer)
    },
    watch:
    {
        '$store.state.errorMessage':
        {
            handler(newValue)
            {
                this.$notify.warning({ title: newValue.title, message: newValue.message})
            },
            deep: true
        },
        '$store.state._ws_back':
        {
            handler(newValue)
            {
                this.realtimeData = newValue
                // console.log(newValue)
            },
            deep: true
        }
    },
    methods:
    {
        handleSelect(key)
        {
            this.activeIndex = key
        },
        async get_token()
        {
            let response = await this.$store.dispatch("_db", { 
                url: "_open/auth",
                method: "POST",
                payload: { username: "ENG_10", password: "ENG_10"},
            })
            this.$store.commit('update_token', 'Bearer ' + response["jwt"])
        },
        finishRefresh()
        {
            this.$emit('finishRefresh')
        }
    }
  }
</script>

<style>

</style>