<template>
    <div>
        <el-row>
            <md-button type="primary" @click="isPopupShow=true" icon="time">週期設定</md-button>
        </el-row>
        <md-popup v-model="isPopupShow" position="bottom">
            <md-popup-title-bar
                title="週期設定"
                describe="確認後才會更新"
                cancel-text="返回"
                ok-text="確認"
                @cancel="cancel()"
                @confirm="confirm()">
            </md-popup-title-bar>
            <div class="e">
                <el-row>
                    <el-col :span="12" :offset="6">
                        <md-field>
                            <md-field-item title="週期時間">
                                <md-stepper slot="right" v-model="value"/>
                            </md-field-item>
                        </md-field>
                    </el-col>

                </el-row>
            </div>
        </md-popup>
    </div>
</template>

<script>
import { Button, Popup, PopupTitleBar, Stepper, Field, FieldItem, Icon} from "mand-mobile"
export default {
    name: "Period",
    components: {
        [Button.name]: Button,
        [PopupTitleBar.name]: PopupTitleBar,
        [Popup.name]: Popup,
        [Field.name]: Field,
        [FieldItem.name]: FieldItem,
        [Stepper.name]: Stepper,
        [Icon.name]: Icon,
    },
    props: {

    },
    data()
    {
        return {
            value: 600,
            isPopupShow: false,
        }
    },
    computed:
    {

    },
    watch:
    {

    },
    methods:
    {
        cancel()
        {
            this.isPopupShow = false
        },
        confirm()
        {
            this.isPopupShow = false
        }
    }
}
</script>

<style>

</style>