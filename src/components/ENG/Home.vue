<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <md-button icon="id-card" @click="check_detail('1')">料框1</md-button>
            </el-col>
            <el-col :span="8">
                <md-button icon="id-card" @click="check_detail('2')">料框2</md-button>
            </el-col>
            <el-col :span="8">
                <md-button icon="id-card" @click="check_detail('3')">料框3</md-button>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-card class="normalText">
                <div slot="header">
                    <span>化金線投料區參數</span>
                    <!-- <el-button style="float: right; padding: 3px 0" type="text" @click="getPrevRecipe">重新整理</el-button> -->
                </div>
                <el-col :span="12">
                    <md-field title="批號資料">
                        <md-detail-item title="批號:" :content="recipe_READY.lotdata.no" bold @click.native="doCopy(recipe_READY.lotdata.no)"/>
                        <md-detail-item title="料號:" :content="recipe_READY.lotdata.itemno"  />
                        <md-detail-item title="製程序:" :content="recipe_READY.lotdata.procseq"  />
                        <md-detail-item title="料號版次:" :content="recipe_READY.lotdata.itemno"  />
                        <md-detail-item title="製造版次:" :content="recipe_READY.lotdata.mfver"  />
                    </md-field>
                </el-col>
                <el-col :span="12">
                    <md-field title="詳細參數">
                        <md-detail-item title="板高:" :content="recipe_READY.recipe.Height" />
                        <md-detail-item title="板寬:" :content="recipe_READY.recipe.Width" />
                        <md-detail-item title="生產總片數:" :content="recipe_READY.recipe.QTY" />
                        <md-detail-item title="每框片數:" :content="recipe_READY.recipe.eachQTY" />
                        <md-detail-item title="化鎳時間(秒):" :content="recipe_READY.recipe.ENiPlatedtime" />
                        <md-detail-item title="化金時間(秒)" :content="recipe_READY.recipe.EAuPlatedtime" />
                        <md-detail-item title="厚金時間(秒)" :content="recipe_READY.recipe.EHAuPlatedtime" />
                    </md-field>
                </el-col>
            </el-card>
        </el-row>
        <el-row :gutter="10">
            <el-card class="normalText">
                <div slot="header">
                    <span>化金線預備綁定區參數</span>
                    <!-- <el-button style="float: right; padding: 3px 0" type="text" @click="getPrevRecipe">重新整理</el-button> -->
                </div>
                <el-col :span="12">
                    <md-field title="批號資料">
                        <md-detail-item title="批號:" :content="recipe_BUFFER.lotdata.no" bold @click.native="doCopy(recipe_BUFFER.lotdata.no)"/>
                        <md-detail-item title="料號:" :content="recipe_BUFFER.lotdata.itemno"  />
                        <md-detail-item title="製程序:" :content="recipe_BUFFER.lotdata.procseq"  />
                        <md-detail-item title="料號版次:" :content="recipe_BUFFER.lotdata.itemno"  />
                        <md-detail-item title="製造版次:" :content="recipe_BUFFER.lotdata.mfver"  />
                    </md-field>
                </el-col>
                <el-col :span="12">
                    <md-field title="詳細參數">
                        <md-detail-item title="板高:" :content="recipe_BUFFER.recipe.Height" />
                        <md-detail-item title="板寬:" :content="recipe_BUFFER.recipe.Width" />
                        <md-detail-item title="生產總片數:" :content="recipe_BUFFER.recipe.QTY" />
                        <md-detail-item title="每框片數:" :content="recipe_BUFFER.recipe.eachQTY" />
                        <md-detail-item title="化鎳時間(秒):" :content="recipe_BUFFER.recipe.ENiPlatedtime" />
                        <md-detail-item title="化金時間(秒)" :content="recipe_BUFFER.recipe.EAuPlatedtime" />
                        <md-detail-item title="厚金時間(秒)" :content="recipe_BUFFER.recipe.EHAuPlatedtime" />
                    </md-field>
                </el-col>
            </el-card>
        </el-row>
        <md-dialog v-model="isPopupShow" :btns="btns">
            <div >
                <md-tabs>
                    <md-tab-pane name="1" label="批號資料">
                        <md-detail-item title="批號:" :content="recipe.lotdata.no" bold @click.native="doCopy(recipe.lotdata.no)"/>
                        <md-detail-item title="料號:" :content="recipe.lotdata.itemno"  />
                        <md-detail-item title="製程序:" :content="recipe.lotdata.procseq"  />
                        <md-detail-item title="料號版次:" :content="recipe.lotdata.itemno"  />
                        <md-detail-item title="製造版次:" :content="recipe.lotdata.mfver"  />
                    </md-tab-pane>
                    <md-tab-pane name="2" label="詳細參數">
                        <md-detail-item title="板高:" :content="recipe.recipe.Height" />
                        <md-detail-item title="板寬:" :content="recipe.recipe.Width" />
                        <md-detail-item title="生產總片數:" :content="recipe.recipe.QTY" />
                        <md-detail-item title="每框片數:" :content="recipe.recipe.eachQTY" />
                        <md-detail-item title="化鎳時間(秒):" :content="recipe.recipe.ENiPlatedtime" />
                        <md-detail-item title="化金時間(秒):" :content="recipe.recipe.EAuPlatedtime" />
                        <md-detail-item title="厚金時間(秒):" :content="recipe.recipe.EHAuPlatedtime" />
                    </md-tab-pane>
                </md-tabs>
            </div>
        </md-dialog>
    </div>
</template>

<script>
import { Button, Toast, NumberKeyboard, Field, FieldItem, InputItem, Dialog, Switch, DetailItem
        ,RadioBox, RadioGroup, Radio, ScrollView, Popup, PopupTitleBar, Tabs, TabPane} from "mand-mobile"
export default {
    name: "Home",
    components: {
        [Popup.name]: Popup,
        [TabPane.name]: TabPane,
        [Tabs.name]: Tabs,
        [PopupTitleBar.name]: PopupTitleBar,
        [Button.name]: Button,
        [ScrollView.name]: ScrollView,
        [Switch.name]: Switch,
        [Field.name]: Field,
        [InputItem.name]: InputItem,
        [NumberKeyboard.name]: NumberKeyboard,
        [Dialog.name]: Dialog,
        [DetailItem.name]: DetailItem,
        [RadioBox.name]: RadioBox,
        [Radio.name]: Radio,
        [RadioGroup.name]: RadioGroup,
        [FieldItem.name]: FieldItem,
    },
    props: {
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
            isPopupShow: false,

            recipe_BUFFER: {},
            recipe_READY: {},
            recipe : {
                lotdata: {},
                recipe: {}
            },
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
                await this.getPrevRecipe()
                this.$emit('finishRefresh')
            }
        }
    },
    async beforeCreate()
    {
        
    },
    async created()
    {
        
    },
    async beforeMount()
    {

    },
    async mounted()
    { 
        await this.getPrevRecipe()
    },
    async beforeDestroy()
    {
    },
    async destroy()
    {

    },
    activated() 
    {
        this.getPrevRecipe()
    },
    deactivated() 
    {

    },
    methods:
    {
        onBasicCancel()
        {
            this.isPopupShow = false
        },
        async check_detail(key)
        {
            this.recipe = await this.$store.dispatch("_db", 
            {
                url: "_db/ENG-10/_api/document/TARGETS/" + key,
                method: "GET",
                payload: {}
            })
            this.isPopupShow = true
        },
        async getPrevRecipe()
        {
            await fetch('http://10.11.20.108:9999/api/now/ENG_HISTORY', { method: "GET" })
            .then( response => {return response.json()})
            .then( response =>
            {
                if(response["Exception"])
                {
                    throw response["Exception"]
                }
                this.recipe_READY = response["response"]
            })
            .catch( err =>
            {
                Toast.failed(err)
            })

            await fetch('http://10.11.20.108:9999/api/now/BUFFER', { method: "GET" })
            .then( response => {return response.json()})
            .then( response =>
            {
                if(response["Exception"])
                {
                    throw response["Exception"]
                }
                this.recipe_BUFFER = response["response"]
            })
            .catch( err =>
            {
                Toast.failed(err)
            })
            Toast.succeed("化金線資料更新成功")

        },
        doCopy (value)
        {
            this.$copyText(value).then( () =>
            {
                Toast.succeed("複製:" + value)
            }, e =>
            {
                Toast.failed(e)
            })
        }
    }
}
</script>

<style scoped>
.el-row
{
    margin-bottom: 20px;
}
.c
{
    height: 715px;
}
.normalText
{
    font-size: 24px;
}
.dialog
{
    height: 650px;
}
</style>