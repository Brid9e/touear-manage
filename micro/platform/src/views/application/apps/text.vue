<template lang="pug">
div
  p 111
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
interface stepObj {
  name: string
  arrtext: number[]
}
const arrtextaaa: number[] = [0, 1, 2, 3, 4]
export default defineComponent({
  name: 'add',
  setup() {
    const step: stepObj = reactive({
      name: 'haha',
      arrtext: arrtextaaa
    })
    console.log(step.arrtext[0])
    const refStep = toRefs(step)
    return {
      ...refStep
    }
  }
})
</script>
