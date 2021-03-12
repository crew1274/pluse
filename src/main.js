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
import VCharts from 'v-charts'

import * as Sentry from "@sentry/browser"
import { Vue as VueIntegration } from '@sentry/integrations'

Sentry.init({
  dsn: 'http://00c6091411974f7e971661d0dee8d143@10.11.0.156:9000/5',
  integrations: [new VueIntegration({ Vue, attachProps: true })],
  release: process.env.PACKAGE_VERSION
})

Vue.use(VueKonva)
Vue.use(VueLodash, {lodash: lodash})
Vue.use(VueClipboard)
Vue.use(VCharts)

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
