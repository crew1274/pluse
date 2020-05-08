import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import store from './store.js'
import './plugins/element.js'
import "normalize.css"

Vue.config.productionTip = false

if (process.platform != "browser")
{
    const ipc = require('electron').ipcRenderer
    
    ipc.on('RFID', (event, msg) => {
      store.commit('update_rfid_msg', msg)
    })
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
