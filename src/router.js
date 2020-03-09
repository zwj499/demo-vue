import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import User from './components/user/User.vue'

Vue.use(Router)

const router = new Router({
    routes: [
        { 
            path: '/',
            redirect: '/login'
        },
        { 
            path: '/login',
            component: Login
        },
        { 
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                {
                    path: '/welcome',
                    component: Welcome
                },
                {
                    path: '/sys_user',
                    component: User
                }
            ]
        }
    ]
})


router.beforeEach((to, from, next) => {

    if (to.path === '/login') return next()

    // 获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
}) 


export default router