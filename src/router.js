import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: () => import('@/views/Layout.vue'),
        children: [
            {
                path: '/',
                redirect: '/ENG'
            },
            {
                path: '/Sand',
                name: 'Sand',
                meta: {
                    title: "噴砂"
                },
                component: () => import('@/views/Sand.vue')
            },
            {
                path: '/ENG',
                name: 'ENG',
                meta: {
                    title: "化金"
                },
                component: () => import('@/views/ENG.vue')
            },
            {
                path: '/fast',
                name: 'fast',
                meta: {
                    title: "快速蝕刻"
                },
                component: () => import('@/views/Fast.vue')
            },
            {
                path: '/graphical',
                name: 'graphical',
                meta: {
                    title: "整合圖控"
                },
                component: () => import('@/views/Graphical.vue')
            },
        ]
    },
    {
        path: '/admin',
        component: () => import('@/views/Admin.vue')
    }
]

const router = new VueRouter({
    routes
})

export default router
