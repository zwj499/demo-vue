import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import User from './components/user/User.vue'
import Career from './components/dnf/Career'
import QQAccount from './components/dnf/QQAccount'
import Role from './components/dnf/Role'
import Damage from "./components/dnf/Damage";
import StormRoute from "./components/dnf/StormRoute";

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
                },
                {
                    path: '/career',
                    component: Career
                },
                {
                    path: '/qq_account',
                    component: QQAccount
                },
                {
                    path: '/dnf_role',
                    component: Role
                },
                {
                    path: '/damage',
                    component: Damage
                }
                ,
                {
                    path: '/storm_route',
                    component: StormRoute
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
