<!--
 * @Author       : your name
 * @Date         : 2022-04-24 16:37:48
 * @LastEditTime : 2022-07-07 14:58:42
 * @LastEditors  : Joe
 * @FilePath     : /management/src/apps/platform/views/systemConfig/configComponents/addPop.vue
-->
<template lang="pug">
#addPop
  pre {{(prop.data)}}
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
export default defineComponent({
  props: ['data'],
  setup(prop) {
    //
    const options = reactive([
      {
        label: 'Map格式',
        value: 'Map'
      },
      {
        label: 'List格式',
        value: 'List'
      },
      {
        label: 'List<Map>格式',
        value: 'List'
      }
    ])
    return {
      options,
      value: ref(''),
      prop
    }
  }
})
</script>

<style lang="scss" scoped>
#addPop {
  width: 500px;
}
</style>
