import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
const bread = (obj: any): void => {
  const route = {
    name: obj.meta.title,
    path: obj.path,
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
