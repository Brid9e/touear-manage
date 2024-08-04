<template lang="pug">
.content-addAppType.content-bg.appResult
  //- h1.text-center 恭喜你，成功创建“校园卡”应用
  div(v-if='typeValue === "base"')
    div(v-if='yeslist.length > 0')
      h1.text-center 恭喜您，成功添加以下应用！
      ul.applist-result.box-shadow(:class='{ "text-center": true }')
        li.text-center(v-for='(item, key) in yeslist', :key='key')
          el-image.img(:src='item.masterImg' fit="contain")
            template(#error)
              el-image(:src='defaultAppIcon')
          p.text-gray-6 {{ item.appName }}
          p.text-danger(style='height: 20px')
            span(v-if='limitError.indexOf(item.appCode) !== -1', :style='{ visibility: limitError.indexOf(item.appCode) === -1 ? "hidden" : "" }') 权限设置失败
    div(v-if='notList.length > 0')
      h3.text-center.text-gray-5
        img(:src='defaultAppIcon')
        | 以下应用添加失败~~~
      ul.applist-result.box-shadow(:class='{ "text-center": true }')
        li.text-center(v-for='(item, key) in notList', :key='key')
          el-image.img(:src='item.masterImg')
            template(#error)
              el-image(:src='defaultAppIcon')
          p.text-gray-6 {{ item.appName }}
          p.font-size-14.text-danger 原因：{{ item.errmsg }}
  div(v-else)
    .text-center.app-one(v-if='yeslist.length > 0')
      el-svg-icon.successFilled
        SuccessFilled
      h3.font-size-28.text-gray-7.margin-top-2x “{{ yeslist[0].appName }}”应用添加成功！
    .text-center.app-one(v-else-if='notlist.length > 0')
      el-image.img.margin-bottom-2x(:src='defaultAppIcon')
      h3.font-size-28.text-gray-5 该应用添加失败，请重新添加~~~
      p {{ notlist[0] }}
      p(v-if='limitError.indexOf(item.appCode) !== -1', :style='{ visibility: limitError.indexOf(item.appCode) === -1 ? "hidden" : "" }') 权限设置失败
</template>
<script lang="ts" setup>
import { ref, computed, defineProps } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import { SuccessFilled } from '@element-plus/icons-vue'
const defaultAppIcon = new URL('../../../../assets/images/example.svg', import.meta.url).href
const store = useStore(key)
const { state } = store
const props = defineProps(['resultData', 'typeValue'])
const result = ref(props.resultData)
const typeValue = ref(props.typeValue)
const res = {
  code: 200,
  success: true,
  data: {
    updateTime: '2023-02-07 09:52:05',
    schemeId: 1061,
    schemeCode: 'userWeb',
    structureInfo: {
      nodeType: 'root',
      parentNodeId: null,
      nodeId: null,
      nodeOrder: null,
      nodeRelatedId: null,
      nodeConfig: null,
      combinedAppList: [],
      combinedComponentList: [
        {
          nodeType: 'component',
          parentNodeId: 0,
          nodeId: 6335,
          nodeOrder: 13,
          nodeRelatedId: 1817,
          nodeConfig: '{"span":24}',
          name: 'PC头部',
          height: null,
          width: null,
          type: null,
          url: null,
          serviceAppWebsite: null,
          description: null,
          comCode: 'pcHead',
          jumpIndexCode: null,
          flag: '0000000000',
          componentOrder: null,
          zbaseAppEntity: null,
          appIconStyle: 'seachBarPC',
          nameEn: 'pcHead',
          combinedAppList: [
            { nodeType: 'app', parentNodeId: 6335, nodeId: -9, nodeOrder: 1, nodeRelatedId: 164, nodeConfig: '1817', apiKey: 'NU7Begj7', appCode: 'sousuo', appName: '搜索', appNameEn: 'Search', appDesc: 'null', appIcon: 'sousuo', appIconPrefix: '.png', appIconUrlPrefix: 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/white', appIconWhole: 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/white/seachBarPC/sousuo.png', iconWholeList: ['http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/checked/appView/sousuo.png', 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/black/appView/sousuo.png', 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/white/appView/sousuo.png'], appOrder: null, appType: '-1', website: '/plat?name=search', serviceAppWebsite: null, webAppWebsite: '/plat-pc/search', webApi: null, showTitle: 1, jumpIndexCode: null, schoolCityName: '杭州市', schoolCityCode: '330100', route: 'Search', myApp: null, flagIsLoginRequired: '0', flagIsSelfApp: '0', flagIsH5App: '0', flagIsWeChatMiniApp: '0', authMethods: null, url: '{"name":"Web端","code":"pc","appIdRequired":0,"parentCode":null,"routingParameters":1,"children":[],"url":"/plat-pc/search","route":"Search"}', supportSchedule: '0', zbaseAppTypeEntity: null, combinedAppList: null, combinedComponentList: null, combinedMenuList: null, bh: 164 },
            { nodeType: 'app', parentNodeId: 6335, nodeId: -10, nodeOrder: 2, nodeRelatedId: 176, nodeConfig: '1817', apiKey: 'cXDAbfd0', appCode: 'card-bag', appName: '卡包', appNameEn: 'Card Bag', appDesc: null, appIcon: 'card-bag', appIconPrefix: '.png', appIconUrlPrefix: 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/white', appIconWhole: 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/white/seachBarPC/card-bag.png', iconWholeList: ['http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/checked/appView/card-bag.png', 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/black/appView/card-bag.png', 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/white/appView/card-bag.png'], appOrder: null, appType: '-1', website: '/campus-card/?name=campusCard', serviceAppWebsite: null, webAppWebsite: '/campus-card-pc?name=campusCard', webApi: null, showTitle: 1, jumpIndexCode: null, schoolCityName: '杭州市', schoolCityCode: '330100', route: 'campusCard', myApp: null, flagIsLoginRequired: '0', flagIsSelfApp: '0', flagIsH5App: '0', flagIsWeChatMiniApp: '0', authMethods: '""', url: '{"name":"Web端","code":"pc","appIdRequired":0,"parentCode":null,"routingParameters":1,"children":[],"url":"/campus-card-pc?name=campusCard","route":"campusCard"}', supportSchedule: '0', zbaseAppTypeEntity: null, combinedAppList: null, combinedComponentList: null, combinedMenuList: null, bh: 176 },
            { nodeType: 'app', parentNodeId: 6335, nodeId: -11, nodeOrder: 3, nodeRelatedId: 380, nodeConfig: '1817', apiKey: '4pcFMgXM', appCode: 'userSetting', appName: '用户设置', appNameEn: 'User Setting', appDesc: null, appIcon: 'userSetting', appIconPrefix: '.png', appIconUrlPrefix: 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/white', appIconWhole: 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/white/seachBarPC/userSetting.png', iconWholeList: ['http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/checked/appView/userSetting.png', 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/black/appView/userSetting.png', 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/white/appView/userSetting.png'], appOrder: null, appType: '0', website: null, serviceAppWebsite: null, webAppWebsite: '/plat-pc/user/setUp', webApi: null, showTitle: 1, jumpIndexCode: null, schoolCityName: '杭州市', schoolCityCode: '330100', route: 'SetUp', myApp: null, flagIsLoginRequired: '1', flagIsSelfApp: '0', flagIsH5App: '0', flagIsWeChatMiniApp: '0', authMethods: '""', url: '{"name":"Web端","code":"pc","appIdRequired":0,"parentCode":null,"routingParameters":1,"children":[],"url":"/plat-pc/user/setUp","route":"SetUp"}', supportSchedule: '0', zbaseAppTypeEntity: null, combinedAppList: null, combinedComponentList: null, combinedMenuList: null, bh: 380 }
          ],
          combinedComponentList: [],
          combinedMenuList: [],
          bh: 1817
        },
        { nodeType: 'component', parentNodeId: 0, nodeId: 6336, nodeOrder: 14, nodeRelatedId: 1815, nodeConfig: '{"span":24}', name: 'PC尾部', height: null, width: null, type: null, url: null, serviceAppWebsite: null, description: null, comCode: 'pcTail', jumpIndexCode: null, flag: '0000000000', componentOrder: null, zbaseAppEntity: null, appIconStyle: 'seachBar', nameEn: 'pcTail', combinedAppList: null, combinedComponentList: null, combinedMenuList: null, bh: 1815 }
      ],
      combinedMenuList: [
        {
          nodeType: 'menu',
          parentNodeId: 0,
          nodeId: 6323,
          nodeOrder: 1,
          nodeRelatedId: 1490,
          nodeConfig: null,
          type: 'user',
          status: 1,
          name: '服务分类',
          icon: '',
          iconPrefix: null,
          iconUrlPrefix: 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/white',
          iconWhole: null,
          iconWholeList: [],
          websize: null,
          serviceAppWebsite: null,
          webAppWebsite: '/plat-pc/serviceclassification',
          indexCode: 'ServiceClassification',
          route: 'Home',
          nameEn: '服务分类',
          url: '{"name":"Web端","code":"pc","appIdRequired":0,"parentCode":"","routingParameters":1,"children":[],"url":"/plat-pc/serviceclassification","route":"Home"}',
          appId: null,
          combinedAppList: [],
          combinedComponentList: [
            { nodeType: 'component', parentNodeId: 6323, nodeId: 6328, nodeOrder: 6, nodeRelatedId: 1814, nodeConfig: '{"span":24}', name: '广告组件', height: null, width: null, type: null, url: null, serviceAppWebsite: null, description: null, comCode: 'PCAdvert', jumpIndexCode: null, flag: '0000000000', componentOrder: null, zbaseAppEntity: null, appIconStyle: 'seachBar', nameEn: 'PCAdvert', combinedAppList: null, combinedComponentList: null, combinedMenuList: null, bh: 1814 },
            { nodeType: 'component', parentNodeId: 6323, nodeId: 6329, nodeOrder: 7, nodeRelatedId: 1811, nodeConfig: '{"span":24}', name: '热门推荐', height: null, width: null, type: null, url: null, serviceAppWebsite: null, description: null, comCode: 'PCPopularRecommendation', jumpIndexCode: null, flag: '0000000000', componentOrder: null, zbaseAppEntity: null, appIconStyle: 'appViewPC', nameEn: 'PCPopularRecommendation', combinedAppList: null, combinedComponentList: null, combinedMenuList: null, bh: 1811 },
            {
              nodeType: 'component',
              parentNodeId: 6323,
              nodeId: 6330,
              nodeOrder: 8,
              nodeRelatedId: 1809,
              nodeConfig: '{"span":24}',
              name: '应用栏',
              height: null,
              width: null,
              type: null,
              url: null,
              serviceAppWebsite: null,
              description: null,
              comCode: 'appPcView',
              jumpIndexCode: null,
              flag: '0000000000',
              componentOrder: null,
              zbaseAppEntity: null,
              appIconStyle: 'appViewPC',
              nameEn: 'appPcView',
              combinedAppList: [
                { nodeType: 'app', parentNodeId: 6330, nodeId: -1, nodeOrder: 1, nodeRelatedId: 169, nodeConfig: '1809', apiKey: 'xmMLgKL3', appCode: 'bind-campus-card', appName: '校园卡绑定', appNameEn: 'Bind Campus Card', appDesc: null, appIcon: 'bind-campus-card', appIconPrefix: '.png', appIconUrlPrefix: 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/white', appIconWhole: 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/white/appViewPC/bind-campus-card.png', iconWholeList: ['http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/checked/appView/bind-campus-card.png', 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/black/appView/bind-campus-card.png', 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/white/appView/bind-campus-card.png'], appOrder: null, appType: '0', website: '/campus-card/?name=bindCampusCard', serviceAppWebsite: null, webAppWebsite: '/campus-card-pc/?name=addCampusCard', webApi: null, showTitle: 1, jumpIndexCode: null, schoolCityName: '杭州市', schoolCityCode: '330100', route: 'addCampusCard', myApp: null, flagIsLoginRequired: '1', flagIsSelfApp: '0', flagIsH5App: '0', flagIsWeChatMiniApp: '0', authMethods: '""', url: '{"name":"Web端","code":"pc","appIdRequired":0,"parentCode":null,"routingParameters":1,"children":[],"url":"/campus-card-pc/?name=addCampusCard","route":"addCampusCard"}', supportSchedule: '0', zbaseAppTypeEntity: null, combinedAppList: null, combinedComponentList: null, combinedMenuList: null, bh: 169 },
                { nodeType: 'app', parentNodeId: 6330, nodeId: -2, nodeOrder: 2, nodeRelatedId: 200, nodeConfig: '1809', apiKey: '6vSpCy6o', appCode: 'card-recharge', appName: '卡片充值', appNameEn: 'Card Recharge', appDesc: null, appIcon: 'card-recharge', appIconPrefix: '.png', appIconUrlPrefix: 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/white', appIconWhole: 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/white/appViewPC/card-recharge.png', iconWholeList: ['http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/checked/appView/card-recharge.png', 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/black/appView/card-recharge.png', 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/white/appView/card-recharge.png'], appOrder: null, appType: '-1', website: '/campus-card/?name=cardRecharge', serviceAppWebsite: null, webAppWebsite: 'cardRecharge', webApi: null, showTitle: 1, jumpIndexCode: null, schoolCityName: '杭州市', schoolCityCode: '330100', route: '/campus-card-pc/?name=cardRecharge', myApp: null, flagIsLoginRequired: '0', flagIsSelfApp: '0', flagIsH5App: '0', flagIsWeChatMiniApp: '0', authMethods: '""', url: '{"name":"Web端","code":"pc","appIdRequired":0,"parentCode":null,"routingParameters":1,"children":[],"route":"/campus-card-pc/?name=cardRecharge","url":"cardRecharge"}', supportSchedule: '0', zbaseAppTypeEntity: null, combinedAppList: null, combinedComponentList: null, combinedMenuList: null, bh: 200 },
                { nodeType: 'app', parentNodeId: 6330, nodeId: -3, nodeOrder: 3, nodeRelatedId: 176, nodeConfig: '1809', apiKey: 'cXDAbfd0', appCode: 'card-bag', appName: '卡包', appNameEn: 'Card Bag', appDesc: null, appIcon: 'card-bag', appIconPrefix: '.png', appIconUrlPrefix: 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/white', appIconWhole: 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/white/appViewPC/card-bag.png', iconWholeList: ['http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/checked/appView/card-bag.png', 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/black/appView/card-bag.png', 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/white/appView/card-bag.png'], appOrder: null, appType: '-1', website: '/campus-card/?name=campusCard', serviceAppWebsite: null, webAppWebsite: '/campus-card-pc?name=campusCard', webApi: null, showTitle: 1, jumpIndexCode: null, schoolCityName: '杭州市', schoolCityCode: '330100', route: 'campusCard', myApp: null, flagIsLoginRequired: '0', flagIsSelfApp: '0', flagIsH5App: '0', flagIsWeChatMiniApp: '0', authMethods: '""', url: '{"name":"Web端","code":"pc","appIdRequired":0,"parentCode":null,"routingParameters":1,"children":[],"url":"/campus-card-pc?name=campusCard","route":"campusCard"}', supportSchedule: '0', zbaseAppTypeEntity: null, combinedAppList: null, combinedComponentList: null, combinedMenuList: null, bh: 176 }
              ],
              combinedComponentList: [],
              combinedMenuList: [],
              bh: 1809
            },
            { nodeType: 'component', parentNodeId: 6323, nodeId: 6331, nodeOrder: 9, nodeRelatedId: 1810, nodeConfig: '{"span":24}', name: '新闻通知', height: null, width: null, type: null, url: null, serviceAppWebsite: null, description: null, comCode: 'newsPc', jumpIndexCode: null, flag: '0000000000', componentOrder: null, zbaseAppEntity: null, appIconStyle: 'seachBar', nameEn: 'newsPc', combinedAppList: null, combinedComponentList: null, combinedMenuList: null, bh: 1810 }
          ],
          combinedMenuList: [
            {
              nodeType: null,
              parentNodeId: null,
              nodeId: null,
              nodeOrder: null,
              nodeRelatedId: null,
              nodeConfig: null,
              type: 'common',
              status: 1,
              name: '卡片管理',
              icon: '',
              iconPrefix: null,
              iconUrlPrefix: null,
              iconWhole: null,
              iconWholeList: null,
              websize: null,
              serviceAppWebsite: null,
              webAppWebsite: null,
              indexCode: '1072165311953764352',
              route: null,
              nameEn: 'card Manage',
              url: '{"name":"Web端","code":"pc","appIdRequired":0,"parentCode":"","routingParameters":1,"children":[]}',
              appId: null,
              combinedAppList: null,
              combinedComponentList: null,
              combinedMenuList: [
                { nodeType: null, parentNodeId: null, nodeId: null, nodeOrder: null, nodeRelatedId: null, nodeConfig: null, type: 'user', status: 1, name: '卡包', icon: '/images/plat/white/appView/card-bag.png', iconPrefix: null, iconUrlPrefix: null, iconWhole: null, iconWholeList: null, websize: null, serviceAppWebsite: null, webAppWebsite: '/campus-card-pc?name=campusCard', indexCode: '1072165520586833920', route: 'campusCard', nameEn: 'Card Bag', url: '{"name":"Web端","code":"pc","appIdRequired":0,"parentCode":null,"routingParameters":1,"children":[],"url":"/campus-card-pc?name=campusCard","route":"campusCard"}', appId: 176, combinedAppList: null, combinedComponentList: null, combinedMenuList: null, bh: 1509 },
                { nodeType: null, parentNodeId: null, nodeId: null, nodeOrder: null, nodeRelatedId: null, nodeConfig: null, type: 'user', status: 1, name: '银行卡', icon: '/images/plat/white/appView/yinhangka.png', iconPrefix: null, iconUrlPrefix: null, iconWhole: null, iconWholeList: null, websize: null, serviceAppWebsite: null, webAppWebsite: '/campus-card-pc/?name=bankCard', indexCode: '1072165520666525696', route: 'bankCard', nameEn: 'Bank Card', url: '{"name":"Web端","code":"pc","appIdRequired":0,"parentCode":null,"routingParameters":1,"children":[],"url":"/campus-card-pc/?name=bankCard","route":"bankCard"}', appId: 180, combinedAppList: null, combinedComponentList: null, combinedMenuList: null, bh: 1510 },
                { nodeType: null, parentNodeId: null, nodeId: null, nodeOrder: null, nodeRelatedId: null, nodeConfig: null, type: 'user', status: 1, name: '校园卡绑定', icon: '/images/plat/white/appView/bind-campus-card.png', iconPrefix: null, iconUrlPrefix: null, iconWhole: null, iconWholeList: null, websize: '/campus-card/?name=bindCampusCard', serviceAppWebsite: null, webAppWebsite: '/campus-card-pc/?name=addCampusCard', indexCode: '1072165520746217472', route: 'addCampusCard', nameEn: 'Bind Campus Card', url: '{"name":"Web端","code":"pc","appIdRequired":0,"parentCode":null,"routingParameters":1,"children":[],"url":"/campus-card-pc/?name=addCampusCard","route":"addCampusCard"}', appId: 169, combinedAppList: null, combinedComponentList: null, combinedMenuList: null, bh: 1511 },
                { nodeType: null, parentNodeId: null, nodeId: null, nodeOrder: null, nodeRelatedId: null, nodeConfig: null, type: 'user', status: 1, name: '银行卡绑定', icon: '/images/plat/white/appView/bind-bank-card.png', iconPrefix: null, iconUrlPrefix: null, iconWhole: null, iconWholeList: null, websize: '/campus-card/?name=addBankCard', serviceAppWebsite: null, webAppWebsite: '/campus-card-pc/?name=addBankCard', indexCode: '1072165520825909248', route: 'addBankCard', nameEn: 'Bind Bank Card', url: '{"name":"Web端","code":"pc","appIdRequired":0,"parentCode":null,"routingParameters":1,"children":[],"url":"/campus-card-pc/?name=addBankCard","route":"addBankCard"}', appId: 170, combinedAppList: null, combinedComponentList: null, combinedMenuList: null, bh: 1512 },
                { nodeType: null, parentNodeId: null, nodeId: null, nodeOrder: null, nodeRelatedId: null, nodeConfig: null, type: 'user', status: 1, name: '卡片充值', icon: '/images/plat/white/appView/card-recharge.png', iconPrefix: null, iconUrlPrefix: null, iconWhole: null, iconWholeList: null, websize: null, serviceAppWebsite: null, webAppWebsite: 'cardRecharge', indexCode: '1072165520901406720', route: '/campus-card-pc/?name=cardRecharge', nameEn: 'Card Recharge', url: '{"name":"Web端","code":"pc","appIdRequired":0,"parentCode":null,"routingParameters":1,"children":[],"route":"/campus-card-pc/?name=cardRecharge","url":"cardRecharge"}', appId: 200, combinedAppList: null, combinedComponentList: null, combinedMenuList: null, bh: 1513 }
              ],
              bh: 1508
            }
          ],
          bh: 1490
        },
        {
          nodeType: 'menu',
          parentNodeId: 0,
          nodeId: 6324,
          nodeOrder: 2,
          nodeRelatedId: 1382,
          nodeConfig: null,
          type: 'user',
          status: 1,
          name: '办事大厅',
          icon: '',
          iconPrefix: null,
          iconUrlPrefix: 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/white',
          iconWhole: null,
          iconWholeList: [],
          websize: null,
          serviceAppWebsite: null,
          webAppWebsite: '/plat-pc/businesslobby',
          indexCode: 'Businesslobby',
          route: 'Halls',
          nameEn: '办事大厅',
          url: '{"name":"Web端","code":"pc","appIdRequired":0,"parentCode":"","routingParameters":1,"children":[],"url":"/plat-pc/businesslobby","route":"Halls"}',
          appId: null,
          combinedAppList: [],
          combinedComponentList: [
            { nodeType: 'component', parentNodeId: 6324, nodeId: 6332, nodeOrder: 10, nodeRelatedId: 1814, nodeConfig: '{"span":24}', name: '广告组件', height: null, width: null, type: null, url: null, serviceAppWebsite: null, description: null, comCode: 'PCAdvert', jumpIndexCode: null, flag: '0000000000', componentOrder: null, zbaseAppEntity: null, appIconStyle: 'seachBar', nameEn: 'PCAdvert', combinedAppList: null, combinedComponentList: null, combinedMenuList: null, bh: 1814 },
            { nodeType: 'component', parentNodeId: 6324, nodeId: 6333, nodeOrder: 11, nodeRelatedId: 1807, nodeConfig: '{"span":24}', name: '资金往来', height: null, width: null, type: null, url: null, serviceAppWebsite: null, description: null, comCode: 'financialDealings', jumpIndexCode: null, flag: '0000000000', componentOrder: null, zbaseAppEntity: null, appIconStyle: 'appViewPC', nameEn: 'financialDealings', combinedAppList: null, combinedComponentList: null, combinedMenuList: null, bh: 1807 }
          ],
          combinedMenuList: [
            { nodeType: null, parentNodeId: null, nodeId: null, nodeOrder: null, nodeRelatedId: null, nodeConfig: null, type: 'user', status: 1, name: '搜索', icon: '/images/plat/white/appView/sousuo.png', iconPrefix: null, iconUrlPrefix: null, iconWhole: null, iconWholeList: null, websize: '/plat?name=search', serviceAppWebsite: null, webAppWebsite: '/plat-pc/search', indexCode: '1070370172688138240', route: 'Search', nameEn: 'Search', url: '{"name":"Web端","code":"pc","appIdRequired":0,"parentCode":null,"routingParameters":1,"children":[],"url":"/plat-pc/search","route":"Search"}', appId: 164, combinedAppList: null, combinedComponentList: null, combinedMenuList: null, bh: 1448 },
            { nodeType: null, parentNodeId: null, nodeId: null, nodeOrder: null, nodeRelatedId: null, nodeConfig: null, type: 'user', status: 1, name: '校园卡绑定', icon: '/images/plat/white/appView/bind-campus-card.png', iconPrefix: null, iconUrlPrefix: null, iconWhole: null, iconWholeList: null, websize: '/campus-card/?name=bindCampusCard', serviceAppWebsite: null, webAppWebsite: '/campus-card-pc/?name=addCampusCard', indexCode: '1070370172734275584', route: 'addCampusCard', nameEn: 'Bind Campus Card', url: '{"name":"Web端","code":"pc","appIdRequired":0,"parentCode":null,"routingParameters":1,"children":[],"url":"/campus-card-pc/?name=addCampusCard","route":"addCampusCard"}', appId: 169, combinedAppList: null, combinedComponentList: null, combinedMenuList: null, bh: 1449 },
            {
              nodeType: null,
              parentNodeId: null,
              nodeId: null,
              nodeOrder: null,
              nodeRelatedId: null,
              nodeConfig: null,
              type: 'user',
              status: 1,
              name: '日程',
              icon: '/images/plat/white/appView/richeng.png',
              iconPrefix: null,
              iconUrlPrefix: null,
              iconWhole: null,
              iconWholeList: null,
              websize: null,
              serviceAppWebsite: null,
              webAppWebsite: '/schedule-pc/schduleEntry',
              indexCode: '1070370172541337600',
              route: 'schedule',
              nameEn: 'Schedule',
              url: '{"name":"Web端","code":"pc","appIdRequired":0,"parentCode":null,"routingParameters":1,"children":[],"url":"/schedule-pc/schduleEntry","route":"schedule"}',
              appId: 163,
              combinedAppList: null,
              combinedComponentList: null,
              combinedMenuList: [
                { nodeType: null, parentNodeId: null, nodeId: null, nodeOrder: null, nodeRelatedId: null, nodeConfig: null, type: 'user', status: 1, name: '银行卡绑定', icon: '/images/plat/white/appView/bind-bank-card.png', iconPrefix: null, iconUrlPrefix: null, iconWhole: null, iconWholeList: null, websize: '/campus-card/?name=addBankCard', serviceAppWebsite: null, webAppWebsite: '/campus-card-pc/?name=addBankCard', indexCode: '1070371947948277760', route: 'addBankCard', nameEn: 'Bind Bank Card', url: '{"name":"Web端","code":"pc","appIdRequired":0,"parentCode":null,"routingParameters":1,"children":[],"url":"/campus-card-pc/?name=addBankCard","route":"addBankCard"}', appId: 170, combinedAppList: null, combinedComponentList: null, combinedMenuList: null, bh: 1451 },
                { nodeType: null, parentNodeId: null, nodeId: null, nodeOrder: null, nodeRelatedId: null, nodeConfig: null, type: 'user', status: 1, name: '校园卡绑定', icon: '/images/plat/white/appView/bind-campus-card.png', iconPrefix: null, iconUrlPrefix: null, iconWhole: null, iconWholeList: null, websize: '/campus-card/?name=bindCampusCard', serviceAppWebsite: null, webAppWebsite: '/campus-card-pc/?name=addCampusCard', indexCode: '1070371947998609408', route: 'addCampusCard', nameEn: 'Bind Campus Card', url: '{"name":"Web端","code":"pc","appIdRequired":0,"parentCode":null,"routingParameters":1,"children":[],"url":"/campus-card-pc/?name=addCampusCard","route":"addCampusCard"}', appId: 169, combinedAppList: null, combinedComponentList: null, combinedMenuList: null, bh: 1452 }
              ],
              bh: 1447
            }
          ],
          bh: 1382
        },
        { nodeType: 'menu', parentNodeId: 0, nodeId: 6325, nodeOrder: 3, nodeRelatedId: 1378, nodeConfig: null, type: 'user', status: 1, name: '新闻通知', icon: '', iconPrefix: null, iconUrlPrefix: 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/white', iconWhole: null, iconWholeList: [], websize: null, serviceAppWebsite: null, webAppWebsite: '/plat-pc/newsannouncement/main', indexCode: 'NewsAnnouncement', route: 'newsMain', nameEn: '新闻通知', url: '{"name":"Web端","code":"pc","appIdRequired":0,"parentCode":"","routingParameters":1,"children":[],"url":"/plat-pc/newsannouncement/main","route":"newsMain"}', appId: null, combinedAppList: [], combinedComponentList: [{ nodeType: 'component', parentNodeId: 6325, nodeId: 6334, nodeOrder: 12, nodeRelatedId: 1814, nodeConfig: '{"span":24}', name: '广告组件', height: null, width: null, type: null, url: null, serviceAppWebsite: null, description: null, comCode: 'PCAdvert', jumpIndexCode: null, flag: '0000000000', componentOrder: null, zbaseAppEntity: null, appIconStyle: 'seachBar', nameEn: 'PCAdvert', combinedAppList: null, combinedComponentList: null, combinedMenuList: null, bh: 1814 }], combinedMenuList: [], bh: 1378 },
        {
          nodeType: 'menu',
          parentNodeId: 0,
          nodeId: 6326,
          nodeOrder: 4,
          nodeRelatedId: 1488,
          nodeConfig: null,
          type: 'user',
          status: 1,
          name: '平台公告',
          icon: '',
          iconPrefix: null,
          iconUrlPrefix: 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/white',
          iconWhole: null,
          iconWholeList: [],
          websize: null,
          serviceAppWebsite: null,
          webAppWebsite: '/plat-pc/platformAnnouncement',
          indexCode: 'platformAnnouncement',
          route: 'platformAnnouncement',
          nameEn: '平台公告',
          url: '{"name":"Web端","code":"pc","appIdRequired":0,"parentCode":"","routingParameters":1,"children":[],"url":"/plat-pc/platformAnnouncement","route":"platformAnnouncement"}',
          appId: null,
          combinedAppList: null,
          combinedComponentList: null,
          combinedMenuList: [
            { nodeType: null, parentNodeId: null, nodeId: null, nodeOrder: null, nodeRelatedId: null, nodeConfig: null, type: 'user', status: 1, name: '账单', icon: '/images/plat/white/appView/bill.png', iconPrefix: null, iconUrlPrefix: null, iconWhole: null, iconWholeList: null, websize: '/campus-card/?name=billList', serviceAppWebsite: null, webAppWebsite: '/campus-card-pc/?name=billing', indexCode: '1072454593171947520', route: 'billing', nameEn: 'Bill', url: '{"name":"Web端","code":"pc","appIdRequired":0,"parentCode":null,"routingParameters":1,"children":[],"url":"/campus-card-pc/?name=billing","route":"billing"}', appId: 165, combinedAppList: null, combinedComponentList: null, combinedMenuList: null, bh: 1515 },
            { nodeType: null, parentNodeId: null, nodeId: null, nodeOrder: null, nodeRelatedId: null, nodeConfig: null, type: 'user', status: 1, name: '卡包', icon: '/images/plat/white/appView/card-bag.png', iconPrefix: null, iconUrlPrefix: null, iconWhole: null, iconWholeList: null, websize: null, serviceAppWebsite: null, webAppWebsite: '/campus-card-pc?name=campusCard', indexCode: '1072454593260027904', route: 'campusCard', nameEn: 'Card Bag', url: '{"name":"Web端","code":"pc","appIdRequired":0,"parentCode":null,"routingParameters":1,"children":[],"url":"/campus-card-pc?name=campusCard","route":"campusCard"}', appId: 176, combinedAppList: null, combinedComponentList: null, combinedMenuList: null, bh: 1516 },
            { nodeType: null, parentNodeId: null, nodeId: null, nodeOrder: null, nodeRelatedId: null, nodeConfig: null, type: 'user', status: 1, name: '银行卡', icon: '/images/plat/white/appView/yinhangka.png', iconPrefix: null, iconUrlPrefix: null, iconWhole: null, iconWholeList: null, websize: null, serviceAppWebsite: null, webAppWebsite: '/campus-card-pc/?name=bankCard', indexCode: '1072454593327136768', route: 'bankCard', nameEn: 'Bank Card', url: '{"name":"Web端","code":"pc","appIdRequired":0,"parentCode":null,"routingParameters":1,"children":[],"url":"/campus-card-pc/?name=bankCard","route":"bankCard"}', appId: 180, combinedAppList: null, combinedComponentList: null, combinedMenuList: null, bh: 1517 }
          ],
          bh: 1488
        },
        { nodeType: 'menu', parentNodeId: 0, nodeId: 6327, nodeOrder: 5, nodeRelatedId: 1489, nodeConfig: null, type: 'user', status: 1, name: '开放平台', icon: '', iconPrefix: null, iconUrlPrefix: 'http://192.168.3.229:8050/minio/theme/2453773bd06d0b16ff7842ea3d11e158/images/plat/white', iconWhole: null, iconWholeList: [], websize: null, serviceAppWebsite: null, webAppWebsite: '/plat-pc/openPlatform', indexCode: 'openplatform', route: 'openPlatMain', nameEn: '开放平台', url: '{"name":"Web端","code":"pc","appIdRequired":0,"parentCode":"","routingParameters":1,"children":[],"url":"/plat-pc/openPlatform","route":"openPlatMain"}', appId: null, combinedAppList: null, combinedComponentList: null, combinedMenuList: null, bh: 1489 }
      ]
    }
  },
  msg: '操作成功'
}
// result.value = {
//   yesList: [
//     {
//       bh: 803,
//       appCode: 'merchant-center'
//     },
//     {
//       bh: 802,
//       appCode: 'billMercacc'
//     }
//   ],
//   notList: []
// }
// typeValue.value = 'base'
const yeslist: any = ref([])
const notList: any = ref([])
if (result.value) {
  if (typeValue.value === 'base') {
    result.value.yesList.map((o: any) => {
      let icon: any = {}
      if (o.icon) {
        icon = JSON.parse(o.icon)
        Object.keys(icon).forEach((key) => {
          if (icon[key] && !o.masterImg) {
            o.masterImg = icon[key]
          }
        })
      } else {
        o.masterImg = ''
      }
      return o
    })
    result.value.notList.map((o: any) => {
      let icon: any = {}
      if (o.icon) {
        icon = JSON.parse(o.icon)
        Object.keys(icon).forEach((key) => {
          if (icon[key] && !o.masterImg) {
            o.masterImg = icon[key]
          }
        })
      } else {
        o.masterImg = ''
      }
      return o
    })
    // const applist = computed({
    //   get: () => store.state.addApplist,
    //   set: (val) => {
    //     store.state.addApplist = val;
    //   }
    // });
    // result.value.yesList.forEach((item: any) => {
    //   const obj = applist.value.find((o: any) => {
    //     return o.appCode === item.appCode;
    //   });
    //   yeslist.value.push(obj);
    // });
    // result.value.notList.forEach((item: any) => {
    //   // const code = Object.keys(item)[0];
    //   const obj = applist.value.find((item: any) => {
    //     return item.appCode === item.appCode;
    //   });
    //   obj.errmsg = item.message;
    //   notList.value.push(obj);
    // });
  }
  yeslist.value = result.value.yesList
  notList.value = result.value.notList
}
const limitError = ref([])
const getLimitErr = (appCodeArr: any) => {
  limitError.value = appCodeArr
  console.log('finshed--------------------', appCodeArr)
}
defineExpose({
  getLimitErr
})
</script>
<style lang="scss" scoped>
.appResult {
  h3 {
    img {
      width: 70px;
      transform: translateY(23px);
    }
  }
}
.applist-result {
  width: 420px;
  margin: 0 auto;
  margin-top: 30px;
  background-color: #f7f5f5;
  border-radius: 6px;
  padding: 30px 20px 30px 50px;

  li {
    width: 130px;
    display: inline-block;
    margin-right: 30px;
    p {
      margin-top: 10px;
    }
  }
}
.img {
  width: 60px;
  height: 60px;
}
.app-one {
  .img {
    width: 80px;
    height: 80px;
  }
  .successFilled svg {
    width: 80px;
    height: 80px;
    color: #67c23a;
  }
}
</style>
