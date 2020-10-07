<template>
    <div>
        <el-row>
            <md-button type="primary" @click="isPopupShow=true" icon="mobile-phone">更槽保養</md-button>
        </el-row>
        <md-popup v-model="isPopupShow" position="bottom">
            <md-popup-title-bar
                title="化金主站厚金槽更槽保養紀錄"
                describe="更槽保養後會影響下一次厚金預測秒數"
                cancel-text="返回"
                @cancel="cancel()">
            </md-popup-title-bar>
            <div class="e">
                <el-row>
                    <el-col :span="24">
                        <el-card shadow="always" header="化金主站厚金槽更槽保養紀錄">
                            <el-row>
                                <el-col :span="17">
                                    <el-table :data="data" border style="width: 100%" height="350">
                                        <el-table-column label="更槽日期" prop="datetime" />
                                        <el-table-column label="槽位" prop="tank" />
                                    </el-table>
                                </el-col>
                                <el-col :span="1">
                                    <el-divider direction="vertical" />
                                </el-col>
                                <el-col :span="6">
                                    <md-button type="primary" icon="mobile-phone" @click="pre_add('#31厚金槽')" >#31更槽保養</md-button>
                                <el-divider />
                                    <md-button type="primary" icon="mobile-phone" @click="pre_add('#32厚金槽')" >#32更槽保養</md-button>
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </md-popup>
    </div>
</template>

<script>
import * as moment from "moment/moment"
import { Button, Popup, PopupTitleBar, CheckBox, CheckGroup, Toast, Stepper, Field, FieldItem, Icon} from "mand-mobile"
export default {
    name: "DownTank",
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
            data: [],
            date_range: [],
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
        moment.locale("zh-tw")
        this.date_range.push(moment().subtract(7,'d').format('YYYY-MM-DD'))
        this.date_range.push(moment().add(1,'d').format('YYYY-MM-DD'))
        await this.getData()
        
    },
    methods:
    {
        cancel()
        {
            this.isPopupShow = false
            this.getData()
        },
        async pre_add(tank)
        {
            this.$confirm('新增更槽保養將會影響預測時間且不能刪除，是否繼續?', '確認'+tank+'更槽保養',
            {
                confirmButtonText: '確定更槽保養',
                cancelButtonText: '我按錯了',
                type: 'warning',
                center: true,
            })
            .then( async () => {
                await this.add(tank)
            })
        },
        async add(tank)
        {
            await fetch("http://10.11.20.108:9999/api/DownTank",
            {
                method: "POST",
                body: JSON.stringify({
                    tank: tank
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
            await this.getData()
        },
        async getData()
        {
            this.$store.commit('update_isLoading', true)
            await fetch("http://10.11.20.108:9999/api/DownTank?start=" + this.date_range[0] + "&end=" + this.date_range[1],
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
                this.data = response["result"]
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