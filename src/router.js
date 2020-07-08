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
                redirect: '/Sand'
            },
            {
                path: '/Sand',
                name: 'Sand',
                meta: {
                    title: "噴砂"
                },
                component: () => import('@/views/Sand.vue')
            }, {
                path: '/ENG',
                name: 'ENG',
                meta: {
                    title: "化金"
                },
                component: () => import('@/views/ENG.vue')
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
