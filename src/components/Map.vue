<template>
    <div>
        <v-stage :config="configKonva">
            <v-layer>
                <ENG10Loader :x="150" :y="100" :isRefresh="isRefresh" v-on:finishRefresh="finishRefresh" />
                <ENG10 :x="325" :y="100" :isRefresh="isRefresh" v-on:finishRefresh="finishRefresh" :realtimeData="realtimeData.ENG"/>
                <Fix :x="150" :y="500" :isRefresh="isRefresh" v-on:finishRefresh="finishRefresh" :realtimeData="realtimeData.SandFix" />
                <Sand :x="325" :y="250" :isRefresh="isRefresh" v-on:finishRefresh="finishRefresh" />
                <SandLoader :x="625" :y="250" :isRefresh="isRefresh" v-on:finishRefresh="finishRefresh" :realtimeData="realtimeData.SandIn"/>
                <SandUnloader :x="250" :y="250" :isRefresh="isRefresh" v-on:finishRefresh="finishRefresh" :realtimeData="realtimeData.SandOut" />
                <!-- <Tray :isRefresh="isRefresh" v-on:finishRefresh="finishRefresh" /> -->
            </v-layer>
        </v-stage>
        <div>
            <el-row class="hello">
                噴砂流程
            </el-row>
            <md-steps :steps="Sandsteps" />
        </div>
        <div>
            <el-row class="hello">
                化金流程
            </el-row>
            <md-steps :steps="ENGsteps" />
        </div>
    </div>
</template>

<script>
// import Tray from "@/components/Maps/device/Tray.vue"
import Sand from "@/components/Maps/device/Sand.vue"
import SandLoader from "@/components/Maps/device/SandLoader.vue"
import SandUnloader from "@/components/Maps/device/SandUnloader.vue"
import ENG10Loader from "@/components/Maps/device/ENG10Loader.vue"
import ENG10 from "@/components/Maps/device/ENG10.vue"
import Fix from "@/components/Maps/device/Fix.vue"
import { Steps} from "mand-mobile"


export default {
    name: "Map",
    components:
    {
        // Tray,
        Sand,
        SandLoader,
        SandUnloader,
        ENG10Loader,
        ENG10,
        Fix,
        [Steps.name]: Steps,
    },
    props: 
    {
        isRefresh: Boolean,
        realtimeData: Object,
    },
    data()
    {
        return {
        Sandsteps: [
            {
                name: '調整站',
            },
            {
                name: '噴砂上料站',
            },
            {
                name: '噴砂主站',
            },
            {
                name: '噴砂下料站',
            },
            {
                name: '調整站',
            },
        ],
        ENGsteps: [
            {
                name: '調整站',
            },
            {
                name: '化金上下料站',
            },
            {
                name: '化金主站',
            },
            {
                name: '化金上下料站',
            },
            {
                name: '噴砂上料站',
            },
            {
                name: '噴砂主站',
            },
            {
                name: '噴砂下料站',
            },
            {
                name: '調整站',
            },
        ],
            configKonva:
            {
                x: 24,
                y: 0,
                width: 1000,
                height: 750,
            },
            configFIX:
            {
                x: 150,
                y: 500,
                width:100,
                height: 100,
                opacity: 0.5,
                stroke: "#FC9153",
                strokeWidth: 4,
            },
            configSANDunloader:
            {
                x: 675,
                y: 250,
                width:50,
                height: 150,
                opacity: 0.5,
                stroke: "#FC9153",
                strokeWidth: 4,
            },
            configSANDloader:
            {
                x: 300,
                y: 250,
                width:50,
                height: 150,
                opacity: 0.5,
                stroke: "#FC9153",
                strokeWidth: 4,
            },
            configFIXTEXT:
            {
                x: 150,
                y: 460,
                text: '治具調整站',
                fontSize: 20,
                height: 50,
                fontFamily: 'Microsoft JhengHei',
                fill: '#FC9153',
            },
            configSANDloaderTEXT:
            {
                x: 640,
                y: 220,
                text: '噴砂上料站',
                fontSize: 20,
                height: 50,
                fontFamily: 'Microsoft JhengHei',
                fill: '#FC9153',
            },
            configSANDunloaderTEXT:
            {
                x: 280,
                y: 220,
                text: '噴砂下料站',
                fontSize: 20,
                height: 50,
                fontFamily: 'Microsoft JhengHei',
                fill: '#FC9153',
            },
            configENGloaderTEXT:
            {
                x: 125,
                y: 50,
                text: '自動化金上下料站',
                fontSize: 20,
                height: 50,
                fontFamily: 'Microsoft JhengHei',
                fill: '#FC9153',
            },
            configENGloader: {
                x: 150,
                y: 100,
                width:100,
                height: 100,
                opacity: 0.5,
                stroke: "#FC9153",
                strokeWidth: 4,
            },
            configENG:
            {
                x: 275,
                y: 100,
                width:400,
                height: 100,
                opacity: 0.5,
                stroke: "#538bfc",
                strokeWidth: 4,
            },
            configENGTEXT:
            {
                x: 375,
                y: 50,
                text: '自動化金主站',
                fontSize: 20,
                height: 50,
                fontFamily: 'Microsoft JhengHei',
                fill: '#538bfc',
            },
        }
    },
    methods:
    {
        finishRefresh()
        {
            this.$emit('finishRefresh')
        }
    }
}
</script>

<style>

</style>