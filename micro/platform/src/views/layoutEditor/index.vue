<template lang='pug'>
#LayoutEditor
  iframe.iframe(ref="iframeRef" :src="$route.query.url")
</template>
<script lang='ts' setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useFullscreen } from '@vueuse/core'

const iframeRef: any = ref<HTMLElement | null>(null)

const { /* isFullscreen, enter, exit,  */toggle } = useFullscreen(iframeRef)

function receiveMessage(event: any) {
  if (event.data.type === 'fullscreen') toggle()
}

onMounted(() => {
  window.addEventListener('message', receiveMessage, false)
})

onUnmounted(() => {
  window.removeEventListener('message', receiveMessage)
})

</script>
<style lang='scss' scoped>
#LayoutEditor {
  width: 100%;
  height: 100%;

  .iframe {
    width: 100%;
    height: calc(100vh - 7.5rem - .3125rem - 2rem);
    outline: none;
    box-sizing: border-box;
    border-color: hsla(0, 0%, 0%, 0.05);
    border-width: 1px;
    border-radius: 8px;

    // border: 1px sloid black!important;
    // box-sizing: border-box;
  }

  .open-full {
    position: absolute;
    top: 0.5rem;
    right: 1.25rem;
  }
}
</style>