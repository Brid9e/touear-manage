/*
 * @Author: Joe
 * @Date: 2022-11-27 13:06:59
 * @LastEditors: Joe
 * @LastEditTime: 2022-11-27 13:12:27
 * @FilePath: /management-micro/micro/platform/src/public-path.ts
 * @Description: 
 * 
 * Copyright (c) 2022 by Brid9e wangdongqiao1997@163.com, All Rights Reserved. 
 */
const __WINDOW: any = window
if (__WINDOW.__POWERED_BY_QIANKUN__) {
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = __WINDOW.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}