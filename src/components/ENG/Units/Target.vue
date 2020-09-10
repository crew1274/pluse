<template>
    <div>
        <el-row>
            <md-button type="primary" @click="isPopupShow=true" icon="location">飛靶手動設定</md-button>
        </el-row>
        <md-popup v-model="isPopupShow" position="bottom">
            <md-popup-title-bar
                title="飛靶手動設定"
                describe="點擊確認才會更新"
                cancel-text="返回"
                ok-text="確認"
                @cancel="cancel()"
                @confirm="confirm()">
            </md-popup-title-bar>
            <div class="e">
                <md-check-group v-model="tanks">
                    <el-row>
                        <md-check-box name="#1清潔槽">#1清潔槽</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#2熱水洗">#2熱水洗</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#3水洗槽">#3水洗槽</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#4水洗槽">#4水洗槽</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#5微蝕槽">#5微蝕槽</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#6純水洗">#6純水洗</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#7純水洗">#7純水洗</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#8酸洗槽">#8酸洗槽</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#9純水洗">#9純水洗</md-check-box>
                    </el-row>
                    <el-divider />
                    <el-row>
                        <md-check-box name="#10純水洗">#10純水洗</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#11預浸槽">#11預浸槽</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#12活化槽">#12活化槽</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#13活化槽">#13活化槽</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#14純水洗">#14純水洗</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#15純水洗">#15純水洗</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#16純水洗">#16純水洗</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#17後浸槽">#17後浸槽</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#18熱水洗">#18熱水洗</md-check-box>
                    </el-row>
                    <el-divider />
                    <el-row>
                        <md-check-box name="#19純水洗">#19純水洗</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#20純水洗">#20純水洗</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#21化學鎳">#21化學鎳</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#22化學鎳">#22化學鎳</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#23純水洗">#23純水洗</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#24純水洗">#24純水洗</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#25純水洗">#25純水洗</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#26化學金">#26化學金</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#27化學金">#27化學金</md-check-box>
                    </el-row>
                        <el-divider />
                    <el-row>
                        <md-check-box name="#28金回收">#28金回收</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#29純水洗">#29純水洗</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#30純水洗">#30純水洗</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#31厚金槽">#31厚金槽</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#32厚金槽">#32厚金槽</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#33金回收">#33金回收</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#34純水洗">#34純水洗</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#35純水洗">#35純水洗</md-check-box>
                            <el-divider direction="vertical" />
                        <md-check-box name="#36上下料">#36上下料</md-check-box>
                    </el-row>
                </md-check-group>
            </div>
        </md-popup>
    </div>
</template>

<script>
import { Button, Popup, PopupTitleBar, CheckBox, CheckGroup, Toast} from "mand-mobile"
export default {
    name: "Target",
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
            all_tanks: [ "#1清潔槽", "#2熱水洗", "#3水洗槽", "#4水洗槽", "#5微蝕槽", "#6純水洗", "#7純水洗", "#8酸洗槽",
                         "#9純水洗", "#10純水洗", "#11預浸槽", "#12活化槽", "#13活化槽", "#14純水洗", "#15純水洗", "#16純水洗",
                         "#17後浸槽", "#18熱水洗", "#19純水洗", "#20純水洗", "#21化學鎳", "#22化學鎳", "#23純水洗", "#24純水洗",
                         "#25純水洗", "#26化學金", "#27化學金", "#28金回收", "#29純水洗", "#30純水洗", "#31厚金槽", "#32厚金槽",
                         "#33金回收", "#34純水洗", "#35純水洗", "#36上下料",],
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
            await this.getInfo()
        },
        async getInfo()
        {
            this.$store.commit('update_isLoading', true)
            await fetch('http://10.11.20.108:9999/api/target_tanks',
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
            await fetch('http://10.11.20.108:9999/api/target_tanks',
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