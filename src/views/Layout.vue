<template>
  <div id="Layout">
    <div v-if="status != 'ok'">
      <div>
      <img :src="wait">
      </div>
      {{status}}
    </div>
    <div v-else>
      <div v-show="isLoading">
        <div style="display:flex;justify-content:center;align-items:center;height:715px;">
          <md-activity-indicator type="spinner" :size="50" :text-size="50" @click.native="EasterEgg">
            處理中...
          </md-activity-indicator>
        </div>
      </div>
      <div v-show="!isLoading">
        <div v-if="isMobile" class="fixed">
          <md-scroll-view auto-reflow :scrolling-x="false" @refreshing="refreshingEvent" ref="scrollView" >
            <md-scroll-view-refresh slot="refresh" slot-scope="{ scrollTop, isRefreshActive, isRefreshing }"
                :scroll-top="scrollTop"
                :is-refreshing="isRefreshing"
                :is-refresh-active="isRefreshActive"
                refresh-text="下拉刷新"
                refreshing-text="更新資料中"
                refresh-active-text="釋放可刷新" />
          <div id="c">
              {{version}}
          </div>
          <div id="d">
            <login />
          </div>
            <div id="nav">
              <el-row>
                <el-col :span="10" :offset="6">
                  <p>
                    <router-link to="/Sand">噴砂</router-link> 
                    || <router-link to="/ENG">化金</router-link> 
                    || <router-link to="/graphical">整合圖控</router-link> 
                  </p>
                </el-col>
                <el-col :span="6" :offset="2">
                  <md-button @click="close()" inline plain size="small" icon="wrong">結束程式</md-button>
                </el-col>
              </el-row>
            </div>
            <router-view :isRefresh="isRefresh"  v-on:finishRefresh="finishRefresh"/>
          </md-scroll-view>
        </div>
        <div v-else>
          <div id="c">
            {{version}}
          </div>
          <div id="d">
            <login />
          </div>
            <div id="nav">
              <el-row>
                <el-col :span="10" :offset="6">
                  <p>
                    <router-link to="/Sand">噴砂</router-link> 
                    || <router-link to="/ENG">化金</router-link> 
                    || <router-link to="/fast">快速蝕刻</router-link> 
                    || <router-link to="/graphical">整合圖控</router-link> 
                  </p>
                </el-col>
                <el-col :span="6" :offset="2">
                  <md-button @click="isRefresh = true" inline plain size="small" icon="refresh">刷新資料</md-button>
                </el-col>
              </el-row>
            </div>
            <router-view :isRefresh="isRefresh"  v-on:finishRefresh="finishRefresh"/>
        </div>
      </div>
    </div>
    <md-dialog title="到站通知" :closable="false" v-model="isDialogShow" :btns="DialogShowBtns" >
      <md-field title="需工號確認" brief="透過RFID讀取識別證">
          <md-input-item title="工號" v-model="operator.target" clearable/>
      </md-field>
    </md-dialog>
    <audio ref="inflicted" src="http://10.11.0.156/just-like-magic.mp3" loop/>
  </div>
</template>

<script>
import {ScrollView, ActivityIndicator, Dialog, Toast, FieldItem, Field, InputItem,
 Icon, Button, ScrollViewRefresh} from 'mand-mobile'
import login from "@/components/Login.vue"

export default {
  name: "Layout",
  components: {
    login,
    [Icon.name]: Icon,
    [Button.name]: Button,
    [ScrollView.name]: ScrollView,
    [ScrollViewRefresh.name]: ScrollViewRefresh,
    [ActivityIndicator.name]: ActivityIndicator,
    [Dialog.name]: Dialog,
    [FieldItem.name]: FieldItem,
    [InputItem.name]: InputItem,
    [Field.name]: Field,
  },
  data()
  {
    return {
      wait: require("@/assets/wait.png"),
      windowHeight: window.innerHeight,
      token_timer: undefined,
      agv_timer: undefined,
      CMD: "",
      isDialogShow: false,
      DialogShowBtns: [
        {
            text: '確認到站',
            type: 'danger',
            handler: this.onActConfirm,
        },
      ],
      operator: {
        code: "",
        target: "",
      },
      isRefresh: false,
      status: "ok",
      status_timer: undefined,
    }
  },
  computed:
  {
    version()
    {
      return "Ver. " + this.$store.state.Version
    },
    isLogin()
    {
      return this.$store.state.isLogin
    },
    agv_response()
    {
      return this.$store.state.agv_response
    },
    admin_settings()
    {
      return this.$store.state.admin_settings
    },
    du_tunnel()
    {
      return this.admin_settings["agv"]["du_tunnel"]
    },
    my_tunnel()
    {
      return this.admin_settings["agv"]["my_tunnel"]
    },
    AGV_URL()
    {
      return "http://" + this.admin_settings["agv"]["server"] + ":" + this.admin_settings["agv"]["port"]
    },
    agv_info()
    {
      return this.$store.state.agv_info
    },
    isLoading()
    {
      return this.$store.state.isLoading
    },
    redis_msg()
    {
        return this.$store.state.redis_msg
    },
    isMobile()
    {
      return this.$store.state.isMobile
    },
  },
  watch:
  {
    '$route'(to)
    {
        document.title = 'CHPT中華精測 ' + (to.meta.title || '' )
    },
    '$store.state.errorMessage':
    {
        handler(newValue)
        {
            this.$notify.warning({ title: newValue.title, message: newValue.message})
        },
        deep: true
    },
    redis_msg(value)
    {
        let val = value['msg']
        if(this.isDialogShow)
        {
            if(val["target"].length < 8)
            {
                Toast.info("RFID讀取到識別證:" + val["target"])
                this.operator["target"] = val["target"]
                this.operator["code"] = val["code"]
            }
        }
    },
    async agv_response(val)
    {
      if(Array.isArray(val))
      {
        for(let i=0; i<val.length; i++)
        {
            if("CMD" in val[i])
            {
                if( val[i]["CMD"] == "24" || val[i]["CMD"] == "2" || val[i]["CMD"] == "6" ||
                    val[i]["CMD"] == "5" || val[i]["CMD"] == "10")
                {
                  await this.activeResponseAGV(val[i])
                }
            }
        }
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
    await this.get_token()
    await this.getStatus()
    await this.$store.dispatch('update_admin_settings_action', await this.$store.dispatch("_db", { url: "_db/ENG-10/_api/document/SETTINGS/ADMIN", method: "GET", payload: {}}))
    this.$store.commit('update_recipe_spec', await this.$store.dispatch("_db", { url: "_db/ENG-10/_api/document/SETTINGS/RECIPE", method: "GET", payload: {}}))
    this.$store.commit('update_agv_info', await this.$store.dispatch("_db", { url: "_db/ENG-10/_api/document/SETTINGS/AGV", method: "GET", payload: {}}))
  },
  async mounted()
  { 
    this.$refs.inflicted.volume = 1
    this.token_timer = await setInterval( () => { this.get_token() }, 60000) //定期更新token
    this.agv_timer = await setInterval( () => { this.getMyTunnel() }, 2000) 
    this.status_timer = await setInterval( () => { this.getStatus() }, 15000) 
    this.$nextTick( () =>
    {
      window.addEventListener('resize', this.onResize)
    })
  },
  beforeDestroy()
  {
    clearInterval(this.token_timer)
    clearInterval(this.agv_timer)
    clearInterval(this.status_timer)
    window.removeEventListener('resize', this.onResize)
  },
  destroy()
  {

  },
  methods:
  {
    onResize()
    {
      this.windowHeight = window.innerHeight
    },
    close()
    {
        let w = require('electron').remote.getCurrentWindow()
        w.close()
    },

    async getStatus()
    {

      if(process.env.NODE_ENV != "development")
      {
        let status = await this.$store.dispatch("_db", { url: "_db/ENG-10/_api/document/SETTINGS/Status", method: "GET", payload: {}})
        this.status = status["status"]
      }
    },

    async getMyTunnel()
    {
      // 背景擷取通道資訊
      let headers = new Headers()
      headers.append('Authorization', 'Basic ' + btoa( this.my_tunnel + ':' + this.my_tunnel))
      await fetch( this.AGV_URL + "/" + this.my_tunnel +"/require",
      { headers: headers, method: 'GET', })
      .then( response => { return response.json() })
      .then( response =>
      {
          this.$store.commit('update_agv_response', response)
      })
    },

    async activeResponseAGV(command)
    {
        //回應小杜
        let headers = new Headers()
        headers.append('Authorization', 'Basic ' + btoa(this.du_tunnel + ":" + this.du_tunnel))
        await fetch( this.AGV_URL + "/" + this.du_tunnel +"/publish",
        {
            headers: headers,
            method: 'POST',
            body: JSON.stringify(command)
        })
        .catch( err =>
        {
            this.$notify.warning({ title: 'AGV Server回應異常', message: err})
        })
        .finally( () =>
        {
            this.CMD = command["CMD"]
            //啟動 必要回應通知
            if( (this.CMD  == "2" || this.CMD  == "6") && !this.isDialogShow)
            {
                this.isDialogShow = true
                this.prepare_payload = command
                this.$refs.inflicted.play()

                /*耍狗不刷卡*/
                this.isDialogShow = false
                this.$refs.inflicted.pause()
                let payload_e = this.prepare_payload
                payload_e["EECODE"] = this.operator.code
                payload_e["CMD"] = (+payload_e["CMD"] + 1).toString()
                this.activeResponseAGV(payload_e)
                this.operator.code = ""
                this.operator.target = ""
                this.$store.dispatch("_db",
                { 
                    url: "_db/ENG-10/_api/cursor",
                    method: "POST",
                    payload: {
                        query : "FOR doc IN Tasks SORT doc.STARTDATETIME DESC LIMIT 1 UPDATE doc  WITH { current: doc.current + 0.5 } IN Tasks"
                    }
                })
            }
        }) 
    },
    async get_token()
    {
        let response = await this.$store.dispatch("_db", { 
            url: "_open/auth",
            method: "POST",
            payload: { username: "ENG_10", password: "ENG_10"},
        })
        this.$store.commit('update_token', 'Bearer ' + response["jwt"])
    },
    async onActConfirm()
    {
        if(this.operator["target"])
        {
            this.isDialogShow = false
            this.$refs.inflicted.pause()
            let payload_e = this.prepare_payload
            payload_e["EECODE"] = this.operator.code
            payload_e["CMD"] = (+payload_e["CMD"] + 1).toString()
            await this.activeResponseAGV(payload_e)
            this.operator.code = ""
            this.operator.target = ""
        }
        else
        {
            Toast.failed("請輸入工號")
        }
    },
    async refreshingEvent()
    {
      // console.log(this.$refs[`scrollView`])
      this.isRefresh = true
      // console.log(this.$refs[`scrollView`])
    },
    EasterEgg()
    {
      Toast({
        duration: 25,
        content: '( ° ͜ʖ͡°)╭∩╮',
      })
    },
    finishRefresh()
    {
      if(this.isMobile)
      {
          this.$refs[`scrollView`].finishRefresh()
      }
      this.isRefresh = false
    }
  }
}
</script>
<style scoped>

.fixed
{
  height: 800px;
}

#Layout {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微軟雅黑",Arial,sans-serif; 
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 815px;
}

#nav {
  padding: 30px;
  font-size: 32px;
  line-height: 1.2;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #fc9153;
}

#c {
  position: fixed;
  top: 10px;
  left: 15px;
  background: #fcdcdc;
  font-size: 30px;
  color: #676d75;
}

#d {
  position: fixed;
  top: 10px;
  left: 165px;
  font-size: 32px;
  color: #676d75;
}
</style>
