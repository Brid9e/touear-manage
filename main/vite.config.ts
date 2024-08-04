/*
 * @Author: Joe
 * @Date: 2022-10-09 14:44:24
 * @LastEditors: Joe
 * @LastEditTime: 2022-11-26 19:46:15
 * @FilePath: /management-micro/main/vite.config.ts
 * @Description:
 *
 * Copyright (c) 2022 by Brid9e wangdongqiao1997@163.com, All Rights Reserved.
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from 'vite-plugin-html'
import { resolve } from 'path'
import { loadEnv } from 'vite'
import dayjs from 'dayjs'

const nowDate: string = dayjs().format('YYYY/MM/DD HH:mm:ss')

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  console.log(command)
  let config = {
    plugins: [
      vue(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            version: `0.0.${process.env.v || 1}`,
            date: nowDate,
            title: 'Touear Admin',
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
    base: mode == 'development' ? 'http://localhost:7100/' : '/manage/',
    build: {
      outDir: '.././dist/manage',
    },
    server: {
      port: 7100,
      // host: true,
      headers: {
        'Access-Control-Allow-Origin': '*', // 主应用获取子应用时跨域响应头
      },
      open: true,
      host: '0.0.0.0',
    },
    define: {
      'process.env': env,
    },
  }
  return config
})
