<template>
    <div>
        <el-row>
            <md-button type="primary" @click="isPopupShow=true" icon="filter">浸泡槽設定</md-button>
        </el-row>
        <md-popup v-model="isPopupShow" position="bottom">
            <md-popup-title-bar
                title="浸泡槽設定"
                describe="確認後才會覆寫到設備"
                cancel-text="返回"
                ok-text="確認"
                @cancel="cancel()"
                @confirm="confirm()">
            </md-popup-title-bar>
            <div class="e">
                <md-check-group v-model="tanks">
                    <el-row>
                        <md-check-box name="#12活化槽">#12活化槽</md-check-box>
                        <el-divider direction="vertical" />
                        <md-check-box name="#13活化槽">#13活化槽</md-check-box>
                    </el-row>
                    <el-row>
                        <md-check-box name="#21化學鎳">#21化學鎳</md-check-box>
                        <el-divider direction="vertical" />
                        <md-check-box name="#22化學鎳">#22化學鎳</md-check-box>
                    </el-row>
                    <el-row>
                        <md-check-box name="#26化學金">#26化學金</md-check-box>
                        <el-divider direction="vertical" />
                        <md-check-box name="#27化學金">#27化學金</md-check-box>
                    </el-row>
                    <el-row>
                        <md-check-box name="#31厚金槽">#31厚金槽</md-check-box>
                        <el-divider direction="vertical" />
                        <md-check-box name="#32厚金槽">#32厚金槽</md-check-box>
                    </el-row>
                </md-check-group>
            </div>
        </md-popup>
    </div>
</template>

<script>
import { Button, Popup, PopupTitleBar, CheckBox, CheckGroup, Toast} from "mand-mobile"
export default {
    name: "TankSwitch",
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
            isPopupShow: false,
            all_tanks: ["#12活化槽", "#13活化槽", "#21化學鎳", "#22化學鎳", "#26化學金", "#27化學金", "#31厚金槽", "#32厚金槽"],
            tanks: [],
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
    async created()
    {
        await this.getInfo()
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
            await fetch('http://10.11.20.108:9999/api/use_tanks',
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
                if(this._.isArray(response["response"]))
                {   
                    this.tanks = []
                    for(let i=0; i<response["response"].length; i++)
                    {
                        if(response["response"][i])
                        {
                            this.tanks.push(this.all_tanks[i])
                        }
                    }
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
        async updateInfo()
        {
            this.$store.commit('update_isLoading', true)
            let p = []
            for(let i=0; i<8; i++)
            {
                this.tanks.includes(this.all_tanks[i]) ? p.push(1): p.push(0)
            }
            await fetch('http://10.11.20.108:9999/api/use_tanks',
            {
                method: "post",
                body: JSON.stringify({
                    tanks: p
                })
            })
            .then( response => {return response.json()})
            .then( response =>
            {
                if(response["Exception"])
                {
                    throw response["Exception"]
                }
                if(this._.isArray(response["response"]))
                {   
                    for(let i=0; i<response["response"].length; i++)
                    {
                        if(response["response"][i])
                        {
                            this.tanks.push(this.all_tanks[i])
                        }
                    }
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
    }
}
</script>

<style>
.e {
  background: #ffffff;
  font-size: 30px;
  color: #27282a;
}
</style>