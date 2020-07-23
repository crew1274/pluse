<template>
    <div>
        <el-menu
            :default-active="activeIndex"
            mode="horizontal"
            background-color="#545c64"
            text-color="#fff" active-text-color="#ffd04b">
            <el-menu-item index="1">物料狀況</el-menu-item>
        </el-menu>
        <Map :isRefresh="isRefresh" v-on:finishRefresh="finishRefresh" />
    </div>
</template>

<script>
import Map from "@/components/Map.vue"
export default {
    name: "Edge",
    components:
    {
        Map,
    },
    props: 
    {
        isRefresh: Boolean,
    },
    data()
    {
      return {
        activeIndex: '1',
      }
    },
    async created()
    {
        // await this.get_token()
    },
    async mounted()
    {
        // await this.get_token()
        // let a = await this.$store.dispatch("_db", { url: "_db/ENG-10/_api/gharial/ENG_TO_SAND", method: "GET", payload: {}})
        // console.log(a)
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
    },
    methods:
    {
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