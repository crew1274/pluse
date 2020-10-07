<template>
    <div>
        <el-row :gutter="10">
            <el-col :span="6">
                <PLC />
            </el-col>
            <el-col :span="6">
                <Out />
            </el-col>
            <el-col :span="6">
                <TankSwitch />
            </el-col>
            <el-col :span="6">
                <Period />
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="6">
                <Pneumatic />
            </el-col>
            <el-col :span="6">
                <Target />
            </el-col>
            <el-col :span="6">
                <GoldSalt />
            </el-col>
            <el-col :span="6">
                <DownTank />
            </el-col>
        </el-row>
  </div>
</template>

<script>
import { DatePicker, Button, Field, FieldItem, DetailItem, Dialog} from "mand-mobile"
import * as moment from "moment/moment"
import PLC from "@/components/Units/PLC.vue"
import TankSwitch from "@/components/ENG/Units/TankSwitch.vue"
import Period from "@/components/ENG/Units/Period.vue"
import Pneumatic from "@/components/ENG/Units/Pneumatic.vue"
import Out from "@/components/ENG/Units/Out.vue"
import Target from "@/components/ENG/Units/Target.vue"
import GoldSalt from "@/components/ENG/Units/GoldSalt.vue"
import DownTank from "@/components/ENG/Units/DownTank.vue"

export default {
    name: "Settings",
    components:
    {
        PLC,
        TankSwitch,
        Period,
        Pneumatic,
        Out,
        Target,
        GoldSalt,
        DownTank,
        [DatePicker.name]: DatePicker,
        [Button.name]: Button,
        [Field.name]: Field,
        [FieldItem.name]: FieldItem,
        [DetailItem.name]: DetailItem,
        [Dialog.name]: Dialog,
    },
    props:
    {
        msg: String
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
                this.$emit('finishRefresh')
            }
        },
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

    },
    activated()
    {

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
    }
}
</script>

<style scoped>
.el-row
{
    margin-bottom: 20px;
}
</style>