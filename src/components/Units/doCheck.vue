<template>
    <md-popup v-model="guide.isPopupShow" position="bottom" :mask-closable="false">
        <md-popup-title-bar
            title="調整站放板操作指引"
            describe="確認料盤無板->自動調整治具寬度->確認放入板材"
            cancel-text="重新操作"
            ok-text="略過"
            @cancel="clean()"
            @confirm="clean()">
        </md-popup-title-bar>
        <div class="e">
            <el-row>
                <el-col :span="6" :offset="9">
                    <md-button type="primary" @click="doCheck" :loading="guide.loading" :inactive="guide.inactive">
                        {{guide.text}}
                    </md-button>
                </el-col>
            </el-row>
            <el-row>
                <md-steps :steps="steps" :current="guide.current" />
            </el-row>
        </div>
    </md-popup>
</template>

<script>
import { Button, Popup, PopupTitleBar, Steps} from "mand-mobile"
export default {
    name: "doCheck",
    components: {
            [Button.name]: Button,
            [Steps.name]: Steps,
            [Popup.name]: Popup,
            [Steps.name]: Steps,
            [PopupTitleBar.name]: PopupTitleBar,
    },
    props:
    {
            startCheck: Boolean,
    },
    watch:
    {
        startCheck(val)
        {
            this.guide.isPopupShow = val
        }
    },
    created()
    {
        this.guide.isPopupShow = this.startCheck
    },
    data() 
    {
        return {
            guide:
            {
                isPopupShow: false,
                text: "已確認料盤無料",
                inactive: false,
                loading: false,
                current: 0,
            },
            steps:
            [
                {name: '操作員確認料盤無板'},
                {name: '自動調整治具'},
                {name: '操作員放入板'},
            ]
        }
    },
    methods:
    {
        clean()
        {
            this.guide.current = 0
            this.$emit('clean')
        },
        async doCheck()
        {
            this.guide.current = this.guide.current + 1
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