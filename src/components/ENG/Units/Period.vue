<template>
    <div>
        <el-row>
            <md-button type="primary" @click="isPopupShow=true" icon="time">週期設定</md-button>
        </el-row>
        <md-popup v-model="isPopupShow" position="bottom">
            <md-popup-title-bar
                title="週期設定"
                describe="確認後才會覆寫到設備"
                cancel-text="返回"
                ok-text="確認"
                @cancel="cancel()"
                @confirm="confirm()">
            </md-popup-title-bar>
            <div class="e">
                <el-row>
                    <el-col :span="12" :offset="6">
                        <md-field>
                            <md-field-item title="週期時間">
                                <md-stepper slot="right" v-model="value"/>
                            </md-field-item>
                        </md-field>
                    </el-col>
                </el-row>
            </div>
        </md-popup>
    </div>
</template>

<script>
import { Button, Popup, PopupTitleBar, Stepper, Field, FieldItem, Icon, Toast} from "mand-mobile"
export default {
    name: "Period",
    components: {
        [Button.name]: Button,
        [PopupTitleBar.name]: PopupTitleBar,
        [Popup.name]: Popup,
        [Field.name]: Field,
        [FieldItem.name]: FieldItem,
        [Stepper.name]: Stepper,
        [Icon.name]: Icon,
    },
    props: {

    },
    data()
    {
        return {
            value: 0,
            isPopupShow: false,
        }
    },
    computed:
    {

    },
    watch:
    {
        async isPopupShow(val)
        {
            if(val)
            {
                await this.getInfo()
            }
        }
    },
    methods:
    {
        cancel()
        {
            this.isPopupShow = false
        },
        async confirm()
        {
            this.isPopupShow = false
            await this.updateInfo()
        },
        async getInfo()
        {
            this.$store.commit('update_isLoading', true)
            await fetch('http://10.11.20.108:9999/api/period',
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
                this.value = response["response"]
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
        async updateInfo()
        {
            this.$store.commit('update_isLoading', true)
            await fetch('http://10.11.20.108:9999/api/period',
            {
                method: "post",
                body: JSON.stringify({
                    period: this.value
                })
            })
            .then( response => {return response.json()})
            .then( response =>
            {
                if(response["Exception"])
                {
                    throw response["Exception"]
                }
                Toast.succeed("覆寫成功")
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

<style>

</style>