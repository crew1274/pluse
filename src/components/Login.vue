<template>
    <div v-if="LoginState">
        <md-tag size="large"
            shape="square" fill-color="#FC9153"
            type="fill" font-color="#fff">
            連線中
        </md-tag>
    </div>
    <div v-else>
        <md-tag size="large" @click.native="isPopupShow=true"
            shape="square" fill-color="#75716e"
            type="fill" font-color="#fff">
            連線中斷
        </md-tag>
        <md-dialog icon="authentication" :closable="true" v-model="isPopupShow" :btns="btns"/>
    </div>

</template>

<script>
import { Button, Tag, Toast, Popup, PopupTitleBar, Icon, Dialog} from "mand-mobile"
export default {
    name: "Login",
    components:
    {
        [Button.name]: Button,
        [Tag.name]: Tag,
        [Popup.name]: Popup,
        [PopupTitleBar.name]: PopupTitleBar,
        [Icon.name]: Icon,
        [Dialog.name]: Dialog,
    },
    data ()
    {
        return {
            isPopupShow: false,
            btns: [
                {
                    text: '與設備連線',
                    handler: this.Connection,
                },
            ],
            check_timer: undefined
        }
    },
    computed:
    {
        LoginState()
        {
            return this.$store.state._ws_isLogin
        },
        _ws_back()
        {
            return this.$store.state._ws_back
        }
    },
    watch:
    {
        LoginState(state)
        {
            state? Toast.info("建立連線"): Toast.failed("連線中斷")
        },
        _ws_back(_ws_back)
        {
            if("isAllowed" in _ws_back && _ws_back["isAllowed"])
            {
                this.$store.commit('login')
            }
        }
    },
    beforeMount()
    {
        this.Connection()
    },
    mounted()
    {
        this.check_timer = setInterval( () => { this.check() }, 30000) //定期檢查
    },
    beforeDestroy()
    {
        clearInterval(this.check_timer)
    },
    methods:
    {
        Connection()
        {
            this.$store.dispatch('_ws_login', {"User": "遠端帳號", "Password": "171104", "target": "ws://10.11.20.108:9999"})
            this.isPopupShow = false
        },
        check()
        {
            if(! this.LoginState)
            {
                this.Connection()
            }
        }
    }
}
</script>

<style>

</style>