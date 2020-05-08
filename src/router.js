import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        meta: { title: "噴砂" },
        component: () => import('@/views/Home.vue')
    },
    {
        path: '/ENG',
        name: 'ENG',
        meta: { title: "化金" },
        component: () => import('@/views/ENG.vue')
    }
]

const router = new VueRouter({
    routes
})

export default router
