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
    redirect: '/title-list',
    component: Layout,
    children: [
      {
        path: 'title-list',
        name: 'TitleList',
        component: () => import('../views/peach/TitleList'),
        meta: {
          title: '标题列表',
          // icon: 'vue-dsn-icon-picture'
        },
      }
    ]
  },
  {
    path: '/1',
    component: Layout,
    children: [
      {
        path: 'brand-list',
        name: 'BrandList',
        component: () => import('../views/peach/BrandList'),
        meta: {
          title: '品牌列表',
          // icon: 'vue-dsn-icon-picture'
        },
      }
    ]
  },
  {
    path: '/2',
    component: Layout,
    children: [
      {
        path: 'peach-list',
        name: 'PeachList',
        component: () => import('../views/peach/PeachList'),
        meta: {
          title: '产品列表',
          // icon: 'vue-dsn-icon-picture'
        },
      }
    ]
  },
  {
    path: '/3',
    component: Layout,
    meta: {
      title: '功能',
      icon: 'vue-dsn-icon-picture'
    },
    hidden: true,
    children: [
      {
        path: 'brand-editor',
        name: 'BrandEditor',
        component: () => import('../views/peach/BrandEditor'),
        meta: {
          title: '编辑器'
        }
      },
      {
        path: 'title-editor',
        name: 'TitleEditor',
        component: () => import('../views/peach/TitleEditor'),
        meta: {
          title: '编辑器'
        }
      },
      {
        path: 'title-detail-list',
        name: 'TitleDetailList',
        component: () => import('../views/peach/TitleDetailList'),
        meta: {
          title: '内容列表'
        }
      }
    ]
  },
  {
    path: '/4',
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
