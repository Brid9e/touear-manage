import type { RouteRecordRaw } from 'vue-router'
import MicroView from '@/views/microView/index.vue'
import { microAppList } from '../../../api.config'

/**
 *
 * @date 2024-01-19 13:43:01
 * @author Joe
 * @description 创建微应用的路由信息
 *
 */
const createMicroRoute = (): any => {
  const arr = []
  for (let i = 0; i < microAppList.length; i++) {
    const routeItem = {
      path: `${microAppList[i].code}/:pathMatch(.*)`,
      component: MicroView,
      name: microAppList[i].code,
      meta: {
        title: microAppList[i].name,
        requireAuth: true,
        isMicroApp: true,
        microAppContainer: 'page-' + microAppList[i].code,
      },
    }
    arr.push(routeItem)
  }
  return arr
}

const microRouter: Array<RouteRecordRaw> = createMicroRoute()

export { microRouter }

// const microRouter: Array<RouteRecordRaw> = [
//   {
//     path: 'manage-platform/:pathMatch(.*)',
//     component: MicroView,
//     name: 'manage-platform',
//     meta: {
//       title: '移动管理',
//       requireAuth: true,
//       isMicroApp: true,
//       microAppContainer: 'micro-app-platform',
//     },
//   },
//   {
//     path: 'manage-multimedia/:pathMatch(.*)',
//     component: MicroView,
//     name: 'manage-multimedia',
//     meta: {
//       title: '多媒体管理',
//       requireAuth: true,
//       isMicroApp: true,
//       microAppContainer: 'micro-app-multi-media',
//     },
//   },
//   {
//     path: 'manage-school-bus/:pathMatch(.*)',
//     component: MicroView,
//     name: 'manage-school-bus',
//     meta: {
//       title: '校车管理',
//       requireAuth: true,
//       isMicroApp: true,
//       microAppContainer: 'micro-app-school-bus',
//     },
//   },
//   {
//     path: 'manage-ecard/:pathMatch(.*)',
//     component: MicroView,
//     name: 'manage-ecard',
//     meta: {
//       title: '一卡通管理',
//       requireAuth: true,
//       isMicroApp: true,
//       microAppContainer: 'micro-app-ecard',
//     },
//   },
//   {
//     path: 'manage-charge/:pathMatch(.*)',
//     component: MicroView,
//     name: 'manage-charge',
//     meta: {
//       title: '缴费大厅管理',
//       requireAuth: true,
//       isMicroApp: true,
//       microAppContainer: 'micro-app-charge',
//     },
//   },
//   {
//     path: 'manage-self-service/:pathMatch(.*)',
//     component: MicroView,
//     name: 'manage-self-service',
//     meta: {
//       title: '自助管理',
//       requireAuth: true,
//       isMicroApp: true,
//       microAppContainer: 'micro-app-self-service',
//     },
//   },
//   {
//     path: 'manage-book/:pathMatch(.*)',
//     component: MicroView,
//     name: 'manage-book',
//     meta: {
//       title: '预定管理',
//       requireAuth: true,
//       isMicroApp: true,
//       microAppContainer: 'micro-app-book',
//     },
//   },
//   {
//     path: 'manage-message/:pathMatch(.*)',
//     component: MicroView,
//     name: 'manage-message',
//     meta: {
//       title: '消息管理',
//       requireAuth: true,
//       isMicroApp: true,
//       microAppContainer: 'micro-app-message',
//     },
//   },
// ]
