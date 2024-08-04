<!--
 * @LastEditTime: 2023-03-06 15:11:56
-->
<template lang="pug">
#TableTransfer
  .table-transfer
    el-row()
      el-col.transfer-card(xs="24" :sm="24" :md="10" :lg="10" :xl="11")
        .transfer-seacher
          el-input.transfer-seacher-li(v-model="merSearch.ouValue", placeholder="按商户名或者商户号查询" clearable  @input="quireMacc('nor')")
          el-tree-select.transfer-seacher-li(v-model="locStrictly.ouValue" :data="locData" placeholder='按商户部门查询'  multiple :render-after-expand="false" show-checkbox  @change="inQuirelocMacc('nor')" check-strictly check-on-click-node)  
        .transfer-main
          el-table(:data="otherMeData" ref="selection"  @selection-change="receiveCheck" style="width: 100%" height="270")
            el-table-column(type="selection" width="30")
            el-table-column(prop="label" :label="'未添加商户('+dataLength.ouLength+')'" show-overflow-tooltip)
      el-col(xs="24" :sm="24" :md="4" :lg="4" :xl="2") 
        .opSetting
          el-button(:disabled="nowSelectData.length?false:true" :icon="DArrowRight" type='primary' @click='selectItems')
          el-button(:disabled="nowSelectRightData.length?false:true" :icon="DArrowLeft" type='primary' @click='removeItems')
      el-col.transfer-card(xs="24" :sm="24" :md="10" :lg="10" :xl="11")
        .transfer-seacher
          el-input.transfer-seacher-li(v-model="merSearch.inValue", placeholder="按商户名或者商户号查询" clearable  @input="quireMacc('inr')")
          el-tree-select.transfer-seacher-li(v-model="locStrictly.inValue" :data="locData" placeholder='按商户部门查询'  multiple :render-after-expand="false" show-checkbox  @change="inQuirelocMacc('inr')" check-strictly check-on-click-node)  
        .transfer-main
          el-table(:data="selMeData"  ref="selection"  @selection-change="dispatCheck" style="width: 100%" height="270" )
            el-table-column(type="selection" width="30")
            el-table-column(prop="label" :label="'已添加商户('+ dataLength.inLength+')'"  show-overflow-tooltip)   
</template>
<script lang="ts" setup>
import { reactive, toRefs, ref, onBeforeMount, defineProps, onMounted, watchEffect, watch, toRaw, defineEmits } from "vue"
import { useStore } from "vuex"
import { key } from "@/store"
import { Role } from "@/service/manage"
import { ElMessageBox, ElMessage } from "element-plus"
import { useRouter } from "vue-router"
import _, { difference, differenceBy, intersectionBy, pullAllBy } from "lodash"
import { DArrowRight, DArrowLeft } from "@element-plus/icons-vue"
const props = defineProps({
    metadata: {
        type: Array,
        default: [],
    },
    beMerData: {
        type: Array,
        default: [],
    },
})
// console.log("全部商户", props.metadata, "已添加的商户", props.beMerData)

const outMerData: any = ref([])
const otherMeData: any = ref([])
const selMeData: any = ref([])
const locData: any = ref([])
const selectData = reactive({
    leftValue: [] as Array<string>,
    rightValue: [] as Array<string>,
})
const merSearch: any = reactive({
    ouValue: "",
    inValue: "",
})
const locStrictly: any = reactive({
    ouValue: "",
    inValue: "",
})
const dataLength: any = reactive({
    ouLength: "",
    inLength: "",
})
const nowSelectData: any = ref([])
const nowSelectRightData: any = ref([])
const emit = defineEmits(["maccmodelValue"])

//数据整理
const setMetaData = () => {
    // selMeData.value = props.beMerData
    if (props.beMerData.length > 0) {
        const transferData = props.beMerData
        const data: any = []
        transferData.forEach((val: any, index: any) => {
            data.push({
                label: val.label,
                key: val.resourceCode,
            })
        })
        selMeData.value = data
        otherMeData.value = differenceBy(toRaw(props.metadata), toRaw(selMeData.value), "key")
        outMerData.value = differenceBy(toRaw(props.metadata), toRaw(selMeData.value), "key")
        dataLength.inLength = selMeData.value.length
        dataLength.ouLength = otherMeData.value.length
    } else {
        otherMeData.value = props.metadata
        outMerData.value = props.metadata
        selMeData.value = props.beMerData
        dataLength.inLength = props.beMerData.length
        dataLength.ouLength = props.metadata.length
    }
    // console.log("数据整理----", selMeData.value, otherMeData.value)
}
//模糊查询
const quireMacc = (val: any) => {
    if (val == "nor") {
        if (merSearch.ouValue) {
            const searchVal = merSearch.ouValue.toLowerCase()
            const newMerData: any = []
            outMerData.value.filter((item: any) => {
                if (item.label) {
                    if (item.label.toLowerCase().indexOf(searchVal) !== -1) {
                        newMerData.push(toRaw(item))
                    }
                }
            })
            otherMeData.value = newMerData
            dataLength.ouLength = newMerData.length
            // console.log("@@@@@----", searchVal, outMerData.value, otherMeData.value, newMerData.length)
        } else {
            // console.log("清空----", outMerData.value, outMerData.length)
            otherMeData.value = outMerData.value
            dataLength.ouLength = outMerData.value.length
        }
    }
    if (val == "inr") {
        if (merSearch.inValue) {
            const searchVal = merSearch.inValue.toLowerCase()
            const newMerData: any = []
            props.beMerData.filter((item: any) => {
                if (item.label) {
                    if (item.label.toLowerCase().indexOf(searchVal) !== -1) {
                        newMerData.push(item)
                    }
                }
            })
            selMeData.value = newMerData
            dataLength.inLength = newMerData.length
        } else {
            console.log("清空*******", props.beMerData, selMeData.value)
            // selMeData.value = props.beMerData
            // dataLength.inLength = props.beMerData.length
        }
        console.log("添加----", merSearch.inValue, selMeData.value)
    }
}
//部门查询
const inQuirelocMacc = async (val: any) => {
    if (val == "nor") {
        const params = {
            locIdList: JSON.stringify(locStrictly.ouValue),
        }
        const res = await Role.getMercaccListPar(params)
        const transferData = res.data
        const data: any = []
        transferData.forEach((val: any, index: any) => {
            data.push({
                label: `${val.name}(${val.code})`,
                key: String(val.code),
            })
        })
        // otherMeData.value = data
        // console.log("@@@@@----部门", data, outMerData.value, intersectionBy(outMerData.value, data, "key"))
        otherMeData.value = intersectionBy(outMerData.value, data, "key")
        dataLength.ouLength = otherMeData.value.length
    }
    if (val == "inr") {
        if (locStrictly.inValue.length > 0) {
            const params = {
                locIdList: JSON.stringify(locStrictly.inValue),
            }
            const res = await Role.getMercaccListPar(params)
            const transferData = res.data
            const data: any = []
            transferData.forEach((val: any, index: any) => {
                data.push({
                    label: `${val.name}(${val.code})`,
                    key: String(val.code),
                })
            })
            // selMeData.value = data
            // console.log("@@@@@已添加查询----部门", data, props.beMerData, intersectionBy(props.beMerData, data, "key"))
            selMeData.value = intersectionBy(props.beMerData, data, "key")
            dataLength.inLength = selMeData.value.length
        } else {
            selMeData.value = props.beMerData
            dataLength.inLength = props.beMerData.length
        }
        // console.log("@@@@@----部门", locStrictly.inValue, selMeData.value, props.beMerData)
    }
}
//部门
const getLocList = async () => {
    const res = await Role.getLocList()
    if (res && res.data) {
        let data = ([] = JSON.stringify(res.data.descendants))
        data = data.replace(/descendants/g, "children")
        data = data.replace(/name/g, "label")
        data = data.replace(/id/g, "value")
        locData.value = JSON.parse(data)
    }
    // console.log("部门", res, locData.value)
}
//
const receiveCheck = (val: any) => {
    nowSelectData.value = val
}
const dispatCheck = (val: any) => {
    nowSelectRightData.value = val
}
//选中
const selectItems = () => {
    selMeData.value.push.apply(selMeData.value, nowSelectData.value)
    otherMeData.value = pullAllBy(otherMeData.value, nowSelectData.value, "key")
    nowSelectData.value = []
    dataLength.ouLength = otherMeData.value.length
    dataLength.inLength = selMeData.value.length
    emit("maccmodelValue", selMeData.value)
    // console.log("选中 ----", selMeData.value)
}
//移出
const removeItems = () => {
    otherMeData.value.push.apply(otherMeData.value, nowSelectRightData.value)
    selMeData.value = pullAllBy(selMeData.value, nowSelectRightData.value, "key")
    nowSelectRightData.value = []
    dataLength.ouLength = otherMeData.value.length
    dataLength.inLength = selMeData.value.length
    emit("maccmodelValue", selMeData.value)
}

// watch(
//     () => selMeData.value,
//     (newValue, oldValue) => {
//         setMetaData()
//         console.log("jiant ----", newValue, oldValue)
//     },
//     {}
// )
onMounted(() => {
    setMetaData()
    getLocList()
    // console.log("全部商户", props.metadata, "已添加的商户", props.beMerData)
})
</script>
<style lang="scss" scoped>
#TableTransfer {
    .table-transfer {
    }
    .transfer-card {
        background: #fafafa;
        border-radius: 4px;
        padding: 10px 10px;
        overflow: hidden;
        display: inline-block;
        text-align: left;
        vertical-align: middle;
        max-height: 100%;
        box-sizing: border-box;
        position: relative;
        border: 1px solid #ebeef5;
    }
    .transfer-seacher {
        position: relative;
        display: block;
        .transfer-seacher-li {
            display: block;
            margin-bottom: 8px;
            :deep(.el-input__wrapper) {
                width: 100%;
                box-sizing: border-box;
            }
        }
    }
    .transfer-main {
        // :deep(.el-table__cell) {
        //     padding: 1px 0;
        //     border-bottom: none;
        // }
        :deep(.el-table) {
            thead {
                font-weight: 400;
                background: #f5f7fa;
                color: #333;
                th.el-table__cell {
                    background-color: #fdfdfd;
                }
            }
            tbody {
                .el-table__cell {
                    padding: 1px 0;
                    border-bottom: none;
                }
            }
        }
    }
    .opSetting {
        display: block;
        margin-top: 100px;
        .el-button {
            margin-left: 0px;
            display: block;
            margin: auto;
            margin-bottom: 18px;
        }
    }
}
</style>
