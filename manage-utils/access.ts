/**
 *
 * @param {any} obj 对象
 * @param {string} path 路径
 * @returns {any} 返回结果
 */
function access(obj: any, path: any) {
  return path
    .split('.')
    .reduce((acc: any, key: string) => (acc ? acc[key] : undefined), obj)
}

export default access
