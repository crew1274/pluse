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
                <AGV :x="0" :y="50" :isRefresh="isRefresh" v-on:finishRefresh="finishRefresh" :realtimeData="realtimeData.AGV" />
                <!-- <Tray :isRefresh="isRefresh" v-on:finishRefresh="finishRefresh" /> -->
            </v-layer>
        </v-stage>
        <div v-for="(task, index) in Tasks" :key="index">
            <el-row class="hello">
                <el-col :span="20">
                    {{task.lotdata.itemno}} / {{task.lotdata.no}}
                </el-col>
                <el-col :span="4">
                        <el-button @click="Delete(index)" icon="el-icon-delete" type="danger">刪除</el-button>
                </el-col>
            </el-row>
            <md-steps :steps="task.steps" :current="task.current" />
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
import AGV from "@/components/Maps/device/AGV.vue"
import { Steps, Toast, Button} from "mand-mobile"

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
        AGV,
        [Steps.name]: Steps,
        [Button.name]: Button,
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
                width: 1200,
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
            Tasks:[],
        }
    },
    watch:
    {
        async isRefresh(val)
        {
            if(val)
            {
                await this.GetTasks()
            }
        }
    },
    async created()
    {
        await this.GetTasks()
    },
    async activated()
    {
        await this.GetTasks()
    },
    methods:
    {
        finishRefresh()
        {
            this.$emit('finishRefresh')
        },
        async Delete(index)
        {
            this.$confirm('此操作將永久刪除任務, 是否繼續?', '提示', {
                confirmButtonText: '確定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then( async () =>
            {
                // await this.$store.dispatch("_db", { 
                //     url: "_db/ENG-10/_api/document/Tasks/" + this.Tasks[index]['_key'],
                //     method: "DELETE",
                // })
                await fetch("http://10.11.20.108:9999/api/tc/",
                {
                    method: "DELETE",
                    body: JSON.stringify({
                        uid: this.Tasks[index]['uid']
                    })
                })
                .then( response => { return response.json() })
                .then( response =>
                {
                    if(response["Exception"])
                    {
                        throw response["Exception"]
                    }
                })
                .catch( err =>
                {
                    Toast.failed(err)
                })
                .finally( () => {} )
                await this.GetTasks()
                Toast.succeed("任務刪除成功")

            }).catch( () =>
            {
                Toast.succeed("取消操作")
            })
        },
        async GetTasks()
        {
            // let response = await this.$store.dispatch("_db", { 
            //     url: "_db/ENG-10/_api/cursor",
            //     method: "POST",
            //     payload: {
            //         "query": "FOR doc IN Tasks RETURN doc",
            //         "count": true
            //     }
            // })
            // this.Tasks = response['result']

            await fetch("http://10.11.20.108:9999/api/tc/",
            {
                method: "GET",
            })
            .then( response => { return response.json() })
            .then( response =>
            {
                if(response["Exception"])
                {
                    throw response["Exception"]
                }
                Toast.succeed("任務列表更新成功")
                this.Tasks = []
                this._.forOwn( response["response"], (value) =>
                {
                    this.Tasks.push(value)
                })
            })
            .catch( err =>
            {
                Toast.failed(err)
            })
            .finally( () => {} )
        }
    }
}
</script>

<style>

</style>