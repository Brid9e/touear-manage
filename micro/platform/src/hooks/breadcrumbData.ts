/*
 * @Author: your name
 * @Date: 2022-02-23 13:57:23
 * @LastEditTime: 2022-04-08 10:37:47
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /management/src/hooks/breadcrumbData.ts
 */
import { key } from '@/store'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore(key)
const bread = (obj: any): void => {
  // console.log('objsss', obj.href.split('/')[1] + obj.path)
  console.log(store)
  // sessionStorage.defaultActiveMeau = `iframe_${obj.href.split('/')[1] + obj.path}`
  const route = {
    name: obj.meta.title,
    path: obj.path,
    index: obj.path,
    url: window.location.href
  }
  window.parent.postMessage(
    {
      childPageChangeRoute: route
    },
    '*'
  )
}
const routeChange = (): void => {
  onMounted(() => {
    const router = useRouter()
    window.addEventListener('message', function (e) {
      if (e.data.routeChange) {
        router.push({
          path: e.data.routeChange
        })
      }
    })
  })
}
export { bread, routeChange }
