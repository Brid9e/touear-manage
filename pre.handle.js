const os = require('os')
const fs = require('fs')
const path = require('path')
const prettier = require('prettier')
const { exec } = require('child_process')

/**
 * 本地IP
 */
let localIP = ''

/**
 *
 * 禁止一些文件的变化被git跟踪到
 *
 */
exec('bash disable_track.sh', (error, stdout, stderr) => {
  console.log('✅ disable_track.sh is ok!')
})

/**
 *
 * @date 2024-01-18 09:02:51
 * @author Joe
 * @description 项目启动时，获取用户本地的ip地址，并修改'./main/.env.development'中的[VITE_APP_LOCAL_IP]配置
 *
 */
const getAndRewriteIp = () => {
  // 获取网络接口列表
  const networkInterfaces = os.networkInterfaces()
  for (let interfaceInfo of Object.values(networkInterfaces)) {
    for (const info of interfaceInfo) {
      if (info.family === 'IPv4' && !info.internal && info.mac !== '00:00:00:00:00:00') {
        const myAddress = info.address
        if (myAddress.includes('192.168')) {
          localIP = myAddress
          return
        }
        localIP = myAddress
        /**
         * 弃用修改环境变量的方式
         * @deprecated
         */
        // const filePath = './main/.env.development'
        // const text = fs.readFileSync(filePath, 'utf-8')
        // // 使用正则表达式替换IP地址
        // let newFileContent = text.replace(
        //   /(VITE_APP_LOCAL_IP=\s*')(.*?)(?=')/,
        //   `$1${myAddress}`,
        // )
        // fs.writeFile(filePath, newFileContent, (err) => {
        //   if (err) {
        //     console.error('重写文件内容时发生错误：', err)
        //   } else {
        //     console.log(`[🌐-IP]: '${myAddress}'\n[📂-路径]: '${filePath}'`)
        //   }
        // })
      }
    }
  }
}

/**
 *
 * @date 2024-01-19 14:46:54
 * @author Joe
 * @description 自动获取微应用的端口号
 *
 */
const getAppsPort = async () => {
  const folderPath = './micro/' // 替换为你的文件夹路径
  const targetFileName = 'vite.config.ts' // 替换为你的目标文件名

  // 读取文件夹中的文件列表
  const files = fs.readdirSync(folderPath)

  // 存储提取的数据的对象
  const extractedData = {}

  // 遍历文件列表
  files.forEach((file) => {
    // 拼接文件完整路径
    const filePath = path.join(folderPath, file) + '/' + targetFileName
    let fileContent = ''
    try {
      // 读取文件内容
      fileContent = fs.readFileSync(filePath, 'utf-8')
    } catch {}
    // 使用正则表达式提取微应用名称
    const qiankunMatch = fileContent.match(/qiankun\(['"]([^'"]+)['"]/)
    // 使用正则表达式提取微应用端口号
    const portMatch = fileContent.match(/server:\s*{\s*port:\s*(\d+)/)
    if (qiankunMatch) {
      const variableName = qiankunMatch[1]
      if (portMatch) {
        const portNumber = parseInt(portMatch[1]) // 将端口号转为数字
        extractedData[variableName] = portNumber
      }
    }
  })
  // fs.createWriteStream('./extractedData.ts', { flags: 'w' })
  const fileName = './microPort.ts'
  let fileContent = 'export const portMap = ' + JSON.stringify(extractedData)
  fileContent = await prettier.format(fileContent, {
    parser: 'babel',
    singleQuote: true,
    semi: false,
  })
  console.log()
  fs.writeFile(fileName, fileContent, (err) => {
    if (err) {
      console.error(`Error creating file: ${err.message}`)
    }
  })
}

const initAddressTs = () => {
  const filename = 'address.ts'
  const content = `const baseURL = 'http://10.9.13.70:60001'\nconst localIP = '${localIP}'\n\nexport { baseURL, localIP }`

  // 检查文件是否存在
  fs.access(filename, fs.constants.F_OK, (err) => {
    if (err) {
      // 文件不存在，创建文件
      fs.writeFile(filename, content, (err) => {
        if (err) {
          console.error('创建文件失败:', err)
        } else {
          console.log('✅ address.ts is ok!')
        }
      })
    }
  })
}

// 执行
getAndRewriteIp()
getAppsPort()
initAddressTs()
