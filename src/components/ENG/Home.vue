<template>
    <div>
        <el-row :gutter="10">
            <el-card class="normalText">
                <div slot="header">
                    <span>上筆套用參數</span>
                    <el-button style="float: right; padding: 3px 0" type="text" @click="getPrevRecipe">重新整理</el-button>
                </div>
                <el-col :span="12">
                    <md-field title="批號資料">
                        <md-detail-item title="批號:" :content="recipe.lotdata.no" bold />
                        <md-detail-item title="料號:" :content="recipe.lotdata.itemno"  />
                        <md-detail-item title="製程序:" :content="recipe.lotdata.procseq"  />
                        <md-detail-item title="料號版次:" :content="recipe.lotdata.itemno"  />
                        <md-detail-item title="製造版次:" :content="recipe.lotdata.mfver"  />
                    </md-field>
                </el-col>
                <el-col :span="12">
                    <md-field title="詳細參數">
                        <md-detail-item title="板高:" :content="recipe.recipe.Height" />
                        <md-detail-item title="板寬:" :content="recipe.recipe.Width" />
                        <md-detail-item title="片數:" :content="recipe.recipe.QTY" />
                        <md-detail-item title="模式:" :content="recipe.recipe.Mode" />
                    </md-field>
                </el-col>
            </el-card>
        </el-row>
    </div>
</template>

<script>
import { Button, Toast, NumberKeyboard, Field, FieldItem, InputItem, Dialog, Switch, DetailItem
        ,RadioBox, RadioGroup, Radio, ScrollView} from "mand-mobile"
export default {
    name: "Home",
    components: {
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

    },
    data()
    {
        return {
            recipe: {},
        }
    },
    computed:
    {

    },
    watch:
    {

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
    methods:
    {
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
                this.recipe = response["response"]
                Toast.info("更新成功")
            })
            .catch( err =>
            {
                Toast.warning(err)
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