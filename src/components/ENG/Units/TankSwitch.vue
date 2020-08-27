<template>
    <div>
        <el-row>
            <md-button type="primary" @click="isPopupShow=true" icon="filter">浸泡槽設定</md-button>
        </el-row>
        <md-popup v-model="isPopupShow" position="bottom">
            <md-popup-title-bar
                title="浸泡槽設定"
                describe="確認料盤無板->自動調整治具寬度->確認放入板材"
                cancel-text="跳回上一步"
                ok-text="確認"
                @cancel="cancel()"
                @confirm="confirm()">
            </md-popup-title-bar>
            <div class="e">
                
            </div>
        </md-popup>
    </div>
</template>

<script>
import { Button, Popup, PopupTitleBar} from "mand-mobile"
export default {
    name: "TankSwitch",
    components: {
        [Button.name]: Button,
        [PopupTitleBar.name]: PopupTitleBar,
        [Popup.name]: Popup,
    },
    props: {

    },
    data()
    {
        return {
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