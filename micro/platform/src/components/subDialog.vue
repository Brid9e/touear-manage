<template lang="pug">
//- div 666
//- div(v-if='', ref='dialogMain')
el-dialog(v-model='show', :width='`${width}px`', ref='dialogMain', :center='center', :title='title', :modal='true', :close-on-click-modal='closeOnModal', :show-close='showClose', :close-on-press-escape='closeOnPress', @open='openDialog', :custom-class='`sub-dialog ${customClass}`', @close='closeDialog', :before-close='beforeClose', @closed='closed')
  template(#title='', v-if='!title')
    slot(name='title', v-if='destoryed')
  slot.body(v-if='destoryed')
  template(#footer='')
    slot(name='footer', v-if='destoryed')
</template>
<script lang="ts">
import { defineComponent, ref, watch, onMounted, onUnmounted, getCurrentInstance, onBeforeUnmount } from 'vue'
import { nextTick } from 'vue'
export default defineComponent({
  name: 'subDialog',
  props: {
    modelValue: Boolean,
    width: {
      type: Number,
      required: true
    },
    center: {
      type: Boolean,
      required: false
    },
    customClass: {
      type: String,
      required: false
    },
    title: {
      type: String,
      required: false
    },
    beforeClose: {
      type: Function,
      required: false
    },
    closeOnModal: {
      type: Boolean,
      required: false,
      default: true
    },
    showClose: {
      type: Boolean,
      required: false,
      default: true
    },
    closeOnPress: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  emits: ['update:modelValue', 'closed'],
  setup(props, context) {
    const instance = getCurrentInstance()
    // const W = ref(props.width)
    const H = ref(0)
    const show = ref(false)
    const parentWindowSize = ref()
    const bodyMixHeight = ref('300px')
    const isReady = ref(false)
    const dialogMain = ref()
    const showOver = ref(false)
    const color = ref('red')
    const destoryed = ref(false)

    const dialogPosition = async () => {
      // const top = 20 + 'px'
      const domList: any = document.querySelectorAll<HTMLElement>('.sub-dialog')
      // const domList: any = document.getElementsByClassName('sub-dialog')
      const domBodyList: any = document.querySelectorAll<HTMLElement>('.el-dialog__body')
      await nextTick()
      for (let domBody of domBodyList) {
        domBody.style.maxHeight = document.body.clientHeight - 244 + 'px'
      }
      let parentW, parentH, wHeight
      parentW = parentWindowSize.value.W
      parentH = parentWindowSize.value.H
      wHeight = parentWindowSize.value.iframeHeight
      const wWidth = document.body.clientWidth
      for (let dom of domList) {
        const leftMeau = parentW - wWidth - 40
        const top = '20px'
        const left = parentW / 2 - dom.offsetWidth / 2 - leftMeau - 20 + 'px'
        dom.style.top = top
        dom.style.left = left
        // console.log(top, left)
      }
    }
    const openDialog = async () => {
      // await dialogPosition()
    }

    const closeDialog = () => {
      context.emit('update:modelValue', false)
    }

    const closed = () => {
      destoryed.value = false
    }

    watch(
      () => props.modelValue,
      (newValue, oldValue) => {
        show.value = newValue
        if (newValue) {
          destoryed.value = newValue
          context.emit('update:modelValue', true)
          window.parent.postMessage(
            {
              dialogOpen: true
            },
            '*'
          )
        } else {
          window.parent.postMessage({ dialogClose: true }, '*')
          context.emit('update:modelValue', false)
          context.emit('closed', false)
        }
      }
    )

    watch(parentWindowSize, (r: any) => {
      if (r) {
        dialogPosition()
      }
    })

    onMounted(() => {
      window.addEventListener('message', function (e) {
        if (e.data.parentWindowSize) {
          parentWindowSize.value = e.data.parentWindowSize
          if (e.data.windowResize) dialogPosition()
        }
        if (e.data.toCloseDialog) {
          show.value = false
          context.emit('update:modelValue', false)
          context.emit('closed', false)
        }
      })
    })
    return {
      openDialog,
      closeDialog,
      closed,
      show,
      showOver,
      bodyMixHeight,
      dialogMain,
      color,
      destoryed
    }
  }
})
</script>
<style lang="scss">
// .sub-dialog {
//   margin: 0;
//   top: 50%;
//   transform: translateY(-50%);
//   margin-top: -61px !important;
//   .el-dialog__body {
//     max-height: v-bind(bodyMixHeight);
//     box-sizing: border-box;
//     overflow-y: auto;
//   }
// }
.sub-dialog {
  margin: 0;
  margin-top: 0 !important;

  .el-dialog__body {
    // max-height: v-bind(bodyMixHeight);
    box-sizing: border-box;
    overflow-y: auto;
  }
}
</style>
