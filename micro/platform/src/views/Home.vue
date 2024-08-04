<template lang="pug">
div.home
  el-table(:data='tableData')
    el-table-column(prop='date' label='日期' width='140')
    el-table-column(prop='name' label='姓名' width='120')
    el-table-column(prop='address' label='地址')

  HelloWorld(msg="Welcome to Your Vue.js + TypeScript App")
  el-button(@click="test") 888
  el-tree(:data='data' :props='defaultProps')
</template>

<script lang="ts">
// import { ElMessage } from 'element-plus'
import { defineComponent } from 'vue'
import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src

export default defineComponent({
  components: {
    HelloWorld
  },
  data() {
    return {
      data: [
        {
          label: '一级 1',
          children: [
            {
              label: '二级 1-1',
              children: [
                {
                  label: '三级 1-1-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 2',
          children: [
            {
              label: '二级 2-1',
              children: [
                {
                  label: '三级 2-1-1'
                }
              ]
            },
            {
              label: '二级 2-2',
              children: [
                {
                  label: '三级 2-2-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 3',
          children: [
            {
              label: '二级 3-1',
              children: [
                {
                  label: '三级 3-1-1'
                }
              ]
            },
            {
              label: '二级 3-2',
              children: [
                {
                  label: '三级 3-2-1'
                }
              ]
            }
          ]
        }
      ],
      tableData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  }
})
</script>
