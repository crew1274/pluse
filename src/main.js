import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router.js'
import store from './store.js'
import './plugins/element.js'
import "normalize.css"
import VueLodash from 'vue-lodash'
import lodash from 'lodash'
Vue.use(VueLodash, {lodash: lodash})


Vue.config.productionTip = false

if (process.platform != "browser")
{
    const ipc = require('electron').ipcRenderer
    ipc.on('RFID', (event, msg) =>
    {
      store.commit('update_redis_msg', msg)
    })
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
