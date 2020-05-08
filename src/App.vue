<template>
  <div id="app">
    <div v-if="isLoading">
      <div style="display:flex;justify-content:center;align-items:center;height:715px;">
        <md-activity-indicator type="spinner" :size="50" :text-size="50">
          處理中...
        </md-activity-indicator>
      </div>
    </div>
    <div v-else>
      <md-scroll-view ref="scrollView" auto-reflow :scrolling-x="false">
      <div id="c">
          {{version}}
      </div>
        <div id="nav">
          <router-link to="/">噴砂</router-link> |
          <router-link to="/ENG">化金</router-link>
        </div>
        <router-view/>
      </md-scroll-view>
    </div>
    <md-dialog title="到站通知" :closable="false" v-model="isDialogShow" :btns="DialogShowBtns" >
      <md-field title="需工號確認" brief="透過RFID讀取識別證">
          <md-input-item title="工號" v-model="operator.name" clearable/>
      </md-field>
    </md-dialog>
    <audio ref="inflicted" src="http://10.11.0.156/inflicted.mp3" />
  </div>
</template>

<script>
import {ScrollView, ActivityIndicator, Dialog, Toast, FieldItem, Field, InputItem} from 'mand-mobile'

export default {
  name: "App",
  components: {
    [ScrollView.name]: ScrollView,
    [ActivityIndicator.name]: ActivityIndicator,
    [Dialog.name]: Dialog,
    [FieldItem.name]: FieldItem,
    [InputItem.name]: InputItem,
    [Field.name]: Field,
  },
  data()
  {
    return {
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
      operator: {},
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
    agv_info()
    {
      return this.$store.state.agv_info
    },
    isLoading()
    {
      return this.$store.state.isLoading
    }
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
    async agv_response(val)
    {
      if(Array.isArray(val))
      {
        for(let i=0; i<val.length; i++)
        {
            if("CMD" in val[i])
            {
                await this.activeResponseAGV(val[i])
            }
        }
      }            
  }
  },
  async beforeCreate()
  {
  },
  async created()
  {

  },
  async beforeMount()
  {
    await this.get_token()
    this.$store.commit('update_admin_settings', await this.$store.dispatch("_db", { url: "_db/ENG-10/_api/document/SETTINGS/ADMIN", method: "GET", payload: {}}))
    this.$store.commit('update_agv_info', await this.$store.dispatch("_db", { url: "_db/ENG-10/_api/document/SETTINGS/AGV", method: "GET", payload: {}}))
  },
  async mounted()
  { 
    this.$refs.inflicted.volume = 1
    
    this.token_timer = await setInterval( () => { this.get_token() }, 60000) //定期更新token
    this.agv_timer = await setInterval( () => { this.getMyTunnel() }, 2000) 
    // await setInterval( () => { this.get_token() }, 5000) //定期更新token
    // await setInterval( () => { this.get_agv_response() }, 1000)
    // console.log(await this._db("http://10.11.0.156:8529/_api/cluster/endpoints", "GET", {}) )
  },
  beforeDestroy()
  {
    clearInterval(this.token_timer)
    clearInterval(this.agv_timer)
  },
  destroy()
  {

  },
  methods:
  {
    async getMyTunnel()
    {
      let headers = new Headers()
      headers.append('Authorization', 'Basic ' + btoa( this.my_tunnel + ':' + this.my_tunnel))
      await fetch("https://10.11.50.36:9122/"+ this.my_tunnel +"/require",
      { headers: headers, method: 'GET', })
      .then( response => {return  response.json()})
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
        let url = "https://10.11.50.36:9122/"+this.du_tunnel+"/publish"
        await fetch(url,
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
                this.$refs.rush.play()
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
        if(this.operator["name"])
        {
            this.isDialogShow = false
            this.$refs.rush.pause()
            let payload_e = this.prepare_payload
            payload_e["EECODE"] = this.operator.code
            payload_e["CMD"] = (+payload_e["CMD"] + 1).toString()
            await this.send_agv_cmd(payload_e)
            this.operator = {}
        }
        else
        {
            Toast.failed("請輸入工號")
        }
    },
  }
}
</script>>
<style scoped>
#app {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微軟雅黑",Arial,sans-serif; 
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 715px;
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

#c
{
  position: fixed;
  top: 10px;
  left: 15px;
  background: #fcdcdc;
  font-size: 32px;
  color: #676d75;
}
</style>
