import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Index from '@/components/Index'
import Test from '@/components/Test'

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Index',
            component: Index
        },
        {
            path: '/test',
            name: 'Test',
            component: Test
        }
    ]
})