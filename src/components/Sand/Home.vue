<template>
    <div>
        <el-row :gutter="10">
            <el-col :span="12">
            </el-col>
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
        Object.keys(this.$store.state.home).forEach(key =>
        {
            this.$data[key] = this.$store.state.home[key]
        })
        if(! this.recipe)
        {
            await fetch('http://10.11.20.108:9999/api/now', { method: "GET" })
            .then( response => {return response.json()})
            .then( response =>
            {
                if(response["Exception"])
                {
                    throw response["Exception"]
                }
                this.recipe = response["response"]
                
            })
            .catch( err =>
            {
                Toast.warning(err)
            })
            .finally( () =>
            {
                // this.$store.commit('update_isLoading', false)
            })
        }
    },
    async beforeDestroy()
    {
        let temp = {}
        Object.keys(this.$data).forEach(key =>
        {
            temp[key] = this.$data[key]
        })
        this.$store.commit('store_home_state', temp)
    },
    async destroy()
    {

    },
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
.errMsg
{
    font-size: 36px;
    color: #f54838;
}
.dialog
{
    height: 650px;
}
</style>