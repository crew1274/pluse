<template>
    <div>
        <el-row>
            <md-button type="primary" @click="isPopupShow=true" icon="check">狀態設定</md-button>
        </el-row>
        <md-popup v-model="isPopupShow" position="bottom">
            <md-popup-title-bar
                title="化金狀態設定"
                describe="確認後才會覆寫到PLC"
                cancel-text="返回"
                ok-text="確認"
                @cancel="cancel()"
                @confirm="confirm()">
            </md-popup-title-bar>
            <div class="e">
                <el-row>
                    <el-col :span="12">
                        <el-card shadow="always" header="化金出料鎖定">
                            <el-row>
                                <el-switch v-model="isLock" active-text="鎖定" inactive-text="解鎖" />
                            </el-row>
                        </el-card> 
                    </el-col>
                    <el-col :span="12">
                        <el-card shadow="always" header="化金提早出料時間">
                            <el-row>
                                <md-field>
                                    <md-field-item title="厚金結束前(秒)">
                                        <md-stepper v-model="time" step="10"/>
                                    </md-field-item>
                                </md-field>
                            </el-row>
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
    name: "Out",
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
            isPopupShow: false,
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
    },
    methods:
    {
        cancel()
        {
            this.isPopupShow = false
            this.getLockStatus()
        },
        async confirm()
        {
            this.isPopupShow = false
            await this.Update()
        },
        async Update()
        {
            this.$store.commit('update_isLoading', true)
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