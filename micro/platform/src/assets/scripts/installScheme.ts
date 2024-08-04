import lodash, { cloneDeep, map, pull, remove } from 'lodash'
import { ref, watch, nextTick } from 'vue'
import { Cloud } from '@/service/cloud'
import { ElMessage } from 'element-plus'
import { App } from '@/service/platform'
import { objDelete } from '@/assets/scripts/utils'
import { getFileFromOnlineImg } from '@/assets/scripts/file'
import { Scheme, Module, Menu } from '@/service/platform/index'
import { Scheme as FromSchemeClass } from '@/service/scheme/index'
import { store } from '@/store'

export default class HandleScheme {
  public async install(
    multipleSelection: any,
    tableDataOrg: any,
    bindProps?: any
  ) {
    const { tableData: _tableData, statusChange: _statusChange } = tableDataOrg
    tableData.value = _tableData || []
    statusChange.value = _statusChange || {}
    _multipleSelection.value = multipleSelection || []
    appProps.value = bindProps
    this.clear()
    message.value = ElMessage.info('正在添加方案...')
    // 添加方案
    const data: any = []
    multipleSelection.forEach((element: any) => {
      console.log('_element', element)
      if (!element || element.installFlag === 1) return
      let obj = {
        scheduleName: element.name,
        scheduleUserType: element.userType,
        scheduleServiceType: element.platType,
        schemeCode: element.code,
        scheduleDesc: element.description,
        // scheduleType: element.type || 'common',
        flagScheduleType: element.type === 'app' ? '1' : '0',
        flagIsCloud: 1,
      }
      data.push(obj)
    })
    // console.log(data)
    addSchedule.value = data
    let successData: any = data
    // 查询方案添加成功后信息
    await this.getSchemeList().then(async () => {
      successData.forEach((element: any, index: number) => {
        // 查询云端方案布局
        this.getCloudSchemeLayout(element.schemeCode).then(
          async (_res: any) => {
            let res
            if (!res) res = { comList: [], menuList: [], view: [] }
            try {
              res = JSON.parse(_res)
            } catch {
              res = _res
            }
            menuList = menuList.concat(res.menuList)
            moduleList = moduleList.concat(res.comList)
            // console.log('getCloudSchemeLayout', data)
            schemeLayout.push({
              ...res,
              schemeName: element.scheduleName,
              schemeCode: element.schemeCode,
              bindType: Number(element.flagScheduleType || 0)
                ? 'app'
                : 'common',
            })
            if (index + 1 === successData.length) {
              // 去重
              menuList = lodash.uniqBy(menuList, 'code')
              moduleList = lodash.uniqBy(moduleList, 'comCode')
              // 获取菜单
              await this.getMenuList().then(async (list: any) => {
                console.log('getMenuList', list)
                menuList?.forEach((element: any) => {
                  // 判断本地是否已添加该菜单
                  const index = list.findIndex(
                    (item: any) => item?.indexCode === element?.code
                  )
                  if (index === -1 && element) noMenuList.push(element)
                })
                if (noMenuList.length > 0) await this.addMenu(noMenuList)
                else isAdded.value.menu = true
              })
              // 获取组件
              await this.getModuleList().then(async (list: any) => {
                moduleList?.forEach((element: any) => {
                  // 判断本地是否已添加该组件
                  const index = list.findIndex(
                    (item: any) => item?.comCode === element?.comCode
                  )
                  if (index === -1 && element) noModuleList.push(element)
                })
                console.log('noModuleList----', noModuleList)
                if (noModuleList.length > 0) {
                  // 添加组件
                  await this.addModule(noModuleList)
                } else {
                  isAdded.value.module = true
                }
              })

              menuAllList = await this.getMenuList()
              moduleAllList = await this.getModuleList()
              appComponents.value = res?.comList?.filter(
                (_r: any) => _r?.comType === 1
              )
              if (!appComponents.value || appComponents.value?.length === 0) {
                isAdded.value.app = true
                isAdded.value.bindApp = true
                return
              }
              let appList: any = []
              let appInstalled: any = []
              for (let val of appComponents.value) {
                await this.getCloudComApp({ comCode: val.comCode })
                  .then((l: any) => {
                    appForCloudComponent.value[val.comCode] = l
                    for (let l_item of l) l_item.component = val.comCode
                    appList.push(...l)
                  })
                  .catch((err) => ElMessage.error(err.message))
              }
              lodash.uniqBy(appList, 'appCode')
              await this.getAllInstalled().then(
                (data: any) => (appInstalled = data)
              )
              for (let code of appInstalled)
                lodash.remove(appList, (n: any) => code === n.appCode)
              let c: any = {}
              for (let _val of appList) {
                c[_val.appCode] =
                  (c[_val.appCode] || '') +
                  `${c[_val.appCode] ? ',' + _val.component : _val.component}`
              }
              let d: any = lodash.uniqBy(appList, 'appCode')
              for (let t of d) t.component = c[t.appCode]
              if (appList?.length > 0) {
                await this.appInstall(
                  await this.appAllFormData(d, moduleAllList)
                )
                  .then((r) => {
                    if (r.code === 200) isAdded.value.app = true
                  })
                  .catch((err) => ElMessage.error(err))
              } else isAdded.value.app = true
              // await this.addMenuModule(noMenuList, noModuleList)
              // console.log('moduleAllList', moduleAllList)
              for (let val of moduleAllList) moduleIdObj[val.comCode] = val.bh
              await this.bindComApp(appForCloudComponent.value)
            }
          }
        )
      })
    })
  }

  // 查询方案列表
  private async getSchemeList() {
    const { data: res, code, msg }: any = await Scheme.getAppScheduleList()
    if (code === 200) schemeList.value = res
    else console.log(msg)
  }

  // 查询组件列表-
  public getModuleList() {
    return new Promise((resolve, reject) => {
      Module.getZcomList()
        .then((r) => resolve(r.data))
        .catch((err) => console.error(err))
    })
  }

  // 查询菜单列表
  public getMenuList() {
    return new Promise((resolve, reject) => {
      Menu.getZindexList()
        .then((r) => resolve(r.data))
        .catch((err) => console.error(err))
    })
  }
  // 查询云端组件绑定应用
  public getCloudComApp = async (params: { comCode: string }) => {
    return new Promise((resolve, reject) => {
      Cloud.getModuleBindApp(params)
        .then((r) => resolve(r.data))
        .catch((err) => console.error(err))
    })
  }

  // 获取已安装应用
  public getAllInstalled = () => {
    return new Promise((resolve, reject) => {
      App.getAppAll({ flagIsSelfApp: '0' })
        .then((r) => resolve(r.data))
        .catch((err) => console.error(err))
    })
  }

  // 应用安装
  private appInstall = async (formData: any) => await App.addApp(formData)

  // 处理终端类型
  private handlePlatType = (platType: string, type?: 0 | 1) => {
    const _typeList = platType?.split(',')
    if (_typeList?.includes('mobile')) {
      pull(_typeList, 'mobile')
      let mobileChildren = []
      let mobile = store.state.platTypeList?.find(
        (r: any) => r.code === 'mobile'
      )
      for (let val of mobile?.children) mobileChildren.push(val.code)
      mobileChildren = [...mobileChildren, ..._typeList]
      if (!type) return mobileChildren?.join(',')
      else return mobileChildren
    }
    return platType
  }

  private handleImgList = (_imgList: any, type?: 'app' | 'menu') => {
    const mobileChildList = this.handlePlatType('mobile', 1)
    if (type === 'app') {
      let _mobList = []
      const _mob = _imgList?.find((r: any) => r.code === 'mobile')
      for (let val of mobileChildList) {
        const _deepMob = cloneDeep(_mob)
        if (_deepMob) _deepMob.code = val
        _mobList.push(_deepMob)
      }
      let imgList = remove(_imgList, (r: any) => {
        return r.code !== 'mobile'
      })
      imgList = [...imgList, ..._mobList]
      return imgList
    }
    if (type === 'menu') {
      if (_imgList?.mobile) {
        for (let val of mobileChildList) {
          _imgList[val] = _imgList.mobile
        }
        delete _imgList.mobile
      }
      return _imgList
    }
  }

  // 添加组件
  private addModule = async (list: any) => {
    let formData: any = new FormData()
    for (let i = 0; i < list.length; i++) {
      const element: any = list[i]
      const obj: any = {
        appIconStyle: element.appIconStyle,
        comCode: element.comCode,
        name: element.comName,
        comType: element.comType,
        defaultTheme: element.defaultTheme,
        description: element.description,
        nameEn: element.nameEn,
        platType: this.handlePlatType(element.platType, 0),
        userType: element.userType,
      }
      if (element.extraConfig && element.extraConfig.appIconStyle)
        obj.appIconStyle = element.extraConfig.appIconStyle
      if (element.extraConfig && element.extraConfig.isAllApps)
        obj.isAllApps = element.extraConfig.isAllApps
      if (element.extraConfig && element.extraConfig.maxNumber)
        obj.maxNumber = element.extraConfig.maxNumber
      const file: any = await getFileFromOnlineImg(
        element.comIconUrl,
        element.comCode + '.png'
      )
      Object.keys(obj).forEach((key) => {
        if (obj[key]) formData.append(`zCom[${i}].${key}`, obj[key])
      })
      formData.append(`zCom[${i}].iconImage`, file)
    }
    const { data, code, msg }: any = await Module.addZcom(formData)
    // message.close()
    if (code === 200) {
      isAdded.value.module = true
    } else {
      console.log(msg)
    }
  }

  private getAppAll = async () => {
    const { data: res, code, msg } = await App.getZappListAll()
    if (code === 200) appAll.value = res
    else ElMessage.error('未获取到应用列表')
  }
  // 判断组件菜单未安装的列表数量，大于0则安装
  // private addMenuModule = async (menuList: any, moduleList: any) => {
  //   if (menuList.length > 0) await this.addMenu(menuList)
  //   if (moduleList.length > 0) await this.addModule(moduleList)
  // }

  // 保存方案结构
  saveSchemeLayout = async () => {
    await this.getSchemeList()
    let promiseArr: any = []
    schemeLayout.forEach(async (element: any) => {
      const params = this.initSchemeParams(element, menuAllList, moduleAllList)
      promiseArr.push(FromSchemeClass.saveDetailNode(params))
    })
    Promise.all(promiseArr)
      .then((r) => {
        let arr: any = []
        for (let index in r) {
          if (r[index].code !== 200) arr.push(schemeLayout[index].schemeName)
        }
        message.value.close()
        if (arr?.length > 0) {
          ElMessage.warning(
            `安装成功，但${arr.join(
              '、'
            )}不存在云端方案结构，需要在管理端重新设置方案结构`
          )
        } else {
          ElMessage.success('安装成功')
        }
        this.changeStatus(true)
      })
      .catch((err) => console.error(err))
  }

  // 云端方案数据格式->管理端方案数据格式
  private initSchemeParams = (element: any, menuList: any, moduleList: any) => {
    let _comList: any = []
    let _menuList: any = []
    let _pageHeaderFooter: any = []
    // 取组件bh，处理comList
    element?.comList?.forEach((r: any) => {
      if (!r) return
      const obj = JSON.parse(JSON.stringify(r || '{}'))
      obj.bh = moduleList.find((_r: any) => _r?.comCode === r?.comCode)?.bh
      _comList.push(obj)
    })
    // 取组件bh，处理pageHeaderFooter
    element?.pageHeaderFooter?.forEach((r: any) => {
      if (!r) return
      const obj = JSON.parse(JSON.stringify(r || '{}'))
      obj.bh = moduleList.find((_r: any) => _r?.comCode === r?.comCode)?.bh
      _pageHeaderFooter.push(obj)
    })
    // 取菜单bh，处理menuList
    element?.menuList?.forEach((r: any) => {
      if (!r) return
      // const obj = JSON.parse(JSON.stringify(r || '{}'))
      let obj = menuList.find((_r: any) => _r.indexCode === r.code)
      _menuList.push(obj)
    })
    // 处理view
    element?.view?.forEach((r: any) => {
      for (let val of r) {
        val.bh = _comList.find((_r: any) => _r?.comCode === val?.comCode)?.bh
        val.imgUrl = moduleList.find(
          (_r: any) => _r?.comCode === val?.comCode
        )?.icon
      }
    })
    let _view: any = element.view
    let _data: any = []
    let node = 0
    let isApp = element.bindType === 'app'
    if (_menuList?.length > 0) {
      for (let val of _menuList) {
        let obj: any = {}
        obj.node = node + 1
        obj.parentNode = 0
        obj.resourceId = val.bh
        obj.resourceOrder = node + 1
        obj.resourceType = 'menu'
        obj.status = 1
        _data.push(obj)
        node++
      }
    }
    _view?.forEach((r: any, index: number) => {
      for (let val of r) {
        let obj: any = {}
        obj.node = node + 1
        obj.parentNode = _menuList?.length ? index + 1 : 0
        obj.resourceId = val.bh
        obj.resourceOrder = node + 1
        obj.resourceType = 'component'
        obj.nodeConfig = JSON.stringify({ span: val.w })
        obj.status = 1
        _data.push(obj)
        node++
      }
    })
    if (_pageHeaderFooter?.length > 0) {
      for (let val of _pageHeaderFooter) {
        let obj: any = {}
        obj.node = node + 1
        obj.parentNode = 0
        obj.resourceId = val.bh
        obj.resourceOrder = node + 1
        obj.resourceType = 'component'
        obj.nodeConfig = JSON.stringify({ span: 24 })
        obj.status = 1
        _data.push(obj)
        node++
      }
    }
    console.log('_comList_comList', _comList)
    const params = {
      // callbackView: JSON.stringify({
      //   menuList: _menuList,
      //   pageHeaderFooter: _pageHeaderFooter,
      //   comList: _comList,
      //   view: _view,
      //   orgComList: _comList,
      //   orgMenuList: _menuList,
      // }),
      callbackView: JSON.stringify({
        menuList: _menuList,
        pageHeaderFooter: _pageHeaderFooter,
        comList: map(_comList, (obj: any) => {
          obj.comIconUrl = store.state.configs.base + '/minio/public/comIcon/' + obj.comCode + '.jpg'
          return obj
        }),
        view: _view,
        orgComList: map(_comList, (obj: any) => {
          obj.comIconUrl = store.state.configs.base + '/minio/public/comIcon/' + obj.comCode + '.jpg'
          return obj
        }),
        orgMenuList: _menuList,
      }),
      scheduleId: schemeList.value.find(
        (_r: any) => _r.schemeCode === element.schemeCode
      )?.id,
      data: _data,
      bindType: isApp ? 'app' : undefined,
      bindId: appProps.value?.bindId || undefined,
    }
    console.log({
      menuList: _menuList,
      pageHeaderFooter: _pageHeaderFooter,
      comList: _comList,
      view: _view,
      orgComList: _comList,
      orgMenuList: _menuList,
    })
    return params
  }

  private clear = () => {
    menuList = []
    moduleList = []
    noMenuList = []
    noModuleList = []
    schemeLayout = []
    isAdded.value.menu = false
    isAdded.value.module = false
  }

  private appAllFormData = async (appList: any, compAll: any) => {
    for (let _element of appList) {
      for (let i = 0; i < _element.extraConfig.img.length; i++) {
        if (_element.extraConfig.img[i].src) {
          await getFileFromOnlineImg(
            _element.extraConfig.img[i].src,
            _element.appCode + '.png'
          )
            .then((r) => (_element.extraConfig.img[i].file = r))
            .catch((err) => (_element.extraConfig.img[i].file = null))
        }
      }
    }

    let formData: any = new FormData()
    appList.forEach((element: any, index: number) => {
      let submitInstallApi: any = null
      let installConfigForm = ''
      let urlArr: any = []
      const configs = localStorage.getItem('configsManage')
        ? JSON.parse(localStorage.getItem('configsManage') as string)
        : {}
      if (element.extraConfig.installConfig.length > 0) {
        let need = false
        element.extraConfig.installConfig.forEach((formI: any) => {
          if (
            formI.type !== 'el-button' &&
            formI.value &&
            formI.value.length > 0
          ) {
            console.log('formI.value---', formI.value, formI.value.length)
            need = true
          }
        })
        if (need) {
          const obj =
            element.extraConfig.installConfig.find(
              (item: any) =>
                item.type === 'el-button' && item.children[0] === 'submit-add'
            ) || {}
          submitInstallApi = obj.effect ? obj.effect.fetch : null
          installConfigForm = JSON.stringify({
            action: submitInstallApi.action.replace('$manage$', configs.base),
            data: element.extraConfig.installConfigSubmit,
            method: submitInstallApi.method,
          })
        }
      }
      element.extraConfig.url.forEach((item: any) => {
        if (item.children && item.children.length > 0)
          urlArr = urlArr.concat(item.children)
        else urlArr.push(item)
      })
      const compObj: any = {}
      const bhArr = []
      for (let val of compAll) compObj[val.comCode] = val.bh
      for (let val of element.component.split(',')) bhArr.push(compObj[val])
      const obj: any = {
        appCode: element.appCode || '', // 必填， 第三方没有的， 后端自己生成
        appName: element.appName, // 必填
        appDesc: element.appDesc, // app描述；非必填
        status: 1, // 状态； 前端传1 (0 无效，1有效)
        appNameEn: element.appNameEn || '', // 非必填 ！！！！！
        flagIsSelfApp: 0, //是否是第三方应用 1-是, 0-不是；  必填
        // appUserType: element.appUserType, // 应用所属用户类型；非必填，默认值：通用
        userType: element.appUserType || 'common', // 应用所属用户类型；非必填，默认值：通用
        showTitle: 1, // 是否显示头【0:否 1:是】；默认值：是
        // icon: element.extraConfig.img, // 应用图标
        url: JSON.stringify(urlArr), // 应用地址
        // component: element.component, // 应用绑定的组件code逗号连接
        component: bhArr.join(','), // 应用绑定的组件bh逗号连接
        purviewSetting: '', // 权限，暂时不用解析，
        installConfig: JSON.stringify(element.extraConfig.installConfig), // 安装配置
        // installConfigForm: step.addType === 'base' ? element.extraConfig.installConfigSubmit : null, //安装配置提交表单
        installConfigForm: installConfigForm,
        webApi: element.webApi || '', // 应用接口；非必填
        route: '', // 前端页面路由名;非必填
        platType: this.handlePlatType(element.platType, 0),
        appType: 4, // 应用类型； 非必填
        isPersist: 0, // 保留数据0-否 1-是 不允许删除；非必填
        flagIsTopApp: 0, // 是否置顶(默认应用)
        flagIsAdSupport: 0, // 是否能设置广告：0否1是； 默认值：否
        flagIsShow: 1, // 是否在界面显示 ；默认值：是
        flagIsEmbeddedRedirect: 0, // 是否内嵌跳转；默认值：否
        developerId: '', // 用户ID:默认为0；非必填
        authMethods: element.authMethods, // 认证方式
        flagIsLoginRequired: '1', // 是否需要登录
        supportSchedule:
          element.supportSchedule === undefined ? 0 : element.supportSchedule, // 是否支持方案
        isAllowCloning: element.extraConfig?.isAllowClone ? true : false, //是否允许克隆
        // serviceAppWebsite: '', // 链接地址(服务应用端)； 非必填
        // website: h5UrlObj ? h5UrlObj.url : null, // 链接地址(移动端)；非必填，向下兼容
        // webAppWebsite: pcUrlObj ? pcUrlObj.url : null, // 链接地址(PC端； 非必填， 向下兼容
        // flagIsMobileApp: 1, // 是否是手机应用
        // flagIsWebApp: 1, // 是否是网页应用
        // flagIsH5App: 1, // 是否是H5应用
        // flagIsWeChatMiniApp: 1, // 是否是微信应用
        // appIcon: '', // 非必填
        // appIconPrefix: '', // 废弃，非必填
        // flagIsServiceApp: 0, // 是否是服务应用
        // newIconUrl: null, // 更新图标的源文件地址；非必填
        // flagIsPublicIcon: 0 // 是否使用公共图标；默认值：否
      }
      Object.keys(obj).forEach((key) => {
        formData.append(`zApp[${index}].${key}`, obj[key])
      })
      let indexicon = 0
      const imgList = this.handleImgList(element.extraConfig.img, 'app')
      imgList.forEach((imgO: any, _index: number) => {
        if (imgO?.file) {
          imgO.file &&
            formData.append(
              `zApp[${index}].iconByFile[${indexicon}].file`,
              imgO.file
            )
          imgO.code &&
            formData.append(
              `zApp[${index}].iconByFile[${indexicon}].type`,
              imgO.code
            )
          indexicon++
          // j = j + 1
        }
      })
    })
    return formData
  }

  // 查询云端方案布局
  public getCloudSchemeLayout = (scheduleCode: string) => {
    return new Promise((resolve, reject) => {
      Cloud.getScheduleStructure({ scheduleCode })
        .then((r) => resolve(r.data))
        .catch((err) => console.log(err))
    })
  }

  // 添加菜单
  private addMenu = async (list: any) => {
    const formData = new FormData()
    for (let i = 0; i < list.length; i++) {
      const element: any = list[i]
      console.log(element)
      if (!element) return
      const obj: any = {
        name: element.name,
        nameEn: element.name,
        indexCode: element.code,
        platType: this.handlePlatType(element.platType, 0),
        type: element.userType,
        flagIsCloud: 1,
      }
      if (element.extraConfig && element.extraConfig.url) {
        obj.extraConfig = JSON.stringify(element.extraConfig.url)
      }
      let iconByFile: any = []
      const _iconUrlMap = this.handleImgList(
        element.extraConfig.iconUrlMap,
        'menu'
      )

      // 处理图标文件
      // let index = 0 // 图标索引
      if (element.extraConfig && element.extraConfig.iconUrlMap) {
        for (const key in _iconUrlMap) {
          // console.log(element.extraConfig.iconUrlMap[key])
          for (const m in _iconUrlMap[key]) {
            let fileObj = {
              file: null,
              type: '',
            }
            if (_iconUrlMap[key][m]) {
              fileObj.type = key + '#' + m
              fileObj.file = await getFileFromOnlineImg(
                _iconUrlMap[key][m],
                element.code + '.png'
              )
              iconByFile.push(fileObj)
            }
          }
        }
      }

      let indexIcon = 0
      obj.iconByFile = iconByFile
      Object.keys(obj).forEach((key) => {
        if (key === 'iconByFile') {
          obj['iconByFile'].forEach((element: any) => {
            element.file &&
              formData.append(
                `zAppIndex[${i}].iconByFile[${indexIcon}].file`,
                element.file
              )
            element.type &&
              formData.append(
                `zAppIndex[${i}].iconByFile[${indexIcon}].type`,
                element.type
              )
            indexIcon++
          })
        } else if (obj[key]) formData.append(`zAppIndex[${i}].${key}`, obj[key])
      })
    }
    const { code, msg }: any = await Menu.addZindex(formData)
    if (code === 200) {
      isAdded.value.menu = true
    } else ElMessage.error(msg)
  }

  // 绑定组件app
  private bindComApp = async (comObj: any) => {
    await this.getAppAll()
    for (let val of appAll.value) appIdObj[val.appCode] = val.bh
    let addItemArr: any = []
    const addItem = async (comId: number, acaList: any[]) => {
      const params = {
        comId: comId,
        acaList: acaList,
      }
      return await Module.setComBindApp(params)
    }
    // Object.keys(comObj).map(async (key: string) => {
    //   let _appList = []
    //   for (let val of comObj[key]) {
    //     let obj: any = {}
    //     obj.appId = appIdObj[val.appCode]
    //     appIdObj[val.appCode] ? _appList.push(obj) : undefined
    //   }
    //   addItemArr.push(await addItem(moduleIdObj[key], _appList))
    // })
    for (let key in comObj) {
      let _appList = []
      for (let val of comObj[key]) {
        let obj: any = {}
        obj.appId = appIdObj[val.appCode]
        appIdObj[val.appCode] ? _appList.push(obj) : undefined
      }
      addItemArr.push(await addItem(moduleIdObj[key], _appList))
    }
    Promise.all(addItemArr).then((r: any) => {
      let isSuccess = true
      for (let val of r) {
        if (val.code !== 200) isSuccess = false
        isAdded.value.bindApp = isSuccess
      }
      if (!isSuccess) {
        message.value.close()
        ElMessage.error('组件绑定应用失败')
        this.changeStatus(false)
      }
    })
  }

  private changeStatus = (status?: boolean) => {
    // 处理安装完成后的操作
    const obj = statusChange.value?.[status ? 'success' : 'fail']
    let selectCodeArrAll = _multipleSelection.value.map(
      (item: any) => item.code
    )
    // 选中的方案Code集合
    tableData.value?.length > 0 &&
      tableData.value.forEach((r: any) => {
        selectCodeArrAll.forEach((_r: any) => {
          if (r.code === _r) {
            for (let key in obj) {
              r[key] = obj?.[key]
            }
          }
        })
      })
    console.log('tableData.value', tableData.value)
  }

  public callBackData = (callBack: any) => {
    return callBack()
  }
}

// 声明一些量
const messageHTML = ref()
const appAll: any = ref([])
const tableData: any = ref([])
const schemeList: any = ref([])
const loading = ref(false)
const appComponents: any = ref<any[]>([])
const addSchedule = ref()
const appForCloudComponent = ref<any>({})
const statusChange: any = ref({})
const _multipleSelection: any = ref([])
const message = ref()
const appProps: any = ref({})
const isAdded: any = ref({
  menu: false,
  module: false,
  app: false,
  bindApp: false,
})
const form: any = ref({
  name: null,
  userType: null,
  platType: null,
})

let menuList: any = [] // 方案包含菜单数据
let moduleList: any = [] // 方案包含组件数据
let noMenuList: any = [] // 未添加的菜单
let noModuleList: any = [] // 未添加的组件
let schemeLayout: any = [] // 所选方案布局
let menuAllList: any = [] // 所有菜单
let moduleAllList: any = [] // 所有组件
// let menuListObj: any = {}
let moduleIdObj: any = {}
let appIdObj: any = {}

watch(
  () => isAdded.value,
  async (r) => {
    console.log(r.menu, r.module, r.app, r.bindApp)
    if (r.menu && r.module && r.app && r.bindApp) {
      // 保存方案布局
      await Scheme.addSchedule(addSchedule.value)
        .then((res: any) => {
          if (res.code === 200) {
            new HandleScheme().saveSchemeLayout()
          } else {
            ElMessage.error('基本信息安装失败')
          }
        })
        .catch(() => {
          ElMessage.error('基本信息安装失败')
        })
    }
  },
  { deep: true }
)
