export const wechatMp = [
  {
    type: 'byGroup',
    field: 'wechat-mp',
    title: '微信公众号',
    groupFormJson: [
      {
        platType: '',
        type: 'input',
        field: 'name',
        title: '名称',
        value: '微信公众号',
        info: '',
        display: true
      },
      {
        platType: '',
        type: 'input',
        field: 'appid',
        title: 'App Id',
        value: '',
        info: '',
        display: true
      },
      {
        platType: '',
        type: 'input',
        field: 'secret',
        title: '密钥',
        value: '',
        info: '',
        display: true
      }
    ]
  }
]

export const wechatMina = [
  {
    type: 'byGroup',
    field: 'wechat-mina',
    title: '微信小程序',
    groupFormJson: [
      {
        type: 'byGroup',
        field: 0,
        title: '商户小程序',
        groupFormJson: [
          {
            platType: '',
            type: 'input',
            field: 'name',
            title: '名称',
            value: '商户小程序',
            info: '',
            display: true
          },
          {
            platType: '',
            type: 'input',
            field: 'appid',
            title: 'App Id',
            value: '',
            info: '',
            display: true
          },
          {
            platType: '',
            type: 'input',
            field: 'secret',
            title: '密钥',
            value: '',
            info: '',
            display: true
          }
        ]
      },
      {
        type: 'byGroup',
        field: 1,
        title: '用户小程序',
        groupFormJson: [
          {
            platType: '',
            type: 'input',
            field: 'name',
            title: '名称',
            value: '用户小程序',
            info: '',
            display: true
          },
          {
            platType: '',
            type: 'input',
            field: 'appid',
            title: 'App Id',
            value: '',
            info: '',
            display: true
          },
          {
            platType: '',
            type: 'input',
            field: 'secret',
            title: '密钥',
            value: '',
            info: '',
            display: true
          }
        ]
      }
    ]
  }
]

export const wechatWork = [
  {
    type: 'byGroup',
    field: 'wechat-work',
    title: '企业微信',
    groupFormJson: [
      {
        platType: '',
        type: 'input',
        field: 'name',
        title: '名称',
        value: '企业微信',
        info: '',
        display: true
      },
      {
        platType: '',
        type: 'input',
        field: 'corpid',
        title: 'Corp Id',
        value: '',
        info: '',
        display: true
      },
      {
        platType: '',
        type: 'input',
        field: 'agentid',
        title: 'Agent Id',
        value: '',
        info: '',
        display: true
      },
      {
        platType: '',
        type: 'input',
        field: 'corpsecret',
        title: 'Corp Secret',
        value: '',
        info: '',
        display: true
      },
      {
        platType: '',
        type: 'input',
        field: 'logintype',
        title: '登录类型',
        value: '',
        info: '',
        display: true
      }
    ]
  }
]

export const alipayLife = [
  {
    type: 'byGroup',
    field: 'alipay-life',
    title: '支付宝生活号',
    groupFormJson: [
      {
        platType: '',
        type: 'input',
        field: 'name',
        title: '名称',
        info: '',
        value: '支付宝生活号',
        display: true
      },
      {
        platType: '',
        type: 'input',
        field: 'appid',
        title: 'App Id',
        value: '',
        info: '',
        display: true
      },
      {
        platType: '',
        type: 'input',
        field: 'appPrivateKey',
        title: '生活号应用私钥',
        value: '',
        info: '',
        display: true
      },
      {
        platType: '',
        type: 'input',
        field: 'alipayPublicKey',
        title: '生活号公钥',
        value: '',
        info: '',
        display: true
      }
    ]
  }
]

export const alipayApp = [
  {
    type: 'byGroup',
    field: 'alipay-app',
    title: '支付宝第三方APP',
    groupFormJson: [
      {
        platType: '',
        type: 'input',
        field: 'name',
        title: '名称',
        info: '',
        value: '支付宝第三方APP',
        display: true
      },
      {
        platType: '',
        type: 'input',
        field: 'appid',
        title: 'App Id',
        value: '',
        info: '',
        display: true
      },
      {
        platType: '',
        type: 'input',
        field: 'appPrivateKey',
        title: 'APP应用私钥',
        value: '',
        info: '',
        display: true
      },
      {
        platType: '',
        type: 'input',
        field: 'alipayPublicKey',
        title: 'APP公钥',
        value: '',
        info: '',
        display: true
      }
    ]
  }
]

export const ecardType = [
  {
    type: 'byGroup',
    field: 'ecard_type',
    title: '一卡通账户类型是否合并',
    groupFormJson: [
      {
        platType: '',
        type: 'radio',
        field: 'type',
        title: '显示方式',
        value: '0',
        info: '',
        effect: {
          fetch: ''
        },
        options: [
          {
            value: '0',
            label: '正常显示'
          },
          {
            value: '1',
            label: '电子账户为主'
          },
          {
            value: '2',
            label: '卡账户为主'
          }
        ]
      },
      {
        platType: '',
        type: 'switch',
        field: 'openFlag',
        title: '需要开通',
        value: '1',
        activeValue: '1',
        inactiveValue: '0',
        info: ''
      },
      {
        platType: '',
        type: 'switch',
        field: 'showVC',
        title: '显示虚拟卡',
        value: '1',
        activeValue: '1',
        inactiveValue: '0',
        info: ''
      },
      {
        platType: '',
        type: 'switch',
        field: 'showSno',
        title: '卡账户显示学号',
        info: '',
        value: '1',
        activeValue: '1',
        inactiveValue: '0'
      }
    ]
  }
]

export const ecardFrontConfig = [
  {
    type: 'byGroup',
    field: 'ecard_front_config',
    title: '一卡通前端配置',
    groupFormJson: [
      {
        platType: '',
        type: 'switch',
        field: 'offlineCode',
        title: '开启脱机码',
        info: '',
        value: '1',
        activeValue: '1',
        inactiveValue: '0',
        display: true
      }
    ]
  }
]

export const yktApiConfig = [
  {
    type: 'byGroup',
    field: 'yktApiConfig',
    title: '一卡通接口配置',
    groupFormJson: [
      {
        platType: '',
        type: 'radio',
        field: 'type',
        title: '类型',
        info: '',
        value: 'tsm',
        display: true,
        effect: {
          fetch: ''
        },
        options: [
          {
            value: 'tsm',
            label: '一卡通'
          },
          {
            value: 'payment',
            label: '支付平台'
          }
        ]
      }
    ]
  }
]
