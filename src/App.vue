<template>
  <div id="app">
    <div id="c">
        {{version}}
    </div>
    <!-- <div v-if="isLogin"> -->
      <div id="nav">
        <router-link to="/">噴砂</router-link> |
        <router-link to="/about">化金</router-link>
      </div>
      <router-view/>
    <!-- </div> -->
    <!-- <div v-else>
      test
    </div> -->
  </div>
</template>

<script>
export default {
  name: "App",
  data()
  {
    return {
      settings: //設定檔
      {
        test: "test"
      },
      admin_settings:
      {
        agv:
          {
            server: "10.11.50.36",
            port: "9122",
            my_tunnel: "P121",
            du_tunnel: "P112"
          }
      },
      token_timer: undefined,
      agv_timer: undefined,
      agv_response: "", /* AGV */
      CMD: "",
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
                this.CMD = val[i]["CMD"]
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
    let response = await this.$store.dispatch("_db", { url: "_db/ENG-10/_api/document/SETTINGS/AGV", method: "GET", payload: {}})

  },
  async mounted()
  { 
    // 取得arangoDB SETTINGS USER
    this.token_timer = await setInterval( () => { this.get_token() }, 60000) //定期更新token
    this.agv_timer = await setInterval( () => { this.get_agv_response() }, 2000) 


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
          this.agv_response = response
          this.$store.commit('update_agv_response', this.agv_response)
          // if("12" in this.agv_response || "2" in this.agv_response)
          // {
          //     this.$store.commit('', this.agv_response)
          // }
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
        .then( response => {return response.json()})
        .then( () =>
        {
            //啟動 必要回應通知
            if( (this.CMD  == "2" || this.CMD  == "6") && !this.isDialogShow)
            {
                this.isDialogShow = true
                this.$refs.rush.play()
                this.prepare_payload = val[i]
            }
        })
        .catch( err =>
        {
            this.$notify.warning({ title: 'AGV Server回應異常', message: err})
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
