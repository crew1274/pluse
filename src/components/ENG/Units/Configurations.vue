<template>
    <div>
        <el-row>
            <md-button type="primary" @click="isPopupShow=true" icon="setting">狀態設定</md-button>
        </el-row>
        <md-popup v-model="isPopupShow" position="bottom">
            <md-popup-title-bar
                title="化金相關設定"
                describe="確認後才會覆寫到設備"
                cancel-text="返回"
                ok-text="確認"
                @cancel="cancel()"
                @confirm="confirm()">
            </md-popup-title-bar>
            <div class="e">
                <el-row :gutter="10 ">
                    <el-col :span="12">
                        <el-card shadow="always" header="化金上下料系統與設備主站連線">
                            <el-row>
                                <el-switch v-model="isConnect" active-text="連線" inactive-text="斷線" />
                            </el-row>
                        </el-card>  
                        <el-card shadow="always" header="化金出料鎖定">
                            <el-row>
                                <el-switch v-model="isLock" active-text="上鎖" inactive-text="解鎖" />
                            </el-row>
                        </el-card> 
                        <el-card shadow="always" header="厚金時間線上即時預測">
                            <el-row>
                                <el-switch v-model="doOverWrite" active-text="打開" inactive-text="關閉" />
                            </el-row>
                        </el-card> 
                    </el-col>
                    <el-col :span="12">
                        <el-card shadow="always" header="化金提早出料鎖定時間設定">
                            <md-field>
                                <md-field-item title="厚金結束前(秒)">
                                    <md-stepper v-model="time" step="10"/>
                                </md-field-item>
                            </md-field>
                        </el-card> 
                    </el-col>
                </el-row>
            </div>
        </md-popup>
    </div>
</template>

<script>
import { Button, Popup, PopupTitleBar, CheckBox, CheckGroup, Toast, Stepper, Field, FieldItem, Icon} from "mand-mobile"
export default {
    name: "Configurations",
    components: {
        [Button.name]: Button,
        [PopupTitleBar.name]: PopupTitleBar,
        [Popup.name]: Popup,
        [CheckBox.name]: CheckBox,
        [CheckGroup.name]: CheckGroup,
        [Stepper.name]: Stepper,
        [Field.name]: Field,
        [FieldItem.name]: FieldItem,
        [Icon.name]: Icon,
    },
    props: {

    },
    data()
    {
        return {
            isLock: false,
            isConnect: false,
            isPopupShow: false,
            doOverWrite: false,
            time: 180,
        }
    },
    computed:
    {

    },
    watch:
    {

    },
    async created()
    {
        await this.getLockStatus()
        await this.getTime()
        await this.getConnect()
        await this.getdoOverWrite()
    },
    methods:
    {
        cancel()
        {
            this.isPopupShow = false
            this.getLockStatus()
            this.getConnect()
            this.getdoOverWrite()
        },
        async confirm()
        {
            this.isPopupShow = false
            await this.Update()
        },
        async Update()
        {
            this.$store.commit('update_isLoading', true)

            await fetch('http://10.11.20.108:9999/api/isConnect',
            {
                method: "POST",
                body: JSON.stringify({
                    isConnect: this.isConnect
                })
            })
            .then( response => {return response.json()})
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
            .finally( () =>
            {
                this.$store.commit('update_isLoading', false)
            })

            await fetch('http://10.11.20.108:9999/api/isLock',
            {
                method: "POST",
                body: JSON.stringify({
                    isLock: this.isLock
                })
            })
            .then( response => {return response.json()})
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
            .finally( () =>
            {
                this.$store.commit('update_isLoading', false)
            })
            await fetch('http://10.11.20.108:9999/api/time',
            {
                method: "POST",
                body: JSON.stringify({
                    time: this.time
                })
            })
            .then( response => {return response.json()})
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
            .finally( () =>
            {
                this.$store.commit('update_isLoading', false)
            })
            Toast.succeed("更新")
        },
        async getTime()
        {
            this.$store.commit('update_isLoading', true)
            await fetch('http://10.11.20.108:9999/api/time',
            {
                method: "GET",
            })
            .then( response => {return response.json()})
            .then( response =>
            {
                if(response["Exception"])
                {
                    throw response["Exception"]
                }
                this.time = response["response"]
            })
            .catch( err =>
            {
                Toast.failed(err)
            })
            .finally( () =>
            {
                this.$store.commit('update_isLoading', false)
            })
        },
        async getConnect()
        {
            this.$store.commit('update_isLoading', true)
            await fetch('http://10.11.20.108:9999/api/isConnect',
            {
                method: "GET",
            })
            .then( response => {return response.json()})
            .then( response =>
            {
                if(response["Exception"])
                {
                    throw response["Exception"]
                }
                this.isConnect = !!response["response"]
            })
            .catch( err =>
            {
                Toast.failed(err)
            })
            .finally( () =>
            {
                this.$store.commit('update_isLoading', false)
            })
        },
        async getLockStatus()
        {
            this.$store.commit('update_isLoading', true)
            await fetch('http://10.11.20.108:9999/api/isLock',
            {
                method: "GET",
            })
            .then( response => {return response.json()})
            .then( response =>
            {
                if(response["Exception"])
                {
                    throw response["Exception"]
                }
                this.isLock = response["response"]
            })
            .catch( err =>
            {
                Toast.failed(err)
            })
            .finally( () =>
            {
                this.$store.commit('update_isLoading', false)
            })
        },
    }
}
</script>

<style scoped>
.e { 
  background: #ffffff;
  color: #27282a;
}
</style>