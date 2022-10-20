import Layout from '../layout'

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
]
