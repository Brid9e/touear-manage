import { InjectionKey, computed } from 'vue'
import { createStore, Store } from 'vuex'
import {
  getToken,
  getUser,
  getOperatorUser,
  getPlatType,
  getCaptcha,
  Config,
  getMediaPlatType,
} from '@/service/manage'
import { SystemConfig } from '@/service/platform'
import { Cloud } from '@/service/cloud'
import { Local } from '@/service/local'
import Storage from '@/assets/scripts/storage'
import Cookie from '@/assets/scripts/cookie'
import _ from 'lodash'
import { useSessionStorage } from '@vueuse/core'
import router from '@/router'

// 租户信息
const tenantInfo: any = useSessionStorage('tenantInfo', {})

// 租户token
const tenToken = computed(() => {
  const tenId = sessionStorage.authPath?.split('-')?.[1]
  const token = tenantInfo.value[tenId]?.token
  return token
})

export interface State {
  token: string
  sidebar: any
  token_type: any
  userInfo: any
  menuData: any
  defaultActiveMeau: string
  subCurrentRoute: any
  breadcrumbArr: any
  // iframeSrc: string
  articleList: []
  configs: any
  host: string
  updateMenu: boolean
  nowRouterName: string
  changeBreadcrumbArr: any
  defaultActiveMeauItem: any
  platTypeList: any
  platMediaTypeLevel: any
  platTypeLevel: any
  moduleTypeList: any
  installStatusList: any
  userTypeList: any
  statusList: any
  scheme?: any
  platform?: any
  shortcut: any
  needCaptcha: any
  isFirstLogin: boolean
  iconModeList: any
  orgMenuData: any
  themeLoading: any
  autoLogin: any
  tableHeight: number
  isMicroApp: boolean
  getGlobalState: any
  microList: any
  lastAppName: string
  frontConfig: any
  funcButton: any
  platTypeLevelCloud: any
  manageLogo: string
  responseDataCatch: any
  deploymentType: any
  // showDialog: boolean
}
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    // showDialog: true,
    token:
      tenToken.value ||
      Storage.get('token', true) ||
      (Cookie.get('_uuid') && Cookie.get('_type')
        ? `${Cookie.get('_type')} ${Cookie.get('_uuid')}`
        : null),
    token_type: Storage.get('token_type', true) /*  || Cookie.get('_type') */,
    userInfo: Storage.get('userInfo', true) || null,
    autoLogin: Storage.get('autoLogin', false)
      ? !!Number(Storage.get('autoLogin', false))
      : false,
    sidebar: {
      opened: true,
      withoutAnimation: false,
    },
    configs: localStorage.configsManage
      ? JSON.parse(localStorage.configsManage)
      : null,
    host: location.origin,
    // menuData: Storage.get('menuData', false),
    menuData: sessionStorage.menuData
      ? JSON.parse(sessionStorage.menuData).data
      : [],
    shortcut: Storage.get('shortcut', true) || [],
    nowRouterName: '',
    updateMenu: false,
    needCaptcha: null,
    defaultActiveMeau: Storage.get('defaultActiveMeau', true),
    defaultActiveMeauItem: {},
    subCurrentRoute: {},
    changeBreadcrumbArr: [],
    orgMenuData: [],
    isFirstLogin: false,
    // breadcrumbArr: Storage.get('userInfo', false) || null,
    breadcrumbArr: Storage.get('breadcrumbArr', true),
    // iframeSrc: Storage.get('iframeSrc', true) || '',
    articleList: [] || null,
    platTypeList:
      Storage.get('platTypeList', true)?.length > 0
        ? Storage.get('platTypeList', true)
        : [],
    platTypeLevel: Storage.get('platTypeLevel', true),
    platMediaTypeLevel: Storage.get('platMediaTypeLevel', true),
    platTypeLevelCloud: Storage.get('platTypeLevelCloud', true),
    moduleTypeList: Storage.get('moduleTypeList', true),
    themeLoading: {
      pc: false,
      mobile: false,
      store: false,
    },
    installStatusList: [
      {
        label: '已安装',
        value: 1,
      },
      {
        label: '未安装',
        value: 0,
      },
    ],
    userTypeList: [
      {
        id: 1,
        name: '用户',
        label: 'user',
      },
      {
        id: 2,
        name: '商户',
        label: 'mercacc',
      },
      // {
      //   id: 3,
      //   name: '通用',
      //   label: 'common',
      // },
    ],

    // userTypeList: [
    //   {
    //     label: '用户',
    //     value: 'user'
    //   },
    //   {
    //     label: '商户',
    //     value: 'mercacc'
    //   }
    // ],
    statusList: [
      {
        label: '有效',
        value: 1,
      },
      {
        label: '无效',
        value: 0,
      },
    ],
    iconModeList: {
      mobile: [
        {
          code: 'checked',
          name: '选中状态',
        },
        {
          code: 'black',
          name: '深色模式',
        },
        {
          code: 'white',
          name: '正常模式',
        },
      ],
      pc: [
        {
          code: 'white',
          name: '图标',
        },
      ],
      selfService: [
        {
          code: 'white',
          name: '图标',
        },
      ],
    },
    tableHeight: 0 || Storage.get('tableHeight', true),
    isMicroApp: false,
    getGlobalState: null,
    microList: {},
    lastAppName: '',
    frontConfig: Storage.get('frontConfig', true),
    funcButton: {},
    manageLogo: '',
    responseDataCatch: {},
    deploymentType: null || parseInt(Storage.get('deploymentType', true)),
  },
  mutations: {
    menuData(state: any, data) {
      state.menuData = data
    },
    toggleSide({ sidebar }, data) {
      sidebar.opened = data
    },
    updateMenu(state: any, status) {
      state.updateMenu = status
    },
    nowRouterName(state: any, name) {
      state.nowRouterName = name
    },
    changeBreadcrumbArr(state: any, arr) {
      state.changeBreadcrumbArr = arr
    },
    Logout(state: any) {
      sessionStorage.removeItem('access_token')
      // sessionStorage.removeItem('access_token_yx')
      sessionStorage.clear()
      state.token = null
      Cookie.remove('_uuid')
      Cookie.remove('_type')
      router.push('/login')
    },
    setPlatType(state, payload) {
      state.platTypeList = payload.arr // 终端类型父子级
      payload.list = _.sortBy(payload.list, function (o: any) {
        return !o.parentCode
      }) // 排序
      state.platTypeLevel = payload.list // 终端类型同级
      state.platTypeLevelCloud = payload.cloudDataList // 终端类型同级云端
      sessionStorage.setItem(
        'platTypeLevelCloud',
        JSON.stringify(payload.cloudDataList),
      )
      sessionStorage.setItem('platTypeList', JSON.stringify(payload.arr))
      sessionStorage.setItem('platTypeLevel', JSON.stringify(payload.list))
    },
    setMediaPlatType(state, payload) {
      payload.list = _.sortBy(payload.list, function (o: any) {
        return !o.parentCode
      }) // 排序
      state.platMediaTypeLevel = payload.list // 终端类型同级
      sessionStorage.setItem('platMediaTypeLevel', JSON.stringify(payload.list))
    },
    setModuleType(state, payload) {
      state.moduleTypeList = payload
      sessionStorage.setItem('moduleTypeList', JSON.stringify(payload))
    },
    setTableHeight(state, payload) {
      state.tableHeight = payload
      sessionStorage.setItem('tableHeight', payload)
    },
    // changeDialoge({ showDialog }, isShow) {
    //   showDialog = isShow
    // },
    SET_STATE: (state: any, { key, data, storage }) => {
      // 更新状态
      state[key] = data
      /**
       * { 是否本地持久化 }
       * @param   {<Object>}  storage: {key: 'abc', session: true}，指定localStorage键值为'abc'
       */
      if (storage) {
        Storage.set(storage.key, data, storage.session)
      }
    },
  },
  actions: {
    // 登录
    LoginAction: async ({ commit }, params) => {
      // const { access_token, token_type }: any = await getToken(params, 'null')
      const { access_token, token_type }: any = {
        access_token: '1123123',
        token_type: 'Bearer',
      }
      commit('SET_STATE', {
        key: 'token',
        data: token_type + ' ' + access_token,
        storage: { key: 'token', session: true },
      })
      // const date = new Date()
      // date.setHours(date.getHours() + 1680)
      if (store.state.autoLogin) {
        Cookie.set('_uuid', access_token, 10)
        Cookie.set('_type', token_type, 10)
      }
      // document.cookie = `_uuid=${access_token};expires=${date.toUTCString()}`
      // document.cookie = `_type=${token_type};expires=${date.toUTCString()}`
      // commit('SET_STATE', {
      //   key: 'token',
      //   data: access_token,
      //   storage: { key: 'token', session: true }
      // })
      // commit('SET_STATE', {
      //   key: 'token_type',
      //   data: token_type,
      //   storage: { key: 'token_type', session: true }
      // })
    },

    // 退出登录
    LogoutAction(context) {
      // window.location.href =
      //   store.state.configs.base +
      //   '/berserker-base/redirect?type=logout&loginFrom=management&synjones-auth=' +
      //   store.state.token
      context.commit('Logout')
    },

    // 用户信息
    userInfoAction: async ({ commit }) => {
      // alert(store.state.deploymentType)
      const { data }: any = await (!!Number(store.state.deploymentType)
        ? getOperatorUser()
        : getUser())
      if (data) {
        commit('SET_STATE', {
          key: 'userInfo',
          data: data,
          storage: { key: 'userInfo', session: true },
        })
      }
    },

    // 当前高亮菜单项
    defaultActiveMeauAction: async ({ commit }, data) => {
      commit('SET_STATE', {
        key: 'defaultActiveMeau',
        data: data,
        storage: { key: 'defaultActiveMeau', session: true },
      })
    },

    // 内嵌页面的route对象
    subCurrentRouteAction: async ({ commit }, data) => {
      commit('SET_STATE', {
        key: 'subCurrentRoute',
        data: data,
        storage: { key: 'subCurrentRoute', session: true },
      })
    },

    //  获取登录验证码
    getCaptcha: async ({ state }: any, value) => {
      const params = {
        synAccessSource: 'pc',
      }
      const data = await getCaptcha(params)
      data._value = value
      state.needCaptcha = data
    },

    // 面包屑数据
    breadcrumbArrAction: async ({ commit, rootState }, data) => {
      let index_: any = null
      let arr: any = []
      const uniqData: any = _.uniqBy(data, 'name')
      for (const i in uniqData) {
        if (uniqData[i].name === rootState.subCurrentRoute.name) {
          index_ = i
        }
      }
      if (index_ == null) {
        arr = uniqData
      } else {
        arr = _.remove(uniqData, (r: any, index: any) => {
          return index <= index_
        })
        // console.log('uniqData', uniqData, 'arr', arr, 'index_', index_)
      }
      commit('SET_STATE', {
        key: 'breadcrumbArr',
        data: arr,
        storage: { key: 'breadcrumbArr', session: true },
      })
    },
    getPlatType: async ({ commit }, saas: any) => {
      let { data }: any = await getPlatType()
      let cloudData: any = []
      if (saas) {
        // // SAAS版请求本地备份文件
        // Local.getPlayType().then((r: any) => {
        //   cloudData = r.data
        initPlatType()
        // })
      } else {
        Cloud.getPlatType()
          .then((res: any) => {
            cloudData = res.data
            initPlatType()
          })
          .catch((err) => {
            // 云端资源请求失败， 请求本地备份文件
            Local.getPlayType().then((r: any) => {
              cloudData = r.data
              initPlatType()
            })
          })
      }
      function initPlatType() {
        let commonData = saas
          ? data
          : cloudData.filter((item: any) =>
              data.some((ele: any) => ele.code === item.code),
            )
        console.log('commonData', saas, data)

        const arr: any = []
        commonData.forEach((element: any, i: number) => {
          console.log(element.code, element.parentCode, !element.parentCode)
          if (!element.parentCode) {
            const children = commonData.filter((item: any) => {
              return item.parentCode === element.code
            })
            console.log('children', children)
            const obj = { ...element, ...{ children: children } }
            console.log('obj', obj)
            if (arr.findIndex((item: any) => item.code === obj.code) === -1)
              arr.push(obj)
          }
        })
        const list: any = JSON.parse(JSON.stringify(commonData))
        list.forEach((element: any) => {
          if (element.parentCode) {
            const index = list.findIndex(
              (item: any) => item.code === element.parentCode,
            )
            if (index >= 0) list.splice(index, 1)
          }
        })
        const cloudDataList = cloudData.filter((o: any) => {
          return (
            o.parentCode ||
            (!o.parentCode &&
              !cloudData.some((ele: any) => ele.parentCode === o.code))
          )
        })
        console.log('initPlatType', arr, list, cloudDataList)
        commit('setPlatType', { arr, list, cloudDataList })
      }
    },
    // 内容管理 类型
    getMediaPlatType: async ({ commit }, saas: any) => {
      let { data }: any = await getMediaPlatType()
      let cloudData: any = []
      if (saas) {
        // // SAAS版请求本地备份文件
        // Local.getPlayType().then((r: any) => {
        //   cloudData = r.data
        initPlatType()
        // })
      }
      function initPlatType() {
        let commonData = saas
          ? data
          : cloudData.filter((item: any) =>
              data.some((ele: any) => ele.code === item.code),
            )
        const list: any = JSON.parse(JSON.stringify(commonData))
        list.forEach((element: any) => {
          if (element.parentCode) {
            const index = list.findIndex(
              (item: any) => item.code === element.parentCode,
            )
            if (index >= 0) list.splice(index, 1)
          }
        })
        commit('setMediaPlatType', { list })
      }
    },
    getModuleType: async ({ commit }) => {
      const { data }: any = await Cloud.getModuleTypeList()
      commit('setModuleType', data)
    },
    getFrontConfig: async ({ commit }) => {
      await SystemConfig.frontInfo()
        .then(({ data }: any) => {
          commit('SET_STATE', {
            key: 'frontConfig',
            data: JSON.parse(data.getFrontConfig),
            storage: { key: 'frontConfig', session: true },
          })
        })
        .catch((err) => {})
      // if (data.getFrontConfig) localStorage.inited = 1
      // else localStorage.removeItem('inited')
      // commit('SET_STATE', {
      //   key: 'frontConfig',
      //   data: JSON.parse(data.getFrontConfig),
      //   storage: { key: 'frontConfig', session: true }
      // })
    },
    getDeploymentTypeConfig: async ({ commit }) => {
      // const isDevelopment = (process.env.NODE_ENV === "development")
      // try {
      await Config.getSystemConfig(
        {
          code: 'deployment_type',
        },
        'null',
      )
        .then(({ data }: any) => {
          const value = data.value === 'saas' ? 1 : 0 // saas版本
          commit('SET_STATE', {
            key: 'deploymentType',
            data: value,
            // data: isDevelopment ? 1 : value,
            storage: { key: 'deploymentType', session: true },
          })
        })
        .catch((err: any) => {
          commit('SET_STATE', {
            key: 'deploymentType',
            data: 0,
            // data: isDevelopment ? 1 : value,
            storage: { key: 'deploymentType', session: true },
          })
          console.log('1111', err)
        })
      // } catch (error) {
      //   console.log('22222', error)
      //   commit('SET_STATE', { // 私有版
      //     key: 'deploymentType',
      //     data: 0,
      //     // data: isDevelopment ? 1 : value,
      //     storage: { key: 'deploymentType', session: true },
      //   })
      // }
      // if (data.getFrontConfig) localStorage.inited = 1
      // else localStorage.removeItem('inited')
      // commit('SET_STATE', {
      //   key: 'frontConfig',
      //   data: JSON.parse(data.getFrontConfig),
      //   storage: { key: 'frontConfig', session: true }
      // })
    },
  },
  getters: {},
})
