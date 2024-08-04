## 本地工具库的使用

---

### 安装

```bash
# 在微应用中使用安装
yarn add link:../../manage-utils -D
```

### 使用

```ts
// 例如 使用压缩图片
import { compress } from 'manage-utils'
```

### 工具目录

- compress 压缩图片

```ts
/**
 *
 * @param {File} file 文件
 * @param {number} quality 压缩质量阈值，数值越小压缩越大，默认为0.7
 *
 */
compress(file, 0.5)
  .then((res: File) => {
    // 这里是你的逻辑
  })
  .catch((err: any) => {
    console.log(err)
  })
```

- access 获取对象的值

```ts
// 例如
const foo = {
  bar: {
    baz: {
      val: 42,
    },
  },
}

/**
 *
 * @param {any} obj 对象
 * @param {string} path 路径
 *
 */
const result = access(foo, 'bar.baz.val')

console.log(result) // 输出：42
```
