/**
 *
 * @date 2023-11-29 11:51:24
 * @author Joe
 * @description 将一些不需要重复调用的接口缓存起来
 *
 */
export const needCatchUrl = [
  '/berserker-base/identity',
  '/berserker-base/campus',
  '/berserker-base/basedepartment',
  '/berserker-base/basedepartment/gettree',
]

// && npm-run-all --parallel start:*

/**
 *
 * @date 2023-11-29 11:51:24
 * @author Joe
 * @description 管理端微应用配置
 * @focus layout-editor的特殊性，不属于微应用，而是通过iframe接入
 *
 */
export const microAppList = [
  {
    name: '移动管理',
    code: 'manage-platform',
  },
  {
    name: '多媒体管理',
    code: 'manage-multimedia',
  },
  {
    name: '校车管理',
    code: 'manage-school-bus',
  },
  {
    name: '一卡通管理',
    code: 'manage-ecard',
  },
  {
    name: '自助管理',
    code: 'manage-self-service',
  },
  {
    name: '缴费大厅管理',
    code: 'manage-charge',
  },
  {
    name: '预定管理',
    code: 'manage-book',
  },
  {
    name: '消息管理',
    code: 'manage-message',
  },
]
