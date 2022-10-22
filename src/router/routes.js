import Layout from '../layout'
import Header from '../layout/components/HeaderBar'

/**
 * hidden: true                  如果设置为 true，该项菜单将不会显示在菜单栏中(默认为 false)
 * meta : {
    title: 'title'               菜单名
    icon: 'icon-name'            图标名
    fixed: true                  如果设置为 true，该项 tag 将一直存在 tag 栏中(默认为 false)
  }
 * */

export const asyncRoutes = [
  {
    path: '/',
    redirect: '/hello',
    component: Layout,
    children: [
      {
        path: 'hello',
        name: 'Hello',
        component: () => import('../views/meetu/Hello'),
        meta: {
          title: '欢迎页',
          // icon: 'vue-dsn-icon-picture'
        },
      }
    ]
  },
  {
    path: '/1',
    redirect: '/group-list',
    component: Layout,
    children: [
      {
        path: 'group-list',
        name: 'GroupList',
        component: () => import('../views/meetu/index/GroupList'),
        meta: {
          title: '发现群组',
          // icon: 'vue-dsn-icon-picture'
        },
      }
    ]
  },
  {
    path: '/2',
    redirect: '/event-list',
    component: Layout,
    children: [
      {
        path: 'event-list',
        name: 'EventList',
        component: () => import('../views/meetu/index/EventList'),
        meta: {
          title: '发现活动',
          // icon: 'vue-dsn-icon-picture'
        },
      }
    ]
  },
]
