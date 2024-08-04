let initCatch: any = {}
try {
  initCatch = JSON.parse(localStorage.initCatch || '{}')
} catch {}

// Nacos的配置项
let nacosConfigs: any = {
  nacos: {
    Host地址: {
      type: 'ip',
      key: 'host',
      value: {
        ip: initCatch?.nacos?.host || '',
        port: initCatch?.nacos?.port || 8848,
      },
    },
  },
  middleware: {
    redis: {
      Ip地址: {
        type: 'ip',
        key: 'ip',
        value: {
          ip: initCatch?.middleware?.redis?.ip || '',
          port: initCatch?.middleware?.redis?.port || 6379,
        },
      },
      密码: {
        type: 'input_password',
        key: 'password',
        value: initCatch?.middleware?.redis?.password || 'syntong',
      },
      数据库: {
        type: 'input',
        key: 'database',
        value: initCatch?.middleware?.redis?.database || 0,
      },
    },
    mq: {
      Ip地址: {
        type: 'ip',
        key: 'ip',
        value: {
          ip: initCatch?.middleware?.mq?.ip || '',
          port: initCatch?.middleware?.mq?.port || 5672,
        },
      },
      账号: {
        type: 'input',
        key: 'username',
        value: initCatch?.middleware?.mq?.username || 'admin',
      },
      密码: {
        type: 'input_password',
        key: 'password',
        value: initCatch?.middleware?.mq?.password || 'syntong',
      },
    },
    es: {
      Ip地址: {
        type: 'ip',
        key: 'ip',
        value: {
          ip: initCatch?.middleware?.es?.ip || '',
          port: initCatch?.middleware?.es?.port || 9200,
        },
      },
    },
    minio: {
      Ip地址: {
        type: 'ip',
        key: 'ip',
        value: {
          ip: initCatch?.middleware?.minio?.endpoint?.split(':')[0] || '',
          port: initCatch?.middleware?.minio?.endpoint?.split(':')[1] || 9000,
        },
      },
      // endpoint: 'http://192?.168?.3?.235:9000',
      账号: {
        type: 'input',
        key: 'access-key',
        value: initCatch?.middleware?.minio?.['access-key'] || 'admin',
      },
      密钥: {
        type: 'input_password',
        key: 'secret-key',
        value: initCatch?.middleware?.minio?.['secret-key'] || '123123123',
      },
    },
  },
  db: {
    base: {
      数据库类型: {
        key: 'dbtype',
        type: 'select',
        value: initCatch?.db?.base?.dbtype || 'jdbc:oracle:thin:@',
      }, // 数据库类型
      Ip地址: {
        type: 'ip',
        key: 'ip',
        value: {
          ip: initCatch?.db?.base?.ip || '',
          port: initCatch?.db?.base?.port || 1521,
        },
      }, // 1521-Oracle 3364-Mysql
      SID: {
        type: 'input',
        key: 'sid',
        value: initCatch?.db?.base?.sid || '',
      }, // SID
      账号: {
        type: 'input',
        key: 'username',
        value: initCatch?.db?.base?.username || '',
      },
      密码: {
        type: 'input_password',
        key: 'password',
        value: initCatch?.db?.base?.password || '',
      },
    },
    school: {
      数据库类型: {
        key: 'dbtype',
        type: 'select',
        value: initCatch?.db?.school?.dbtype || 'jdbc:oracle:thin:@',
      },
      Ip地址: {
        type: 'ip',
        key: 'ip',
        value: {
          ip: initCatch?.db?.school?.ip || '',
          port: initCatch?.db?.school?.port || 1521,
        },
      },
      SID: {
        type: 'input',
        key: 'sid',
        value: initCatch?.db?.school?.sid || '',
      },
      账号: {
        type: 'input',
        key: 'username',
        value: initCatch?.db?.school?.username || '',
      },
      密码: {
        type: 'input_password',
        key: 'password',
        value: initCatch?.db?.school?.password || '',
      },
    },
    ykt: {
      数据库类型: {
        key: 'dbtype',
        type: 'select',
        value: initCatch?.db?.ykt?.dbtype || 'jdbc:oracle:thin:@',
      },
      Ip地址: {
        type: 'ip',
        key: 'ip',
        value: {
          ip: initCatch?.db?.ykt?.ip || '',
          port: 1521,
        },
      },
      SID: {
        type: 'input',
        key: 'sid',
        value: initCatch?.db?.ykt?.sid || '',
      },
      账号: {
        type: 'input',
        key: 'username',
        value: initCatch?.db?.ykt?.username || '',
      },
      密码: {
        type: 'input_password',
        key: 'password',
        value: initCatch?.db?.ykt?.password || '',
      },
    },
  },
  sios: {
    Ip地址: {
      type: 'ip',
      key: 'ip',
      value: {
        ip: initCatch?.sios?.siosIp || '',
        port: initCatch?.sios?.siosPort || 8500,
      },
    },
    系统Code: {
      type: 'input',
      key: 'sysCode',
      value: initCatch?.sios?.sysCode || '',
    },
    终端编号: {
      type: 'input',
      key: 'terminalNo',
      value: initCatch?.sios?.terminalNo || '',
    },
  },
  address: {
    协议类型: {
      type: 'radio',
      key: 'agreement',
      value: initCatch?.address?.agreement || 'http://',
    },
    Nginx: {
      type: 'input',
      key: 'domain',
      value: initCatch?.address?.domain || window.location.host || '',
    },
  },
  third: {
    tsm: {
      TsmUrl: {
        type: 'input',
        key: 'tsmUrl',
        value: initCatch?.tsm?.tsmUrl || '',
      },
    },
    paymentplat: {
      PaymentUrl: {
        type: 'input',
        key: 'paymentplatUrl',
        value: initCatch?.paymentplat?.paymentplatUrl || '',
      },
      学校代码: {
        type: 'input',
        key: 'schoolcode',
        value: initCatch?.paymentplat?.schoolcode || '110000000001',
      },
    },
  },
}
// tsm url
// 支付平台2.0接口地址 url、 学校代码：110000000001

const config = localStorage.configsManage
  ? JSON.parse(localStorage.configsManage)
  : {}

let baseConfigs: any = {}

for (let key in config) {
  baseConfigs[key.toUpperCase()] = {
    type: 'input',
    key: key,
    value: config[key],
  }
}

export { nacosConfigs, baseConfigs }
