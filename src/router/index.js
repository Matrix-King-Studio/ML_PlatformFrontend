import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '@/views/Login.vue';
import editor from "@/views/editor";
import register from "@/views/register";
import forgetpass from "@/views/forgetpass"
// import { from } from 'core-js/fn/array';
import graph from "@/views/graph";
import deploy from "../views/deploy";

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'editor',
        component: editor
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'register',
        component: register
    },
    {
        path: '/forgetpass',
        name: 'forgetpass',
        component: forgetpass
    },
    {
        path: '/graph',
        name: 'graph',
        component: graph
    },
    {
        path: '/deploy',
        name: 'deploy',
        component: deploy
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to将要访问的路径
    // from 代表从哪个路径跳转而来
    // next是一个函数，表示放行
    //next()放行     next('/login')强制跳转
    if (to.path === '/login') return next();
    //获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

export default router