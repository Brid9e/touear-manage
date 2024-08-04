/*
* array-树形数据
* targetId-目标id
* valueKey-用来判断的字段名
* childrenKey-子元素字段名
**/
export const findPatentValue = (array: any, targetId: any, valueKey: any, childrenKey: any) => {
    if (!targetId || !Array.isArray(array)) return []
    const result: any = []
    let valid = false
    const seek = (_array: any, _targetId: any) => {
        let parentValue = ''
        const up = (_array_: any, _targetId_: any, lastValue?: any) => {
            _array_.forEach((v : any) => {
              const val = v[valueKey]
              const child = v[childrenKey]
              if (val === _targetId_) {
                  valid = true
                  parentValue = lastValue
                  return
              }
              child?.length && up(child, _targetId_, val)
            })
        }
        up(_array, _targetId)
        if (parentValue) {
            result.unshift(parentValue)
            seek(_array, parentValue)
        }
    }
    seek(array, targetId)
    return valid ? [...result, targetId] : []
}

export const traverseTree = (node: any, callback: any) => {
  // 递归遍历树，并对每个节点执行回调函数
  if (!node) return; // 如果节点不存在，则返回
  const children = node.children || []; // 获取当前节点的子节点
  // 执行回调函数，修改当前节点的值
  callback(node);
  // 递归遍历子节点
  children.forEach((child: any) => traverseTree(child, callback));
}