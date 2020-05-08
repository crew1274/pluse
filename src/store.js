import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        Version: process.env.PACKAGE_VERSION,
        isLogin: false,
        errorMessage: {},
        _RFID: "",
        token: "token",
        agv_response: {},
        admin_settings: {},
        agv_info: {},
        isLoading: false,
    },
    mutations: 
    {
        _db_err(state, err)
        {
            state.errorMessage = {
                "title": "ArangoDB資料庫連線異常",
                "message": err
            }
        },
        update_isLoading(state, bool)
        {
            state.isLoading = bool
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
        update_agv_info(state, agv_info)
        {
            state.agv_info = agv_info
        }
    },
    actions: {
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
        }
    },
    modules: {},
})
