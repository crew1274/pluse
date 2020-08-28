<template>
    <div>
        <el-row>
            <md-button type="primary" @click="isPopupShow=true" icon="check">狀態設定</md-button>
        </el-row>
        <md-popup v-model="isPopupShow" position="bottom">
            <md-popup-title-bar
                title="化金狀態設定"
                describe="需確認覆寫後才會更新狀態"
                cancel-text="跳回"
                ok-text="確認覆寫"
                @cancel="cancel()"
                @confirm="confirm()">
            </md-popup-title-bar>
            <div class="e">
                <el-row>
                    <el-col :span="8">
                        <el-card shadow="always" header="化金出料鎖定">
                            <el-row>
                                <el-switch v-model="isLock" active-text="鎖定" inactive-text="解鎖" />
                            </el-row>
                        </el-card> 
                    </el-col>
                </el-row>
            </div>
        </md-popup>
    </div>
</template>

<script>
import { Button, Popup, PopupTitleBar, CheckBox, CheckGroup, Toast} from "mand-mobile"
export default {
    name: "Out",
    components: {
        [Button.name]: Button,
        [PopupTitleBar.name]: PopupTitleBar,
        [Popup.name]: Popup,
        [CheckBox.name]: CheckBox,
        [CheckGroup.name]: CheckGroup,
    },
    props: {

    },
    data()
    {
        return {
            isLock: false,
            isPopupShow: false,
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
            await this.PutLockStatus()
        },
        async PutLockStatus()
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
  font-size: 30px;
  color: #27282a;
}

.el-switch  >>> .el-switch__label
{
  font-size: 20px;
}

</style>