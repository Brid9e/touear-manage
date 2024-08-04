/*
 * @Author: Joe
 * @Date: 2022-10-12 09:24:00
 * @LastEditors: Joe
 * @LastEditTime: 2022-11-26 18:05:03
 * @FilePath: /management-micro/micro/platform/src/router/index.ts
 * @Description:
 *
 * Copyright (c) 2022 by Brid9e wangdongqiao1997@163.com, All Rights Reserved.
 */
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// import { getRequest } from '@/assets/scripts/utils'
import Home from '@/views/Home.vue'
import SettingScheme from '@/views/group/groupComponents/settingPage.vue'

// import About from '@/components/HelloWorld.vue'
// const localStorage: any = window.localStorage
import Group from '@/views/group/index.vue'
import Theme from '@/views/theme/index.vue'

NProgress.configure({ showSpinner: false })

export const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '',
  //   redirect: 'home',
  // },
  // {
  //   path: 'home',
  //   component: Home,
  //   name: 'Home',
  //   meta: {
  //     title: 'Home',
  //     icon: 'Home',
  //     affix: true,
  //     requireAuth: true
  //   }
  // },
  {
    path: '/manage-platform/',
    meta: {
      keepAlive: true,
    },
    children: [
      {
        path: 'appTpyeList',
        component: () => import('@/views/application/type/list.vue'),
        name: 'appTpyeList',
        meta: {
          title: '类型列表',
          icon: 'about',
          noCache: true,
          isIframe: true,
          keepAlive: true,
        },
      },
      {
        path: 'appTpyeAdd',
        component: () => import('@/views/application/type/add.vue'),
        name: 'appTpyeAdd',
        meta: {
          title: '类型添加',
          icon: 'about',
          noCache: true,
          isIframe: true,
          keepAlive: true,
        },
      },
      {
        path: 'appTpyeBindApp',
        component: () => import('@/views/application/type/bindApp.vue'),
        name: 'appTpyeBindApp',
        meta: {
          title: '绑定应用',
          icon: 'about',
          noCache: true,
          isIframe: true,
          keepAlive: true,
        },
      },
      {
        path: 'appList',
        component: () => import('@/views/application/apps/list.vue'),
        name: 'appList',
        meta: {
          title: '应用列表',
          icon: 'about',
          noCache: true,
          isIframe: true,
          keepAlive: true,
        },
      },
      {
        path: 'appAdd',
        component: () => import('@/views/application/apps/add.vue'),
        name: 'appAdd',
        meta: {
          title: '应用添加',
          icon: 'about',
          noCache: true,
          isIframe: true,
          keepAlive: true,
        },
      },
      {
        path: 'module',
        component: () => import('@/views/module/index.vue'),
        name: 'module',
        meta: {
          title: '组件列表',
          icon: 'about',
          noCache: true,
          isIframe: true,
          keepAlive: true,
        },
      },
      {
        path: 'moduleAdd',
        component: () => import('@/views/module/add.vue'),
        name: 'moduleAdd',
        meta: {
          title: '添加组件',
          // icon: 'about',
          noCache: true,
        },
      },
      // {
      //   path: 'moduleDetails',
      //   component: () => import( '@/views/module/details.vue'),
      //   name: 'moduleDetails',
      //   meta: {
      //     title: '组件详情',
      //     // icon: 'about',
      //     noCache: true
      //   }
      // },
      {
        path: 'moduleBindApps',
        component: () => import('@/views/module/bindApps.vue'),
        name: 'moduleBindApps',
        meta: {
          title: '绑定应用',
          icon: 'about',
          noCache: true,
        },
      },
      {
        path: 'moduleBindAdvertise',
        component: () => import('@/views/module/bindAdvertise.vue'),
        name: 'moduleBindAdvertise',
        meta: {
          title: '绑定广告',
          icon: 'about',
          noCache: true,
        },
      },
      {
        path: 'menuList',
        component: () =>
          import(/* webpackChunkName: "menu" */ '@/views/menu/index.vue'),
        name: 'menu',
        meta: {
          title: '菜单列表',
          icon: 'about',
          noCache: true,
          isIframe: true,
          keepAlive: true,
        },
      },
      {
        path: 'subMenu',
        component: () => import('@/views/menu/subMenu.vue'),
        name: 'subMenu',
        meta: {
          title: '绑定子菜单',
          icon: 'about',
          noCache: true,
        },
      },
      // {
      //   path: 'scheme/:id',
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "schemeSetting" */ '@/views/Home.vue'
      //     ),
      //   name: 'schemeSetting',
      //   meta: {
      //     title: '布局编辑',
      //     icon: 'about',
      //     noCache: true,
      //     keepAlive: true
      //   }
      // },
      {
        path: 'menuAdd',
        component: () => import('@/views/menu/add.vue'),
        name: 'menuAdd',
        meta: {
          title: '添加菜单',
          // icon: 'about',
          noCache: true,
        },
      },
      // {
      //   path: 'menuDetails',
      //   component: () => import('@/views/menu/details.vue'),
      //   name: 'menuDetails',
      //   meta: {
      //     title: '菜单详情',
      //     // icon: 'about',
      //     noCache: true,
      //   },
      // },
      {
        path: 'schemeList',
        component: () =>
          import(/* webpackChunkName: "scheme" */ '@/views/scheme/index.vue'),
        name: 'schemeList',
        meta: {
          title: '方案列表',
          noCache: true,
        },
      },
      {
        path: 'schemeAdd',
        component: () =>
          import(/* webpackChunkName: "scheme" */ '@/views/scheme/add.vue'),
        name: 'schemeAdd',
        meta: {
          title: '方案添加',
          noCache: true,
        },
      },
      {
        path: 'schemeDetails',
        component: () =>
          import(/* webpackChunkName: "scheme" */ '@/views/scheme/details.vue'),
        name: 'schemeDetails',
        meta: {
          title: '方案详情',
        },
      },
      // {
      //   path: 'schemeBindGroup',
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "scheme" */ '@/views/scheme/modules/bindGroup.vue'
      //     ),
      //   name: 'schemeBindGroup',
      // },
      {
        path: 'developer',
        component: () =>
          import(
            /* webpackChunkName: "developer" */ '@/views/developer/index.vue'
          ),
        name: 'developer',
        meta: {
          title: '应用详情',
          icon: 'about',
          noCache: true,
          isIframe: true,
          keepAlive: true,
        },
      },
      {
        path: 'appDetail',
        component: () =>
          import(
            /* webpackChunkName: "detail" */ '@/views/application/apps/detail.vue'
          ),
        name: 'appDetail',
        meta: {
          title: '应用详情',
          icon: 'about',
          noCache: true,
          isIframe: true,
          keepAlive: true,
        },
      },
      {
        path: 'group',
        component: Group,
        name: 'group',
        meta: {
          title: '群组管理',
          icon: 'group',
          noCache: true,
          isIframe: true,
          keepAlive: true,
        },
      },
      {
        path: 'group/limitPage/:id',
        component: () =>
          import(
            /* webpackChunkName: "Limit" */ '@/views/group/groupComponents/limitPage.vue'
          ),
        name: 'limitPage',
        meta: {
          title: '群组权限设置',
          icon: 'limit',
          noCache: true,
          keepAlive: false,
        },
      },
      // ******************
      {
        path: 'group/limit/:id',
        component: () =>
          import(
            /* webpackChunkName: "Limit" */ '@/views/group/groupComponents/limit.vue'
          ),
        name: 'limit',
        meta: {
          title: '授权',
          icon: 'limit',
          noCache: true,
          keepAlive: false,
        },
      },
      // ******************
      {
        path: 'group/setting/:id',
        component: SettingScheme,
        name: 'setting',
        meta: {
          title: '设置方案',
          icon: 'setting',
          noCache: true,
          isIframe: true,
          keepAlive: true,
        },
      },
      {
        path: 'theme',
        component: Theme,
        name: 'theme',
        meta: {
          title: '主题管理',
          icon: 'theme',
          noCache: true,
          isIframe: true,
          keepAlive: true,
        },
      },
      {
        path: 'physicalCard',
        component: () => import('@/views/card/physicalCard.vue'),
        name: 'physicalCard',
        meta: {
          title: '实体卡',
          icon: 'cardEdit',
          noCache: true,
          isIframe: true,
          keepAlive: true,
        },
      },
      {
        path: 'cardEdit',
        component: () => import('@/views/card/cardList.vue'),
        name: 'cardEdit',
        meta: {
          title: '卡样设置',
          icon: 'cardEdit',
          noCache: true,
          isIframe: true,
          keepAlive: true,
        },
      },
      {
        path: 'systemConfig',
        component: () => import('@/views/systemConfig/index.vue'),
        name: 'SystemConfig',
        meta: {
          title: '系统参数',
          icon: 'systemConfig',
          noCache: true,
          isIframe: true,
          keepAlive: true,
        },
      },
      {
        path: 'systemConfig/loginSetting',
        component: () => import('@/views/systemConfig/loginSetting.vue'),
        name: 'SystemLoginSetting',
        meta: {
          title: '登录设置',
          icon: 'systemConfig',
          noCache: true,
          isIframe: true,
          keepAlive: true,
        },
      },
      {
        path: 'systemConfig/thirdParty',
        component: () => import('@/views/systemConfig/thirdParty.vue'),
        name: 'SystemThirdParty',
        meta: {
          title: '第三方设置',
          icon: 'systemConfig',
          noCache: true,
          isIframe: true,
          keepAlive: true,
        },
      },
      {
        path: 'systemConfig/ecardSetting',
        component: () => import('@/views/systemConfig/ecardSetting.vue'),
        name: 'SystemEcardSetting',
        meta: {
          title: '一卡通设置',
          icon: 'systemConfig',
          noCache: true,
          isIframe: true,
          keepAlive: true,
        },
      },
      {
        path: 'systemConfig/developerTools',
        component: () => import('@/views/systemConfig/developerTools.vue'),
        name: 'DeveloperTools',
        meta: {
          title: '开发者工具',
          icon: 'systemConfig',
          noCache: true,
          isIframe: true,
          keepAlive: true,
        },
      },
      {
        path: 'language',
        component: () => import('@/views/multipleLanguage/index.vue'),
        name: 'Multiple language',
        meta: {
          title: '多语言管理',
          icon: 'multipleLanguage',
          noCache: true,
          isIframe: true,
          keepAlive: true,
        },
      },
      {
        path: 'layoutEditor',
        component: () => import('@/views/layoutEditor/index.vue'),
        name: 'layoutEditor',
        meta: {
          title: '方案布局',
          icon: 'layoutEditor',
          noCache: true,
          isIframe: true,
          keepAlive: true,
        },
      },
      {
        path: 'gatewayLogs',
        component: () => import('@/views/log/index.vue'),
        name: 'gatewayLogs',
        meta: {
          title: '网关日志',
          icon: 'layoutEditor',
          noCache: true,
          isIframe: true,
          keepAlive: true,
        },
      },
      {
        path: 'appClickLogs',
        component: () => import('@/views/log/appClickLogs.vue'),
        name: 'appClickLogs',
        meta: {
          title: '网关日志',
          icon: 'layoutEditor',
          noCache: true,
          isIframe: true,
          keepAlive: true,
        },
      },
      {
        path: 'thirdRegister',
        component: () => import('@/views/thirdRegister/index.vue'),
        name: 'thirdRegister',
        meta: {
          title: '第三方注册',
          icon: 'thirdRegister',
          noCache: true,
          isIframe: true,
          keepAlive: true,
        },
      },
      {
        path: 'wxCard/create',
        component: () => import('@/views/wxCard/create.vue'),
        name: 'wxCardCreate',
        meta: {
          title: '创建卡片',
          icon: '',
          noCache: true,
          isIframe: true,
          keepAlive: true,
        },
      },
      {
        path: 'wxCard/coupon',
        component: () => import('@/views/wxCard/coupon/index.vue'),
        name: 'wxCardCoupon',
        meta: {
          title: '卡券管理',
          icon: '',
          noCache: true,
          isIframe: true,
          keepAlive: true,
        },
      },
      {
        path: 'wxCard/user',
        component: () => import('@/views/wxCard/user/index.vue'),
        name: 'wxCardUser',
        meta: {
          title: '领卡用户',
          icon: '',
          noCache: true,
          isIframe: true,
          keepAlive: true,
        },
      }
      // {
      //   path: '404',
      //   name: '404',
      //   component: () => import('@/views/404.vue')
      // },
      // {
      //   path: ':pathMatch(.*)',
      //   redirect: '404'
      // },
      // {
      //   path: 'modules',
      //   component: () => import( '@/views/modules/index.vue'),
      //   name: 'modules',
      //   meta: {
      //     title: '组件列表',
      //     icon: 'about',
      //     noCache: true
      //   }
      // }
    ],
  },
]

export default routes
