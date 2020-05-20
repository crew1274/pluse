<template>
    <md-dialog title="" v-model="editDialog.open" >
        <div style="height:725px">
            <md-scroll-view>
                <md-input-item title="修改值:" v-model="editDialog.target" :solid="false" />
                <md-input-item title="覆寫值:" v-model="editDialog.overwrite" :solid="false" />

                <md-input-item title="修改值:" v-model="editDialog.target" :solid="false" />
                <md-input-item title="覆寫值:" v-model="editDialog.overwrite" :solid="false" />

                <md-field-item title="特殊字元">
                    <md-radio name="." v-model="editDialog.keyBoardRender" label="." inline />
                    <md-radio name="-" v-model="editDialog.keyBoardRender" label="-" inline />
                    <md-radio name="_" v-model="editDialog.keyBoardRender" label="_" inline />
                </md-field-item>
                <md-number-keyboard v-model="editDialog.isNumberShow" ok-text="確認" :text-render="keyFormatter"
                @enter="editDialogEnter" @delete="editDialogDelete" @confirm="editDialogConfirm" is-view :btns="editDialog.btns"/>
            </md-scroll-view>
        </div>
    </md-dialog>
</template>

<script>
import { Button, Toast, NumberKeyboard, Field, FieldItem, InputItem, Dialog, Switch, DetailItem
        ,RadioBox, RadioGroup, Radio} from "mand-mobile";
export default {
  name: "NumberKeyboardHand",
  components: {
    [Button.name]: Button,
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
        editDialog:
        {
            keyBoardRender: ".",
            open: false, // 控制開關
            target: "", // 目標值
            target_key: "",
            overwrite: "", // 覆寫值
            isNumberShow: true,
            btns: [
                {
                    text: '取消',
                    warning : true,
                },
            ],
        },
    }
    },
    methods:
    {
        editDialogEnter(val)
        {
            Toast.info(val)
            this.editDialog.overwrite += val
        },
        editDialogDelete()
        {
            if (this.editDialog.overwrite === '')
            {
                return
            }
            this.editDialog.overwrite = this.editDialog.overwrite.substr(0, this.editDialog.overwrite.length - 1)
        },
        editDialogConfirm()
        {
            Toast.info(this.editDialog.target + "->" + this.editDialog.overwrite)
            this.editDialog.open = false
            // this._.set(this.$data, this.editDialog.target_key, this.editDialog.overwrite)
        },
        openDialog(target)
        {
            this.editDialog.target_key = target.split('.')
            // this.editDialog.target = undefined
            // this._(this.editDialog.target_key).forEach( (value) =>
            // {
            //     this.editDialog.target ? 
            //         this.editDialog.target = this.editDialog.target[value] :
            //         this.editDialog.target = this.$data[value]
            // })
            // this.editDialog.target = this._.get(this.$data, this.editDialog.target_key)
            this.editDialog.open = true
            this.editDialog.overwrite = ""
        },
        keyFormatter(val)
        {
            if (val === '.')
            {
                return this.editDialog.keyBoardRender
            }
        },
        hint(val)
        {
            Toast.info(val)
        },
    },
}
</script>

<style>

</style>