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
                path: '/integrate',
                name: 'integrate',
                meta: {
                    title: "integrate"
                },
                component: () => import('@/views/Integrate.vue')
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
