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
        path: '/about',
        name: 'About',
        meta: { title: "化金" },
        component: () => import('@/views/About.vue')
    }
]

const router = new VueRouter({
    routes
})

export default router
