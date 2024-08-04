import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
  RouteRecordRaw,
} from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { store } from '@/store'
import { getRequest } from '@/assets/scripts/utils'
import { microRouter } from './micro-router'

import Home from '@/views/Home.vue'
import Dashboard from '@/views/dashboard/index.vue'
// import Dashboard from '@/views/statistics/index.vue'
// import PlatformMicro from '@/views/microView/platform.vue'
// import MultimediaMicro from '@/views/microView/multimedia.vue'

// 协议页
import SynProtocol from '@/views/synProtocol/index.vue'

// import LayoutEditor from '@/views/microView/layoutEditor/index.vue'
// import Platform from '@/views/microView/platform/index.vue'
// import Home from '@/apps/health-run/views/multi/index.vue'
const localStorage: any = window.localStorage

NProgress.configure({ showSpinner: false })

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/',
    component: Home,
    meta: {
      title: '首页',
      keepAlive: true,
      requireAuth: true,
    },
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
        name: 'dashboard',
        meta: {
          title: '首页',
          keepAlive: true,
          requireAuth: true,
        },
      },
      {
        path: 'testPage',
        component: () => import('@/views/testPage/index.vue'),
        name: 'testPage',
        meta: {
          title: '测试页',
          keepAlive: true,
          requireAuth: true,
        },
      },
      {
        path: 'testPageB',
        component: () => import('@/views/testPageB/index.vue'),
        name: 'testPageB',
        meta: {
          title: '测试页2',
          keepAlive: true,
          requireAuth: true,
        },
      },
      // 这加新路由
      // ...microRouter,
      {
        path: '/404',
        name: '404',
        component: () => import('@/views/404.vue'),
        meta: {
          title: '404',
        },
      },
      {
        path: '/:pathMatch(.*)',
        redirect: '/404',
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/synProtocol/:code',
    name: 'SynProtocol',
    component: () => import('@/views/synProtocol/index.vue'),
    meta: {
      title: '协议详情',
      requireAuth: false,
    },
  },
]

class Router {
  router: () => any
  constructor() {
    const creat = createRouter({
      history: createWebHistory('/manage'),
      routes,
      scrollBehavior(to: any, from: any, savePosition: any): any {
        if (savePosition) {
          //解决页面从列表页跳转到详情页返回,初始在原来位置
          return savePosition
        } else {
          //解决页面跳转后页面高度和前一个页面高度一样
          return { x: 0, y: 0 }
        }
      },
    })
    this.router = () => this.before(creat)
  }
  before(creat: any) {
    creat.beforeEach(async (to: any, from: any, next: any) => {
      to.meta.keepAlive = true
      NProgress.start()
      const token = store.state.token
      // const configs = JSON.parse(localStorage.getItem('configsManage'))
      if (to.meta.requireAuth && !token) {
        next({ path: '/login' })
      } else {
        console.log('router before', token)
        if (token) {
          if (to.name === 'Login') {
            creat.push({
              path: from.path,
            })
          }
        }
        next()
      }
      NProgress.done()
    })
    return creat
  }
}

export default new Router().router()
