import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        Version: process.env.PACKAGE_VERSION,
        isLogin: false,
        errorMessage: {},
        _RFID: "",
        _ws: null,
        _ws_back: null,
        _ws_isLogin: false,
        token: "token",
        agv_response: {},
        admin_settings: {},
        agv_info: {},
        isLoading: false,
        redis_msg: {},
        sand_tab_current: "",
        prod: {},
        home: {},
        AGV_CMD: "",
        spec: {},
        isMobile: false,
    },
    mutations: 
    {
        _ws_message(state, e)
        {
            state._ws_back = JSON.parse(e.data)
        },
        login(state)
        {
            state._ws_isLogin = true
        },
        store_prod_state(state, temp)
        {
            state.prod = temp
        },
        store_home_state(state, temp)
        {
            state.home = temp
        },
        update_sand_tab_current(state, sand_tab_current)
        {
            state.sand_tab_current = sand_tab_current
        },
        _db_err(state, err)
        {
            state.errorMessage = {
                "title": "ArangoDB資料庫連線異常",
                "message": err
            }
        },
        update_redis_msg(state, redis_msg)
        {
            state.redis_msg = {
                datetime: new Date().getMilliseconds(),
                msg: redis_msg,
            }
        },
        update_isMobile(state, status)
        {
            state.isMobile = status
        },
        update_isLoading(state, status)
        {
            state.isLoading = status
        },
        update_token(state, token)
        {
            state.token = token
        },
        update_agv_response(state, agv_response)
        {
            state.agv_response = agv_response
        },
        update_admin_settings(state, admin_settings)
        {
            state.admin_settings = admin_settings
        },
        update_recipe_spec(state, spec)
        {
            state.spec = spec
        },
        update_agv_info(state, agv_info)
        {
            state.agv_info = agv_info
        },
        update_AGV_CMD(state, CMD)
        {
            state.AGV_CMD = CMD
        }
    },
    actions:
    {
        _ws_onmessage( { commit }, message)
        {
            commit("_ws_message", message)
        },
        async _ws_login({ state, dispatch }, para) /*para為登入參數*/
        {
            state._ws = new WebSocket("ws://10.11.20.108:9999")
            state._ws.onopen = async function ()
            {
                this.send(JSON.stringify(para))
            }
            state._ws.onmessage = async function (e)
            {
                await dispatch("_ws_onmessage", e)
                /*回應*/
                this.send("Pong")
            }
            state._ws.onerror = async function ()
            {
                this.close()
            }
            state._ws.onclose = async function ()
            {
                state._ws = null
                state._ws_isLogin = false
            }
        },
        async _db({commit, state}, para)
        {
            if (para.method == "GET")
            {
                // console.log(state.token)
                return fetch("http://10.11.0.156:8529/" + para.url,
                    {
                        method: para.method,
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': state.token,
                            'Content-Type': 'application/json'
                        },
                    })
                    .then(response => {
                        return response.json()
                    })
                    .then(response => {
                        if (response["error"]) {
                            throw response["errorMessage"]
                        }
                        return response
                    })
                    .catch(err => {
                        commit('_db_err', err)
                        return false
                    })
            } else {
                return fetch("http://10.11.0.156:8529/" + para.url, {
                        method: para.method,
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': state.token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(para.payload)
                    })
                    .then(response => {
                        return response.json()
                    })
                    .then(response => {
                        if (response["error"]) {
                            throw response["errorMessage"]
                        }
                        return response
                    })
                    .catch(err => {
                        commit('_db_err', err)
                        return false
                    })
            }
        },
        async call_agv({commit, state}, command)
        {
            let headers = new Headers()
            let AGV_URL = "http://" + state.admin_settings.agv.server + ":" + state.admin_settings.agv.port
            headers.append('Authorization', 'Basic ' + btoa(state.admin_settings.agv.du_tunnel + ":" + state.admin_settings.agv.du_tunnel))
            await fetch(AGV_URL + "/" + state.admin_settings.agv.du_tunnel + "/publish",
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
                commit('update_AGV_CMD', command["CMD"])
            }) 
        },
        async update_admin_settings_action({commit}, settings)
        {
            commit('update_admin_settings', settings)
        },
        async sleep(ms = 0)
        {
            return new Promise(r => setTimeout(r, ms))
        }
    },
    modules: {},
})
