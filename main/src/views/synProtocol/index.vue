<script lang='ts' setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getProtocol } from '@/service/manage'
import axios from 'axios';
import { renderAsync } from 'docx-preview'
import { useStore } from 'vuex';
import { key } from '@/store';

const route = useRoute()
const store = useStore(key)
const { state } = store

const protocolContents = ref({
  content: ''
})
const loading = ref(false)
const childRef = ref()

async function getProtocols() {
  loading.value = true
  await axios
    .get(`${state?.configs?.base || window.location.origin}/minio/other/protocol/${route.params?.code}.docx`, {
      responseType: 'arraybuffer'
    })
    .then((res: any) => {
      renderAsync(res.data, childRef.value)
    })
    .catch(err => {
      console.log(err)
    })
  loading.value = false
}

onMounted(() => {
  getProtocols()
})

</script>
<template lang='pug'>
.synjones-protocol(ref="childRef")
</template>
<style lang='scss' scoped>
:deep(.docx-wrapper) {
  background: transparent;
  padding: 5rem 0 5rem 0!important;
  .docx {
    padding: 0!important;
    box-shadow: none;
    background-color: transparent;
  }
}
</style>