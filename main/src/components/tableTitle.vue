<template lang="pug">
#TableTitle
  .title-box
    .title-adorn
    h3.toc-title(:id="title" :style="`font-size:${handleSize(size)}px`") {{ title || "" }}
      slot(name='info')
    slot(name='form')
  .button-group
    slot
</template>
<script lang="ts" setup>
const props = defineProps({
  title: String,
  size: String
})

const handleSize = (size: string) => {
  let _size
  switch (size) {
    case 'large':
      _size = 24
      break
    default:
      _size = 18.72
      break
  }
  return _size
}
</script>
<style lang="scss" scoped>
#TableTitle {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  align-items: flex-end;

  .title-font {
    font-size: 18px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .title-box {
    display: flex;
    align-items: center;
    flex-shrink: 0;

    &>* {
      flex-shrink: 0;
      margin-right: 20px;
    }
  }
}
</style>
