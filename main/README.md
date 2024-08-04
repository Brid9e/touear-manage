# 微前端子应用添加流程

1. 在``main/src/layout/main/index.vue``中添加新项目的各项配置，具体如下：
   ```pug
      <!-- template -->
      ...
      #micro-app-[新增子应用名称](v-show="$route?.name == 'manage-[新增子应用名称]'")
   ```
   ```ts
      <!-- script -->

      // 页面loading
      const loading: any = ref({
        ...
        'manage-[新增子应用名称]': true,
      })

      // 子应用ip配置
      const entryObj: any = reactive({
        ...
        'manage-[新增子应用名称]': `//${localIp || '127.0.0.1'}:[新添加项目中vite.config.ts中的端口配置，一般是加100，请查看前一个的子应用端口进行配置]`,
      })

      // 预加载
      prefetchApps([
        ...
        { name: "manage-[新增子应用名称]", entry: process.env.NODE_ENV == "development" ? entryObj["manage-[新增子应用名称]"] : state.configs.base }
      ])
   ```

2. 在路由文件中配置子应用的路由``main/src/router/index.ts``
    ```ts
      {
        path: 'manage-[新增子应用名称]/:pathMatch(.*)',
        component: MicroView,
        name: 'manage-[新增子应用名称]',
        meta: {
          title: 'XX管理',
          requireAuth: true,
          isMicroApp: true,
          microAppContainer: 'micro-app-[新增子应用名称]'
        }
      }
    ```
    
3. 在``micro``文件夹下复制子应用示例，文件名改为自己的子应用名，与上面[新增子应用名称]保持一致，在子应用目录下全局搜索[__NAME__]，直接替换为[新增子应用名称]
   
4. 修改复制后的子应用的vite.config.ts中的端口
    ```ts
      server: {
        ...
        port: xxxx,
        ...
      }
    ```
5. 在最外层的package.json中添加新增子应用的start、install、build

6. 执行命令
    ```bash
      yarn install:[新增子应用名称]
      yarn start
    ```

