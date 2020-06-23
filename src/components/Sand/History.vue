<template>
    <div>
        <el-row>
            <div v-for="(item, index) in history_list" :key="index">
                <el-col :span="8">
                    <md-field>
                        <md-detail-item title="批號" :content="item.lotdata.no" bold />
                        <md-detail-item title="料號" :content="item.lotdata.itemno" />
                        <md-detail-item title="開始時間" :content="item.STARTDATETIME" />
                        <md-detail-item title="結束時間" :content="item.ENDDATETIME" />
                        <md-detail-item title="詳細">
                            <md-button  icon="id-card" @click="check_detail(index)">查看詳細</md-button>
                        </md-detail-item>
                    </md-field>
                </el-col>
            </div>
        </el-row>
        <md-dialog v-model="isPopupShow" :btns="btns">
            <div style="height:300px">
                <md-field title="詳細參數">
                    <md-detail-item title="板高:" :content="recipe.recipe.Height" />
                    <md-detail-item title="板寬:" :content="recipe.recipe.Width" />
                    <md-detail-item title="片數:" :content="recipe.recipe.QTY" />
                    <md-detail-item title="噴砂模式:" :content="recipe.recipe.Mode" />
                </md-field>
            </div>
        </md-dialog>
  </div>
</template>

<script>
import { DatePicker, Button, Field, FieldItem, DetailItem, Dialog, Toast} from "mand-mobile"
import * as moment from "moment/moment"

export default {
    name: "History",
    components:
    {
        [DatePicker.name]: DatePicker,
        [Button.name]: Button,
        [Field.name]: Field,
        [FieldItem.name]: FieldItem,
        [DetailItem.name]: DetailItem,
        [Dialog.name]: Dialog,
    },
    props:
    {
        isRefresh: Boolean,
    },
    data()
    {
        return {
            btns: [
                {
                    text: "確認",
                    handler: this.onBasicCancel,
                },
            ],
            history_list: [],
            recipe: {},
            isPopupShow: false,
        }
    },
    computed:
    {

    },
    watch:
    {
        async isRefresh(val)
        {
            if(val)
            {
                await this.getHistory()
                this.$emit('finishRefresh')
            }
        }
    },
    async beforeCreate()
    {
    },
    async beforeMount()
    {

    },
    async created()
    {
        moment.locale("zh-tw")
    },
    async mounted()
    { 
        await this.getHistory()
        this.recipe = this.history_list[0]
    },
    activated()
    {
        this.getHistory()
    },
    async beforeDestroy()
    {

    },
    async destroy()
    {

    },
    methods:
    {
        onBasicCancel()
        {
            this.isPopupShow = false
        },
        check_detail(index)
        {
            this.recipe = this.history_list[index]
            this.isPopupShow = true
        },
        async getHistory()
        {
            let now =  moment().subtract(12,'h').format('YYYY-MM-DD hh:mm:ss')
            let response = await this.$store.dispatch("_db", { 
                url: "_db/ENG-10/_api/cursor",
                method: "POST",
                payload: {
                    "query": "FOR doc IN SAND_HISTORY FILTER doc.`STARTDATETIME` > '" + now +"' SORT doc.STARTDATETIME RETURN doc",
                    "count": true
                }
            })
            Toast.info("噴砂線生產履歷更新成功")
            this.history_list = response["result"]
        }
    }
}
</script>

<style>

</style>