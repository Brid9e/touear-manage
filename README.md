# micro-manage

基于微前端框架`qiankun`的微前端管理平台,

## 安装

```bash
# 安装主应用和所有子应用的依赖
yarn install
```

## 开始

```bash
yarn start
```

## 打包

```bash
# 打包主应用和所有子应用
yarn build
# 打包单个子应用，例如打包platform
yarn build:platform
```

## 子应用配置

1. 在`api.config.ts`中添加新的子应用配置，例如：

```ts
export const microAppList = [
  ...,
  {
    name: '消息管理',
    code: 'manage-message',
  },
  {
    name: 'xxx管理',
    code: 'manage-xxx',
  },
]
```

2. 在`micro`文件夹下复制子应用示例，文件名改为自己的子应用名，与上面`[新增子应用名称]`保持一致，在子应用目录下**全局搜索**`[__NAME__]`，直接替换为`[新增子应用名称]`

3. 修改复制后的子应用的`vite.config.ts`中的端口，可查看`microPort.ts`来确定端口号

```ts
server: {
  ...
  port: 0000,
  ...
}
```

4. 在最外层的package.json中添加新增子应用的start、install、build

5. 执行命令

```bash
yarn install:[新增子应用名称]
yarn start
```
