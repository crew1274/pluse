import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router.js'
import store from './store.js'
import './plugins/element.js'
import "normalize.css"
import VueLodash from 'vue-lodash'
import lodash from 'lodash'
import VueKonva from 'vue-konva'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueKonva)
Vue.use(VueLodash, {lodash: lodash})
Vue.use(VueClipboard)


Vue.config.productionTip = false

if (process.platform != "browser")
{
    const ipc = require('electron').ipcRenderer
    ipc.on('RFID', (event, msg) =>
    {
      store.commit('update_redis_msg', msg)
    })
    store.commit('update_isMobile', true)
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
