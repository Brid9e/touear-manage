<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import { useSessionStorage } from '@vueuse/core'
import { Tenant } from '@/service/manage'
import { Loading, Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { some, isEmpty } from 'lodash'

// const { state } = useStore(key)
const tenantInfo: any = useSessionStorage('tenantInfo', {})
const authPath: any = useSessionStorage('authPath', '')

const treeProps = {
  value: 'tenantId',
  label: 'tenantName',
}

const tenId = computed(() => authPath.value?.split('-')?.[1])

const tenantList: any = ref([])
const timer = ref()
const exValue = ref('')
const exTreeRef = ref()

const onClickTenant = async (item: any) => {
  if (some(tenantList.value, 'loading')) {
    ElMessage.warning('有租户页正在打开，请稍后再试')
    return
  }
  if (item.active) {
    ElMessage.warning('租户页正在使用')
    return
  }
  if (item.loading) {
    ElMessage.warning('租户页打开中...')
    return
  }
  item.loading = true
  await changeTenant(item)
}

/**
 * 切换租户
 * @param item
 */
async function changeTenant(item: any) {
  const params = {
    tenantId: item.tenantId,
  }
  const {
    data: res,
    code,
    msg,
  }: any = await Tenant.getTenantToken(params).catch(() => {
    item.loading = false
  })
  if (code === 200) {
    tenantInfo.value[item.tenantId] = {
      ...item,
      token: `${res.token_type} ${res.user_access_token}`,
    }
  }
  setTimeout(() => {
    const tenantPage = `${window.location.origin}/manage/ten-${item.tenantId}/`
    window.open(tenantPage, '_blank');
    item.loading = false
    item.active = true
  }, 100);
}

/**
 * 获取租户列表
 */
async function tenantExList() {
  const { data: res, code, msg }: any = await Tenant.getTenantExList()
  // tenantList.value = test
  if (code === 200) {
    tenantList.value = res
  }
}

/**
 * 更新租户页状态
 * @param id
 * @param type
 */
function changeTenantPage(id: any, type: any) {
  for (let i = 0; i < tenantList.value.length; i++) {
    const item = tenantList.value[i]
    if (item.tenantId === id) {
      item.active = !(type === 'close')
    }
  }
}

/**
 * 输入框输入
 * @param query
 */
function onInput(query: string) {
  exTreeRef.value?.filter(query)
}

/**
 * 搜索方法
 * @param query
 * @param node
 */
function filterMethod(query: string, node: any) {
  return node.tenantName?.includes(query)
}

onMounted(async () => {
  await tenantExList()
  changeTenantPage(tenId.value, 'open')
  window.addEventListener('message', function(event) {
    // 检查消息来源
    if (event.origin !== window.location.origin) return
    const res = event.data
    const tenantId = res.tenantId
    changeTenantPage(tenantId, res.type)
  })
})
</script>

<template lang="pug">
.ex-change
  .ex-input
    .title.el-popover__title 切换租户
    el-input(v-model="exValue" placeholder="请输入关键字查询" size="small" @input="onInput")
  el-tree-v2(ref="exTreeRef" v-if="!isEmpty(tenantList)" :height="240" :data="tenantList" :props="treeProps" :item-size="34" :filter-method="filterMethod")
    template(#default="{ node, data }")
      .tenant-item(@click="onClickTenant(data)")
        span {{ data.tenantName }}
        el-badge(v-if="!data.loading" is-dot :type="data.active ? 'success' : 'info'")
        el-icon(v-else class="is-loading")
          Refresh
  //- .tenant-item(v-for="item in tenantList" :key="item.id" @click="onClickTenant(item)")
  el-empty(v-else description="暂无可切换租户" :image-size="100")
</template>

<style lang="scss" scoped>
.ex-change {

  :deep(.el-icon.el-tree-node__expand-icon) {
    display: none;
  }

  .tenant-item {
    cursor: pointer;
    box-sizing: border-box;
    width: 100%;
    height: 34px;
    display: flex;
    align-items: center;
    padding: 0 var(--el-popover-padding) !important;
    justify-content: space-between;
    border-radius: var(--el-border-radius-base);


    .el-badge {
      display: flex;
    }


    &:hover {
      background-color: var(--el-fill-color-light);
    }
  }

  .ex-input {
    display: flex;
    align-items: center;
    padding: 0 var(--el-popover-padding) 0 0;
    margin-bottom: .5rem;

    .title {
      white-space: nowrap;
      margin-bottom: 0;
      margin-right: .5rem
    }
  }
}
</style>