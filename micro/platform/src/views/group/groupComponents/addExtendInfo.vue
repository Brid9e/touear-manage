<template lang="pug">
.addExtendInfo
  el-dialog(title="设置人员信息" v-model="show" @closed="closed" :width="400" :height="500")
    //- el-tabs(v-model="editableTabsValue" type="card" @edit="handleTabsEdit" v-loading="loading")
    //-   el-tab-pane()
    el-form(:model="extendInfoList" label-width="62px" v-for="(item, index) in extendInfoList" :label="item.title" :name="item.name" :key="item.name")
      el-form-item(label="性别")
        el-checkbox-group(v-model="extendInfoList[index].sex")
          el-checkbox(v-for="item in sexList" :label="item.code" :key="item.code + 'sex'" ) {{ item.name }}
      el-form-item(label="校区")
        el-select.display-block(v-model="extendInfoList[index].campus" multiple placeholder="请选择" clearable)
          el-option(v-for="item in campusList" :label="item.name" :value="item.code"  :key="item.code + 'campus'" )
      el-form-item(label="身份")
        el-select.display-block(v-model="extendInfoList[index].identity" multiple placeholder="请选择" clearable)
          el-option(v-for="item in identityList" :label="item.name" :value="item.code"  :key="item.code + 'identity'" )
      el-form-item(label="部门")
        el-select.display-block(v-model="extendInfoList[index].department" multiple placeholder="请选择" clearable)
          el-option(v-for="item in basedepartmentList" :label="item.name" :value="item.code" :key="item.code + 'base'" )
            span(style="float: left") {{ item.name }}
            span(v-if="item.type == '1'" style="float: right; margin-right: 10px; opacity: 0.5") 学院
    template(#footer)
      el-button(type='primary' @click="saveExtendInfo") 确认
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Group, identityInfo } from '@/service/platform/index'
import { ElMessage } from 'element-plus'

export default defineComponent({
  props: {
    showExtendInfo: {
      type: Boolean,
      default: false
    },
    identityList: {
      type: Array,
      default: null
    } as any,
    id: {
      type: String,
      default: null
    },
    campusList: {
      type: Array,
      default: null
    } as any
  },
  data() {
    return {
      show: false,
      listIndex: 0,
      // tabIndex: 2,
      editableTabsValue: '1',
      editableTabsNum: 1,
      extendInfoList: [] as any,
      loading: true,
      basedepartmentList: [] as any,
      sexList: [
        {
          name: '男',
          code: '1'
        },
        {
          name: '女',
          code: '2'
        }
      ]
    }
  },
  watch: {
    showExtendInfo(val) {
      this.show = val
      // if (val === true) {
      //   this.getAccount()
      // }
    },
    show(val) {
      if (val === true) {
        this.getBasedepartment()
        this.getExtendInfo()
      } else {
        this.editableTabsValue = '1'
      }
    },
    // campusList(val) {
    //   console.log(val)
    // },
    extendInfoList: {
      handler(val) {
        if (val.length === 0) {
          ;(this as any).extendInfoList.push({
            title: `第${(this as any).listIndex + 1}组`,
            name: `${(this as any).listIndex + 1}`,
            sex: [],
            campus: [],
            identity: [],
            department: [],
            type: 'group',
            resourceId: this.id,
            listIndex: this.listIndex
          })
          this.listIndex += 1
        }
      },
      immediate: true
    }

    // editableTabsValue(val) {
    //   // console.log(val)
    // }
  },
  methods: {
    // /berserker-base/basedepartment
    async getBasedepartment() {
      const { data: res, code } = await identityInfo.getBasedepartmentList()
      if (code === 200) {
        this.basedepartmentList = res
        this.loading = false
      }
    },
    // /berserker-base/extendInfo/listAfterConvertedExtendInfo
    async getExtendInfo() {
      const params = {
        resourceId: this.id,
        type: 'group'
      }
      const { data: res, code } = await Group.getListAfterConvertedExtendInfo(params)
      if (code === 200) {
        const extendList = res
        for (const data of extendList) {
          data.title = `第${data.listIndex + 1}组`
          data.name = `${data.listIndex + 1}`
        }
        this.extendInfoList = extendList
        this.listIndex = res.length
      }
    },
    // /berserker-base/extendInfo/saveExtendInfo
    async saveExtendInfo() {
      let pushArr: any = []
      for (let data of (this as any).extendInfoList) {
        let pushObj: any = null
        pushObj.campus = data.campus
        pushObj.sex = data.sex
        pushObj.identity = data.identity
        pushObj.department = data.department
        if (JSON.stringify(data.campus) === '[]' && JSON.stringify(data.sex) === '[]' && JSON.stringify(data.identity) === '[]' && JSON.stringify(data.department) === '[]') {
          ElMessage.warning('至少填写一项')
          return
        }
        pushArr.push(pushObj)
      }
      for (let i of pushArr) {
        if (!i.pushObj) {
          console.log('有未填写的内容')
          return
        }
      }
      const params: any = {
        // resourceId: String(this.$route.params.id),
        removeResource: false,
        resourceMap: {},
        // resourceMap: {
        //   key: String(this.$route.params.id),
        //   value: JSON.stringify(pushArr)
        // },
        type: 'group'
      }
      params.resourceMap[String(this.$route.params.id)] = { ...pushArr[0] }
      console.log(params)
      const { code, msg } = await Group.saveExtendInfo(params, 'messageBox')
      if (code === 200) {
        ElMessage.success(msg)
        this.$emit('update-extend')
        this.closed()
      }
    },
    // 增加标签
    handleTabsEdit(targetName: any, action: any) {
      if (action === 'add') {
        // let newTabName = ++this.tabIndex + ''
        ;(this as any).extendInfoList.push({
          title: `第${this.listIndex + 1}组`,
          name: `${this.listIndex + 1}`,
          sex: [],
          campus: [],
          identity: [],
          department: [],
          type: 'group',
          resourceId: this.id,
          listIndex: this.listIndex
        })
        this.listIndex += 1
      }
      if (action === 'remove') {
        let tabs = this.extendInfoList
        let activeName = this.editableTabsValue
        if (activeName === targetName) {
          tabs.forEach((tab: any, index: any) => {
            if (tab.name === targetName) {
              let nextTab: any = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }
        this.extendInfoList = tabs.filter((tab: any) => tab.name !== targetName)
        this.listIndex -= 1
        this.editableTabsValue = String(this.listIndex)
        for (let i = 1; i < this.listIndex + 1; i++) {
          ;(this as any).extendInfoList[i - 1].title = `第${i}组`
          ;(this as any).extendInfoList[i - 1].name = `${i}`
        }
      }
    },
    closed() {
      this.$emit('update:showExtendInfo', false)
    }
  }
})
</script>

<style lang="scss" scope>
.addExtendInfo {
  .display-block {
    display: block;
  }

  .group-input-box .el-button {
    width: 100%;
  }

  .flexCenter {
    float: right;
  }
}
</style>
