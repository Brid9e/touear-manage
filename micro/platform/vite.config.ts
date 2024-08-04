/*
 * @Author: Joe
 * @Date: 2022-10-09 16:02:14
 * @LastEditors: Joe
 * @LastEditTime: 2022-11-26 20:35:27
 * @FilePath: /management-micro/micro/platform/vite.config.ts
 * @Description:
 *
 * Copyright (c) 2022 by Brid9e wangdongqiao1997@163.com, All Rights Reserved.
 */

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'
import { resolve } from 'path'
import { loadEnv } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import dayjs from 'dayjs'

const nowDate: string = dayjs().format('YYYY/MM/DD HH:mm:ss')

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  let config = {
    plugins: [
      vue(),
      qiankun('manage-platform', { useDevMode: true }),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            version: `saas.${process.env.v || 'fix'}`,
            date: nowDate,
            title: '📱 移动服务管理端',
          },
        },
      }),
    
    ],
    resolve: {
      //设置路径别名
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    base: mode == 'development' ? './' : '/manage-platform',
    build: {
      outDir: '../../dist/manage-platform',
    },
    server: {
      port: 7200,
      headers: {
        'Access-Control-Allow-Origin': '*', // 主应用获取子应用时跨域响应头
      },
      host: '0.0.0.0',
    },
    define: {
      'process.env': env,
    },
  }
  return config
})
