import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout'
import { asyncRoutes } from './routes'

Vue.use(Router)

/**
 * hidden: true                  如果设置为 true，该项菜单将不会显示在菜单栏中(默认为 false)
 * meta : {
    title: 'title'               菜单名
    icon: 'icon-name'            图标名
    fixed: true                  如果设置为 true，该项 tag 将一直存在 tag 栏中(默认为 false)
  }
 **/

export const constantRoutes = [
  // {
  //   path: '/hello',
  //   name: 'Hello',
  //   component: () => import('../views/Hello'),
  //   hidden: true,
  //   meta: { title: '欢迎页' }
  // },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login'),
    hidden: true,
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register'),
    hidden: true,
    meta: { title: '注册' }
  },
  {
    path: '/message-list',
    name: 'MessageList',
    component: () => import('../views/meetu/user/UserMessageList'),
    hidden: true,
    meta: { title: '我的消息' }
  },
  {
    path: '/user-group-list',
    name: 'UserGroupList',
    component: () => import('../views/meetu/user/UserGroupList'),
    hidden: true,
    meta: { title: '我的群组' }
  },
  {
    path: '/group-join-apply',
    name: 'GroupJoinApply',
    component: () => import('../views/meetu/user/GroupJoinApply'),
    hidden: true,
    meta: { title: '我的群组' }
  },
  {
    path: '/group-user-list',
    name: 'GroupUserList',
    component: () => import('../views/meetu/user/GroupUserList'),
    hidden: true,
    meta: { title: '我的群组' }
  },
  {
    path: '/401',
    name: '401',
    component: () => import('../views/error-page/401'),
    hidden: true,
    meta: { title: '401' }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/error-page/404'),
    hidden: true,
    meta: { title: '404' }
  },
  {
    path: '/user-center',
    name: 'UserCenter',
    component: () => import('../views/UserCenter'),
    hidden: true,
    meta: { title: '个人中心' }
  }
]

const routes = [...constantRoutes, ...asyncRoutes]

export default new Router({
  routes
})

