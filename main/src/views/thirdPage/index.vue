<template lang='pug'>
#third-page
  iframe.iframe(:src="url")
</template>
<script lang='ts' setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { key } from '@/store';
import { template } from 'lodash';

const route: any = useRoute()
const store = useStore(key)
const { state } = store

const url = computed(() => {
  const templateUrl = template(route.query.url)
  return templateUrl({
    token: state.token?.split(' ')?.[1],
    token_type: state.token?.split(' ')?.[0],
  })
})

</script>
<style lang='scss' scoped>
#third-page {
  width: 100%;
  height: 100%;

  .iframe {
    width: 100%;
    height: calc(100vh - 7.5rem - 2rem);
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