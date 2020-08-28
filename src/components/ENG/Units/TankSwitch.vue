<template>
    <div>
        <el-row>
            <md-button type="primary" @click="isPopupShow=true" icon="filter">浸泡槽設定</md-button>
        </el-row>
        <md-popup v-model="isPopupShow" position="bottom">
            <md-popup-title-bar
                title="浸泡槽設定"
                describe="更換槽須由此更新"
                cancel-text="跳回"
                ok-text="確認"
                @cancel="cancel()"
                @confirm="confirm()">
            </md-popup-title-bar>
            <div class="e">
                <md-check-group v-model="tanks">
                    <el-row>
                        <md-check-box name="#12活化槽">#12活化槽</md-check-box>
                        <el-divider direction="vertical" />
                        <md-check-box name="#13活化槽">#13活化槽</md-check-box>
                    </el-row>
                    <el-row>
                        <md-check-box name="#21化學鎳">#21化學鎳</md-check-box>
                        <el-divider direction="vertical" />
                        <md-check-box name="#22化學鎳">#22化學鎳</md-check-box>
                    </el-row>
                    <el-row>
                        <md-check-box name="#26化學金">#26化學金</md-check-box>
                        <el-divider direction="vertical" />
                        <md-check-box name="#27化學金">#27化學金</md-check-box>
                    </el-row>
                    <el-row>
                        <md-check-box name="#31厚金槽">#22厚金槽</md-check-box>
                        <el-divider direction="vertical" />
                        <md-check-box name="#32厚金槽">#22厚金槽</md-check-box>
                    </el-row>
                </md-check-group>
            </div>
        </md-popup>
    </div>
</template>

<script>
import { Button, Popup, PopupTitleBar, CheckBox, CheckGroup} from "mand-mobile"
export default {
    name: "TankSwitch",
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
            tanks: ["#21化學鎳", "#22化學鎳"],
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
.e {
  background: #ffffff;
  font-size: 30px;
  color: #27282a;
}
</style>