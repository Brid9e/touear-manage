<!--
 * @Author: your name
 * @Date: 2021-12-23 14:26:21
 * @LastEditTime: 2022-10-13 16:13:13
 * @LastEditors: Joe
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /management_micro/main/src/views/menuEdit/index.vue
-->
<template lang="pug">
#MenuEdits
  .tree-box
    tableTitle(title="菜单管理")
      el-button.edit-button(type='primary', @click='showDlalog = true', :icon="iconArrVal['Plus']" :disabled="!state.funcButton.systemMenuAdd") 添加
    el-table(v-loading='loading', :data='treeData', row-key='id', lazy, :tree-props='{ children: "children", hasChildren: "hasChildren" }')
      el-table-column(prop='label', label='菜单名称')
        template(#default='scope')
          //- el-badge.item(is-dot,:type='scope.row.editData.status === 1 ? "primary" : "danger"',style='margin: 0 1rem')
          span {{ scope.row.label }}
      el-table-column(prop='menuCode', label='菜单标识')

      el-table-column(label='地址')
        template(#default='scope')
          span.menu-icon(:style="scope.row.path ? 'color:black;' : 'color:#969799;'") {{ scope.row.path || '暂无' }}
      el-table-column(label='图标', align='center', width='80')
        template(#default='scope')
          el-icon.menu-icon(v-if="scope.row.editData.icon" :size="18" style="cursor: pointer;" @click="showIconList = true; showIcon= true; iconRowData = scope.row")
            component(:is="iconArrVal[scope.row.editData.icon]")
          span.menu-icon(v-else  @click="showIconList = true; showIcon= true; iconRowData = scope.row" :style="scope.row.editData.icon ? 'color:black;cursor: pointer;' : 'color:#969799;cursor: pointer;'") 暂无
      el-table-column(label="切换状态" align="center" width="100")
        template(#default="scope")
          el-switch(:before-change="beforeChange" v-model="scope.row.editData.status" :disabled="!state.funcButton.systemMenuEdit" :active-value='1' :inactive-value='0' @change="changeSwitch(scope.row.editData)")
      el-table-column(label='操作', width='230')
        template(#default='scope')
          el-button(
            link,
            type='primary',
            @click='moreDialog(scope.row)',
          ) 查看
          el-button(
            v-if='scope.row.editStatus == true',
            link,
            type='primary',
            @click='showEdit(scope.row)',
            :disabled="!state.funcButton.systemMenuEdit"
          ) 编辑
          el-button(
            v-if='scope.row.editStatus == true',
            type='danger',
            link,
            @click='deletes(scope.row)',
            :disabled="!state.funcButton.systemMenuRemove"
          ) 删除
          el-button(
            v-if='scope.row.editStatus == true',
            :disabled='!!scope.row.children || !state.funcButton.systemMenuFuncButton',
            link,
            @click='buttonEdit(scope.row)',
          ) 功能按钮
  el-dialog(v-model='showEditDialog', title='编辑', @closed='clearForm' destroy-on-close)
    el-form(
      label-width='80px',
      :model='editDataForm.editData',
      ref='ruleForm__',
      :rules='rules'
    )
      el-form-item(label='上级菜单')
        el-tree-select(
          clearable
          v-model='editDataForm.editData._pId',
          :data='treeData',
          check-strictly,
          node-key="menuId"
          :render-after-expand="false"
          placeholder="默认为一级菜单"
        )
      el-form-item(label='平台类型', prop='platType')
        el-select(v-model='editDataForm.editData.platType', placeholder='请选择平台类型')
          el-option(v-for="item in platTypeList" :key="item.code" :label="item.name" :value="item.code")
      el-form-item(label='菜单标识', prop='menuCode')
        el-input(v-model='editDataForm.editData.menuCode')
      el-form-item(label='菜单名称', prop='menuName')
        el-input(v-model='editDataForm.editData.menuName')
      el-form-item(label='菜单类型', prop='identityType')
        el-checkbox-group(v-model="editDataForm.editData.identityType")
          el-checkbox(label="system" value="system") 管理端
          el-checkbox(label="tenant" value="tenant") 租户端
      el-form-item(label='页面地址')
        el-input.input-with-select(
          placeholder='请输入内容',
          v-model='editDataForm.editData.path'
        )
          template(#prepend)
            el-select(
              v-model='editDataForm.editData.scheme',
              slot='prepend',
              placeholder='请选择',
              style='width: 100px'
            )
              el-option(label='内置组件', value='/')
              //- el-option(label='当前窗口', value='iframe_')
              //- el-option(label="多媒体管理" value="http://192.168.3.190:9092/")
              el-option(label='http://', value='http://')
              el-option(label='https://', value='https://')
          template(#append, v-if='editDataForm.editData.scheme == "http://" || editDataForm.editData.scheme == "https://"' )
            el-select(
              v-model='editDataForm.editData.target',
              slot='prepend',
              placeholder='请选择',
              style='width: 120px'
            )
              el-option(label='管理端打开', value='_self')
              //- el-option(label="多媒体管理" value="http://192.168.3.190:9092/")
              el-option(label='新窗口打开', value='_blank')
      el-form-item(label='排序')
        el-input-number(
          v-model='editDataForm.editData.priority',
        )
      el-form-item(label='状态')
        el-switch(
          v-model='editDataForm.editData.status',
          :active-value='1',
          :inactive-value='0'
        )
      el-form-item(label='描述')
        el-input(
          v-model='editDataForm.editData.menuDesc',
          type='textarea'
        )
    template(#footer)
      el-button(@click='showEditDialog = false') 取消
      el-button(type='primary', @click='update(editDataForm, editDataForm.editData, "null")') 保存
  el-dialog(v-model='showButtonDialog', title='功能按钮', @closed='clearForm', destroy-on-close)
    el-form
      .text-right
        el-form-item
          el-button(type='primary', @click='addAction = true') 添加功能按钮
    el-table(:data='actionList')
      el-table-column(prop='actionName', label='功能名称')
      el-table-column(prop='actionCode', label='功能编码')
      el-table-column(label='操作', width='120')
        template(#default='scope')
          el-button(
            link,
            type='primary',
            @click='editButton(scope.row)') 编辑
          el-button(
            link,
            type='danger',
            @click='deleteButton(scope.row)') 删除

  el-dialog(v-model='showButtonEdit', title='编辑')
    el-form(label-width='80px', :model='buttonDataForm.deep', :rules='rules', ref='ruleForm_')
      el-form-item(label='功能标识', prop='actionCode')
        el-input(v-model='buttonDataForm.deep.actionCode')
        span.font-atte 菜单标识+自定义标识.默认后缀：View、Edit
      el-form-item(label='功能名称', prop='actionName')
        el-input(v-model='buttonDataForm.deep.actionName')
      el-form-item(label='排序')
        el-input-number(v-model='buttonDataForm.deep.priority',)
      el-form-item(label='状态')
        el-switch(v-model='buttonDataForm.deep.status', :active-value='1', :inactive-value='0')
      el-form-item(label='描述')
        el-input(v-model='buttonDataForm.deep.actionDesc', type='textarea' )
    template(#footer)
      el-button(type='primary', @click='subEditButton(buttonDataForm)') 确定

  el-dialog(v-model='showDlalog', title='添加', @closed='clearForm', destroy-on-close)
    el-form(
      label-width='80px',
      ref='ruleForm',
      :model='addParams',
      :rules='rules'
    )
      el-form-item(label='上级菜单')
        el-tree-select(
          clearable,
          v-model='addParams.parentId',
          :data='treeData',
          check-strictly,
          :render-after-expand="false"
          placeholder="默认为一级菜单"
        )
      el-form-item(label='平台类型', prop='platType')
        el-select(v-model='addParams.platType', placeholder='请选择平台类型')
          el-option(v-for="item in platTypeList" :key="item.code" :label="item.name" :value="item.code")
      el-form-item(label='菜单标识', prop='menuCode')
        el-input(v-model='addParams.menuCode')
      el-form-item(label='菜单名称', prop='menuName')
        el-input(v-model='addParams.menuName')
      el-form-item(label='菜单类型', prop='identityType')
        el-checkbox-group(v-model="addParams.identityType")
          el-checkbox(label="system" value="system") 管理端
          el-checkbox(label="tenant" value="tenant") 租户端
      el-form-item(label='页面地址')
        el-input.input-with-select(
          placeholder='请输入内容',
          v-model='addParams.path'
        )
          template(#prepend)
            el-select(v-model='addParams.scheme', slot='prepend', placeholder='请选择', style='width: 100px')
              el-option(label='内置组件', value='/')
              //- el-option(label='当前窗口', value='iframe_')
              el-option(label='http://', value='http://')
              el-option(label='https://', value='https://')
          template(#append, v-if='addParams.scheme == "http://" || addParams.scheme == "https://"')
            el-select(v-model='addParams.target', slot='prepend', placeholder='请选择', style='width: 120px', icon='el-icon-edit')
              el-option(label='管理端打开', value='_self')
              //- el-option(label="多媒体管理" value="http://192.168.3.190:9092/")
              el-option(label='新窗口打开', value='_blank')
      el-form-item(label='图标')
        el-popover(placement="right-start" :width="500" trigger="hover")
          template(#reference)
            //- i(v-if="addParams.icon" :class='addParams.icon' style="cursor: pointer;")
            el-icon(v-if="addParams.icon" :size="18" color="#ccc" style="cursor: pointer;width:28px;height:32px;" )
              component(:is="iconArrVal[addParams.icon]")
            span.menu-icon(v-else :style="addParams.icon ? 'color:black;' : 'cursor: pointer;'") 暂无
          el-scrollbar
            .icon-list
              .icon-item.menu-icon(@click="addParams.icon = ''") 无
              .icon-item(v-for="item in iconArrVal" :key="item" @click="addParams.icon = item.name" )
                el-icon.menu-icon(v-if="item" :size="18" style="cursor: pointer;")
                  component(:is="item")
                //- .empty-icon.menu-icon(v-else) 无
      el-form-item(label='排序')
        el-input-number(
          v-model='addParams.priority',
        )
      el-form-item(label='状态')
        el-switch(
          v-model='addParams.status',
          :active-value='1',
          :inactive-value='0'
        )
      //- el-form-item(label="菜单类型")
        el-radio(v-model="addParams.applicationType" :label="1") 内部菜单
        el-radio(v-model="addParams.applicationType" :label="2") 外部菜单
      el-form-item(label='描述')
        el-input(v-model='addParams.menuDesc', type='textarea')
    template(#footer)
      el-button(@click='showDlalog = false') 取消
      el-button(type='primary', @click='add') 添加

  el-dialog(v-model='addAction', title='添加')
    el-form(label-width='80px', :model='actionForm', :rules='rules', ref='ruleForm___')
      el-form-item(label='功能标识', prop='actionCode')
        el-input(v-model='actionForm.actionCode')
        span.font-atte 菜单标识+自定义标识.默认后缀：View、Edit
      el-form-item(label='功能名称', prop='actionName')
        el-input(v-model='actionForm.actionName')
      el-form-item(label='排序')
        el-input-number( v-model='actionForm.priority')
      el-form-item(label='状态')
        el-switch(v-model='actionForm.status', :active-value='1', :inactive-value='0')
      el-form-item(label='描述')
        el-input(v-model='actionForm.actionDesc', type='textarea')
    template(#footer)
      el-button(@click='addAction = false') 取消
      el-button(type='primary', @click='addEditButton') 添加

  el-drawer(:title="moreData?.label" v-model="more")
    el-descriptions(title="基本信息" :column="2")
      el-descriptions-item(label='编号') {{ moreData.id }}
      el-descriptions-item(label='菜单标识') {{ moreData.menuCode }}
      el-descriptions-item(label='描述') {{ moreData.menuDesc }}
      el-descriptions-item(label='创建时间') {{ moreData.createTime }}
      el-descriptions-item(label='更新时间') {{ moreData.updateTime }}

  el-dialog(v-model="showIconList" @closed="showIconList = false" :width="600" )
    el-scrollbar
      .icon-list(v-if="showIcon")
        //- .empty-icon.icon-item(style="color: #909090;" @click="changeIcon(item.name, iconRowData.editData)") 无
        .icon-item.menu-icon(@click="iconRowData.editData.icon = '', changeIcon('', iconRowData.editData)") 无
        .icon-item(v-for="item in iconArrVal" :key="item" @click="iconRowData.editData.icon = item.name, changeIcon(item.name, iconRowData.editData)" )
          el-icon.menu-icon(v-if="item" :size="18" style="cursor: pointer;")
            component(:is="item")
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, ref, computed, nextTick } from 'vue'
import { MenuEdits } from '@/service/manage/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import tableTitle from '@/components/tableTitle.vue'
// import { iconArr } from '@/assets/scripts/icon'
import * as ElementIcons from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import _, { cloneDeep, isEmpty, orderBy, pullAllWith } from 'lodash'

const platTypeList: any = ref([])
const treeData: any = ref([])
const menuData: any = ref([])
const ruleForm: any = ref(null)
const ruleForm__: any = ref(null)
const ruleForm_: any = ref(null)
const ruleForm___: any = ref(null)
const showIcon: any = ref(false)
const loading: any = ref(false)
const showDlalog: any = ref(false)
const showDlalogButton: any = ref(false)
const iconArrVal: any = computed(() => ElementIcons)
const actionList: any = ref([])
const addAction: any = ref(false)
const menuId: any = ref(null)
const more: any = ref(false)
const moreData: any = ref({})
const showEditDialog = ref(false)
const showButtonDialog = ref(false)
const showButtonEdit = ref(false)
const iconRowData = ref({})
const showIconList = ref(false)
const actionForm: any = ref({
  actionCode: '',
  actionDesc: '',
  actionName: '',
  menuId: null,
  priority: 0,
  status: '1'
})
const addParams: any = ref({
  applicationType: null,
  icon: '',
  menuCode: '',
  menuDesc: '',
  menuId: '',
  menuName: '',
  parentId: null,
  path: '',
  priority: 0,
  scheme: '/',
  status: 1,
  target: '_self',
  platType: 'platform',
  identityType: []
})
const editDataForm: any = ref({})
const buttonDataForm: any = ref({})
const clearForm = () => {
  addParams.value = {
    applicationType: null,
    icon: '',
    menuCode: '',
    menuDesc: '',
    menuId: '',
    menuName: '',
    parentId: null,
    path: '',
    priority: 0,
    scheme: '/',
    status: 1,
    target: '_self',
    platType: '',
    identityType: []
  }
  actionForm.value = {
    actionCode: '',
    actionDesc: '',
    actionName: '',
    menuId: null,
    priority: 0,
    status: '1'
  }
  editDataForm.value.disabled = false
  editDataForm.value = {}
  buttonDataForm.value = { deep: {} }
  showEditDialog.value = false
  showButtonDialog.value = false
}

const store = useStore(key)
const { state } = store

// 获取功能菜单的功能按钮列表
const getButtonAction = async (menuId?: number) => {
  const params = {
    menuId: menuId
  }
  const { data: res, code }: any = await MenuEdits.menuAction(params)
  if (code === 200) {
    for (let i of res) {
      i.deep = cloneDeep(i)
    }
    actionList.value = res
    console.log('actionList.value', actionList.value)
  }
}

// 菜单有改动时，更改store中menuChanged的状态，下次进入之前会重新获取菜单信息，并存入localStorage中
const menuChanged = () => {
  store.commit('updateMenu', true)
  const data = JSON.parse(sessionStorage.menuData)
  data.isChange = true
  sessionStorage.menuData = JSON.stringify(data)
}

// 添加功能按钮
const addEditButton = () => {
  ruleForm___.value.validate(async (vaild: any) => {
    if (vaild) {
      const params = actionForm.value
      params.menuId = menuId.value
      const { msg, code }: any = await MenuEdits.actionAdd(params, 'messageBox')
      if (code === 200) {
        getButtonAction(menuId.value)
        addAction.value = false
        ElMessage.success(msg)
      }
    }
  })
}

// 更新功能按钮
const subEditButton = (data: any) => {
  ruleForm_.value.validate(async (vaild: any) => {
    //
    if (vaild) {
      const params = {
        actionCode: data.deep.actionCode,
        actionDesc: data.deep.actionDesc,
        actionId: data.deep.actionId,
        actionName: data.deep.actionName,
        menuId: data.deep.menuId,
        priority: data.deep.priority,
        status: data.deep.status
      }
      // params.isPersist = 0
      const { msg, code }: any = await MenuEdits.actionUpdate(params, 'messageBox')
      if (code === 200) {
        ElMessage.success(msg)
        getButtonAction(data.menuId)
        data.showEdit = false
        showButtonEdit.value = false
      }
    }
  })
}

// 功能按钮编辑
const buttonEdit = (data: any) => {
  // buttonDataForm.value = data
  showButtonDialog.value = true
  menuId.value = data.menuId
  actionForm.value.actionCode = data.menuCode
  getButtonAction(data.menuId)
}
//  显示功能按钮编辑窗口
const editButton = (data: any) => {
  // data.showEdit = true
  buttonDataForm.value = data
  showButtonEdit.value = true
}

//删除功能按钮
const deleteButton = (data: any) => {
  ElMessageBox.confirm('你确定要删除此功能按钮吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(async () => {
      const params = {
        actionId: data.actionId
      }
      const { code, msg }: any = await MenuEdits.actionRemove(params, 'messageBox')
      if (code === 200) {
        getButtonAction(data.menuId)
        ElMessage.success(msg)
      }
    })
    .catch(() => {
      return
    })
}

const rules: any = ref({
  menuCode: [
    {
      required: true,
      message: '请输入菜单标识',
      trigger: 'blur'
    }
  ],
  menuName: [
    {
      required: true,
      message: '请输入菜单名称',
      trigger: 'blur'
    }
  ],
  actionCode: [
    {
      required: true,
      message: '请输入功能标识',
      trigger: 'blur'
    }
  ],
  actionName: [
    {
      required: true,
      message: '请输入功能名称',
      trigger: 'blur'
    }
  ]
})

const afterEnter = () => {
  showIcon.value = true
}
const afterLeave = () => {
  // showIcon.value = false
}
// onActivated(() => {
//   console.log('testsetsetstsetes***')
// })
// onDeactivated(() => {
//   console.log('onDeactivated***')
// })

// 更新后，同步左侧栏更新
const menuDataToAside = (mid: number, obj: any, status: number, type: string) => {
  // 获取某一菜单项的索引值，便于修改显示
  const index = menuData.value.map((item: any) => item.menuId).indexOf(mid)
  if (type === 'switch') !status ? menuData.value[index].status = 0 : menuData.value[index].status = 1
  else menuData.value[index] = obj
}

// 更新localStorage.short中的isChange的状态，当isChange为true时，下次进入将会重新调用接口，获取菜单信息
const updateStorageMenuData = () => {
  const data = JSON.parse(sessionStorage.menuData)
  data.isChange = true
  sessionStorage.menuData = JSON.stringify(data)
}

// 获取菜单列表
const getMenuAll = async () => {
  loading.value = true
  const { data: res, code, msg }: any = await MenuEdits.menuOrg()
  loading.value = false
  if (code === 200) {
    menuData.value = res
    treeData.value = toTreeData(menuData.value, 0)
  } else {
    ElMessage.error(msg)
  }
}

// 可生成左侧菜单栏可使用的树结构（可实现跳转，并且数据上进行了优化），也可生产功能菜单设置的树结构，type='asideData'时为左侧菜单栏可使用的树结构
const toTreeData = (data: any, pid: any, type?: string) => {
  const tree = (id: any) => {
    let arr: any = []
    data
      .filter((item: any) => {
        return item.parentId === id
      })
      .forEach((item: any) => {
        if (type === 'asideData') {
          if (item.status === 0) {
            return
          }
          arr.push({
            node: item.menuId,
            name: item.menuName,
            target: item.target,
            index: item.path == null ? String(item.menuId) : item.scheme + item.path,
            icon: item.icon,
            status: item.status,
            child: tree(item.menuId),
          })
        } else {
          arr.push({
            ...item,
            id: item.menuId,
            label: item.menuName,
            value: item.menuId,
            editStatus: true,
            show: false,
            showButton: false,
            children: tree(item.menuId),
            editData: { ...item, _pId: item.parentId }
          })
        }
      })
    if (type === 'asideData') {
      for (const i of arr) {
        if (i.child.length == 0) {
          delete i.child
        } else {
          for (let j of i.child) {
            j.parentNode = i.node
          }
        }
      }
    } else {
      for (let i of arr) {
        if (i.children.length == 0) {
          delete i.children
        }
      }
    }
    // _.uniqWith(arr, _.isEqual)
    return arr
  }
  return tree(pid) // 第一级节点的父id，是null或者0，视情况传入
}

// 添加新菜单
const add = () => {
  ruleForm.value.validate(async (valid: any) => {
    if (valid) {
      const addParamsCopy = cloneDeep(addParams.value)
      addParamsCopy.identityType = addParamsCopy.identityType.join(',')
      addParamsCopy.parentId = addParamsCopy.parentId || 0
      const params = addParamsCopy
      const { data: res, code, msg }: any = await MenuEdits.menuAdd(params, 'messageBox')
      if (code === 200) {
        ElMessage.success(msg)
        updateStorageMenuData()
        showDlalog.value = false
        params.id = params.menuId = res
        menuData.value.push(params)
        treeData.value = toTreeData(menuData.value, 0)
        menuDataToAside(res, params, 0, 'others')
        clearForm()
        // menuChanged()
      }
    }
  })
}

// 修改菜单信息
const update = async (allData: any, data?: any, type?: string) => {
  if (type === 'shortcut') {
    let params: any = param(data)
    // params.isPersist = 0
    const { data: res, msg, code }: any = await MenuEdits.menuUpdate(params, 'messageBox')
    if (code === 200) {
      updateStorageMenuData()
      // menuChanged()
      allData = params
      menuDataToAside(res, params, 0, 'others')
      allData.show = false
      showIconList.value = false
      showEditDialog.value = false
    }
  } else {
    ruleForm__.value.validate(async (valid: any) => {
      if (valid) {
        let params: any = param(data)
        // params.isPersist = 0
        const { data: res, msg, code }: any = await MenuEdits.menuUpdate(params, 'messageBox')
        if (code === 200) {
          ElMessage.success(msg)
          menuData.value.filter((r: any, index: any) => {
            if (r.menuId === data.menuId) {
              menuData.value[index] = params
            }
          })
          menuDataToAside(res, params, 0, 'others')
          treeData.value = toTreeData(menuData.value, 0)
          updateStorageMenuData()
          // menuChanged()
          allData.show = false
          showEditDialog.value = false
          showIconList.value = false
        }
      }
    })
  }
}

// 更换显示状态
const changeSwitch = (data: any) => {
  update(data, data, 'shortcut')
  // menuDataToAside(data.menuId, data, data.status, 'switch')
}

// 更换图标文件
const changeIcon = (icon: string, data: any) => {
  data.icon = icon
  update('', data, 'shortcut')
  menuDataToAside(data.menuId, data, 0, 'icon')
  // const menuDataToAside = (
  // mid: number,
  // obj: any,
  // status: number,
  // type: string
}

// 初始化param，用于接口的返回
const param = (obj: any) => {
  const params = {
    applicationType: obj.applicationType,
    icon: obj.icon,
    menuCode: obj.menuCode,
    menuDesc: obj.menuDesc,
    menuId: obj.menuId,
    menuName: obj.menuName,
    parentId: obj._pId instanceof Array ? (obj._pId.length > 0 ? obj._pId[obj._pId.length - 1] : obj._pId) : obj._pId || 0,
    path: obj.path,
    priority: obj.priority,
    scheme: obj.scheme,
    status: obj.status,
    target: obj.target,
    identityType: Array.isArray(obj.identityType) ? obj.identityType?.join(',') : obj.identityType,
  }
  return params
}

// 删除菜单
const deletes = (data: any) => {
  ElMessageBox.confirm('你确定要删除此菜单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const params = {
        menuId: data.menuId
      }
      const { code, msg }: any = await MenuEdits.menuRemove(params, 'messageBox')
      if (code === 200) {
        const arr = _.remove(menuData.value, (r: any) => {
          return r.menuId !== data.menuId
        })
        menuData.value = arr
        treeData.value = toTreeData(arr, 0)
        // menuChanged()
        menuDataToAside(data.menuId, data, 0, 'others')
        ElMessage.success(msg)
      }
    })
    .catch(() => {
      return
    })
}
const moreDialog = (data: any) => {
  more.value = true
  moreData.value = data
}

const showEdit = async (data: any) => {
  if (!isEmpty(data.editData.identityType) && !Array.isArray(data.editData.identityType)) {
    data.editData.identityType = data.editData.identityType?.split(',')
  } else {
    data.editData.identityType = []
  }
  data.editData._pId = data.editData._pId || null
  editDataForm.value = data
  showEditDialog.value = true
  data.disabled = true
}
const beforeChange = () => {
  return new Promise((resove, reject) => {
    ElMessageBox.confirm("确定要切换该菜单状态吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      resove(true)
    }).catch(() => {
      reject(false)
    })
  })
}

const getPlatTypeList = async () => {
  const { data: res, code, msg } = await MenuEdits.getPlatType()
  if (code === 200) {
    platTypeList.value = [{ code: 'platform', name: '移动服务平台' }, ...res.platformType]
  } else {
    //
  }
}

onMounted(() => {
  getMenuAll()
  getPlatTypeList()
})
</script>

<style lang="scss">
#MenuEdits {
  overflow-y: hidden;

  td {
    i {
      cursor: pointer;

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }

  .edit-button {
    float: right;
  }

  .font-atte {
    font-size: 12px;
    color: #909399;
  }

  .tree-box {
    width: 100%;
    position: relative;
    z-index: 99;

    & :deep(.is-dot) {
      position: unset;
    }

    .input {
      outline: none;
      border: none;
      background-color: transparent;
    }

    .router {
      width: 300px;
    }

    &::v-deep .el-scrollbar__view {
      display: flex;
    }
  }
}

::v-deep .el-popover {
  .icon-list {
    display: grid;
    grid-template-columns: repeat(8, 1fr);

    .icon-item {
      border: 1px solid black;
    }
  }
}

.icon-list {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  // display: grid;
  // flex-wrap: wrap;
  // stify-content: space-between;
  height: 30vh;

  .icon-item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 4px;
    font-size: 16px;

    &:hover {
      background-color: #b3b3b33f;
    }
  }

  &::-webkit-scrollbar {
    display: none;
  }
}

.el-icon.menu-icon {
  color: #232323;
}
</style>