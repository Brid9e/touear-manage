<template lang="pug">
//- p {{currentMenu.flagIsCloud === '1' }}  1云端添加；2自定义添加
.content-createCustomMenu
  el-form(ref='forms', label-width='120px', :rules='rules', :model='formEdit')
    el-form-item(label='菜单名称', prop='name')
      el-input(v-model='formEdit.name')
    el-form-item(label='菜单英文名称', prop='nameEn')
      el-input(v-model='formEdit.nameEn')
    //- | {{props.data.isStatus}}
    el-form-item(label='状态' v-if="!(props.data.isStatus === false)")
      el-switch(v-model='formEdit.status', :active-value='1', :inactive-value='0', :active-text='statusList.find((item) => item.value === formEdit.status).label')
    el-form-item(label='用户类型' prop="type" :class="currentMenu.flagIsCloud === '1' || currentMenu.appId  ? '' : 'is-required'")
      //- p {{ currentMenu.appId }} {{ currentMenu.flagIsCloud === '1' || currentMenu.appId }}
      span(v-if="currentMenu.flagIsCloud === '1' || currentMenu.appId")
        span(v-if="currentMenu.type === 'common'")
          span(v-for="(item, i) in userTypeList")
            | {{ item.name }}
            span(v-if="i + 1 < userTypeList.length") &nbsp;/&nbsp;
        span(v-else)
          | {{userTypeList.find(item => item.label === currentMenu.type)?.name}}
        //- {{userTypeList.find((item) => item.label === formEdit.type).name}}
      el-checkbox-group(v-else v-model="formEdit.typeArr" )
        el-checkbox(v-for="(item, i) in userTypeList" :label="item.label" name="type") {{item.name}}
    el-form-item(label='终端类型' prop="platTypeArr" :class="currentMenu.flagIsCloud === '1' || currentMenu.appId  ? '' : 'is-required'")
      p(v-if="props.data && props.data.platType")
        | {{platTypeLevel.find(sitem => sitem.code === props.data.platType)?.name}}
      span(v-else-if="currentMenu.flagIsCloud === '1' || currentMenu.appId " v-for='(ele, i) in formEdit.platTypeArr', :key='i')
        span {{ platTypeLevel.find((e) => e.code === ele).name }}
        span(v-if="i < formEdit.platTypeArr.length - 1") &nbsp;/&nbsp;
      el-checkbox-group(v-else, v-model="formEdit.platTypeArr", @change="changePlatType")
        el-checkbox(v-for="(item, i) in platTypeLevel", :label="item.code", name="type") {{ item.name }}
    //- p {{imgFile}}
    template(v-if="selectedPlat.length > 0", v-for="(item, i) in selectedPlat")
      el-form-item(:label="item.name + '图标'")
        .upload-box
          .upload-item(v-for="(subItem, key) in iconModeList[item.parentCode || item.code]", :key="key")
            p.text-center.title.font-size-14 {{ subItem.name }}
            .text-center(v-if="imgFile?.[item.code]?.[subItem.code]")
              el-upload.avatar-uploader(v-model='imgFile[item.code][subItem.code].file', action='#', :http-request='imgFile[item.code][subItem.code].httpRequest', accept='image/gif,image/jpeg,image/jpg,image/png,image/svg')
                .avatar-uploader-icon(v-if='!imgFile[item.code][subItem.code].src')
                  el-icon(:size="50", color="#999" style="margin-top: 23px")
                    CameraFilled
                //- img(:src="imgFile[item.code][subItem.code].src")
                el-image.image-middle(v-else, :src="imgFile[item.code][subItem.code].src")
                  template(#error)
                    Picture
    el-form-item(v-if="selectedPlat.length > 0", label="菜单地址")
      .app-link-content(v-for="(item, i) in selectedPlat")
        //- .url-type-item(v-if="item.children.length > 0")
          .url-group-item.margin-bottom-x(v-for="(child, i) in item.children", :key="i")
            //- p {{child}}
            span.title-width.input-item-left {{ child.name }}:
            .input-item-right
              template(v-if="currentMenu.flagIsCloud === '1' || currentMenu.appId")
                el-input(v-model="child.url", placeholder="请输入菜单地址")
              template(v-else)
                inputUrl(v-if="child.code !== 'wechat-mina'", v-model="child.url", :defaultUrl="child.url")
                el-input(v-else, v-model="child.url", placeholder="请输入菜单地址")
              el-input.margin-top-xs(v-if="child.appIdRequired === 1", v-model="child.appId", placeholder="请输入Appid")
              el-input.margin-top-xs(v-if="child.routingParameters === 1 && (currentMenu.flagIsCloud === '1' || currentMenu.appId) && child.route", v-model="child.route", placeholder="请输入路由（route）" :disabled="currentMenu.flagIsCloud === '1' || currentMenu.appId")
        .url-type-item.url-group-item
          span.title-width.input-item-left {{ item.name }}:
          .input-item-right
            template(v-if="currentMenu.flagIsCloud === '1' || currentMenu.appId")
              el-input(v-model="item.url", placeholder="请输入菜单地址")
            template(v-else)
              inputUrl(v-if="item.code !== 'wechat-mina'", v-model="item.url", :defaultUrl="item.url")
              el-input(v-else, v-model="item.url", placeholder="请输入菜单地址")
            el-input.margin-top-xs(v-if="item.appIdRequired === 1", v-model="item.appId", placeholder="请输入Appid")
            el-input.margin-top-xs(v-if="item.routingParameters === 1 && (currentMenu.flagIsCloud === '1' || currentMenu.appId) && item.route", v-model="item.route", placeholder="请输入路由（route）", :disabled="currentMenu.flagIsCloud === '1' || currentMenu.appId")
</template>

<script lang="ts" setup>
import { ref, defineExpose, defineEmits, onMounted, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import inputUrl from '@/components/form/inputUrl.vue'
import { Picture, CameraFilled } from '@element-plus/icons-vue'
import { getFileFromOnlineImg } from '@/assets/scripts/file'
const { appContext }: any = getCurrentInstance()
const { state } = useStore(key)
const { statusList, userTypeList, platTypeList, iconModeList, platTypeLevel } = state
const props = defineProps(['data'])
const emit = defineEmits(['submit'])
console.log('currentMenu props', props.data.currentMenu)
const currentMenu: any = ref(props.data.currentMenu)
const { name, nameEn, status, type, platType } = currentMenu.value
let typeArr = []
if (type === 'common') {
  userTypeList.forEach((element: any) => {
    typeArr.push(element.label)
  })
  // typeArr.
} else {
  typeArr.push(type)
}
const formEdit: any = ref({
  name,
  nameEn,
  status,
  // type,
  typeArr,
  // platType,
  platTypeArr: platType.split(",")
})
const rules: any = ref({
  name: [
    {
      required: true,
      message: "请输入菜单名称",
      trigger: "blur"
    }
  ],
  typeArr: [
    {
      required: true,
      message: "请选择用户类型",
      trigger: "blur"
    }
  ],
  platTypeArr: [
    {
      required: true,
      message: "请选择平台类类型",
      trigger: "blur"
    }
  ]
})

// const rules: any = ref(props.data.rules);
const forms = ref(null);
let selectedPlat: any = ref([]); // 已选终端类型
const imgFile: any = ref({});

const changePlatType = (val: any) => {
  selectedPlat.value = platTypeLevel.filter((item: any) => {
    return val.indexOf(item.code) !== -1;
  });
  console.log("changePlatType", selectedPlat.value);
};
const confirm = () => {
  // const isFormData = true
  (forms.value as any).validate((valid: any) => {
    console.log("formEdit.value", formEdit.value)
    console.log("valid", valid)
    if (valid) {
      // return true
      // console.log(formEdit, imgFile, selectedPlat.value)
      formEditData((data: any) => {
        emit("submit", valid, true, data)
      })
    }
  });
};
const formEditData = (callback: any) => {
  // 处理菜单地址路由数据
  const formData = new FormData();
  const urlArr: any = ref([]);
  selectedPlat.value.forEach((element: any) => {
    // console.log(element);
    // if (element.children.length > 0) {
    //   element.children.forEach((subEle: any) => {
    //     urlArr.value.push(subEle);
    //   });
    // } else {
    urlArr.value.push(element);
    // }
  });
  formEdit.value.extraConfig = JSON.stringify(urlArr.value)
  formEdit.value.id = currentMenu.value.bh
  console.log('formEdit', formEdit.value)
  Object.keys(formEdit.value).forEach((key: any) => {
    console.log('key', key)
    if (key === "platTypeArr") {
      formData.append("zAppIndex[0].platType", formEdit.value.platTypeArr.join(","))
    } else if (key === "typeArr") {
      let type = ''
      if (formEdit.value.typeArr.length > 1) {
        type = 'common'
      } else {
        type = formEdit.value.typeArr[0]
      }
      formData.append("zAppIndex[0].type", type)
    } else {
      if (formEdit.value[key] || formEdit.value[key] === 0) formData.append(`zAppIndex[0].${key}`, formEdit.value[key]);
    }
  });
  let index = 0;
  Object.keys(imgFile.value).forEach((plat: any) => {
    console.log(imgFile.value[plat]);
    Object.keys(imgFile.value[plat]).forEach((item: any) => {
      // console.log(imgFile.value[plat][item])
      if (imgFile.value[plat][item].file) {
        formData.append(`zAppIndex[0].iconByFile[${index}].type`, plat + "#" + item);
        formData.append(`zAppIndex[0].iconByFile[${index}].file`, imgFile.value[plat][item].file);
        index++;
      }
    });
  });
  console.log()
  callback(formData);
};
const initImgFile = async () => {
  const iconObj: any = currentMenu.value.icon ? JSON.parse(currentMenu.value.icon) : null;
  // console.log(iconObj)
  for (let index = 0; index < platTypeLevel.length; index++) {

    const element = platTypeLevel[index]
    imgFile.value[element.code] = {}
    const key = element.parentCode || element.code
    for (let j = 0; j < iconModeList[key].length; j++) {
      const subEle = iconModeList[key][j];
      // console.log('subEle', element, subEle, imgFile.value)
      const src = iconObj[element.code + '#' + subEle.code] || iconObj[key] || null
      let file = null
      if (src) {
        console.log('src', src, currentMenu.value.indexCode)
        // newfile = await getFileFromOnlineImg(src, currentMenu.value.indexCode + '.png')
        file = await getFileFromOnlineImg(src, currentMenu.value.indexCode + '.png')
        console.log(file)
      }
      imgFile.value[element.code][subEle.code] = {
        file: file,
        src: src,
        // src: iconObj[element.code + '#' + subEle.code] || iconObj[key],
        httpRequest: (data: any) => {
          console.log("httpRequest", data);
          imgFile.value[element.code][subEle.code].src = URL.createObjectURL(data.file);
          imgFile.value[element.code][subEle.code].file = data.file;
        }
      };
    }
  }
  console.log('-- imgFile', imgFile.value)
}
initImgFile()
onMounted(() => {
  selectedPlat.value = platTypeLevel.filter((item: any) => {
    return platType.indexOf(item.code) !== -1
  })
  // console.log(currentMenu.value.extraConfig)
  const urlList = currentMenu.value.extraConfig ? JSON.parse(currentMenu.value.extraConfig) : null;
  // console.log("urlObj", selectedPlat.value, urlList);
  selectedPlat.value.forEach((element: any, i: number) => {
    const orginData = urlList.find((item: any) => item.code === element.code)
    if (orginData) {
      selectedPlat.value[i] = urlList.find((item: any) => item.code === element.code)
    }
  });

})

defineExpose({
  confirm
});
</script>
<style lang="scss">
.upload-box {
  width: 100%;
}

.content-createCustomMenu {
  .el-image__inner {
    vertical-align: middle;
  }
  .url-type-item {
    background-color: #f4f5f5;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 6px;
  }
  .url-group-item {
    overflow: hidden;
    .input-item-right {
      float: left;
      width: calc(100% - 90px);
    }
    .input-item-left {
      float: left;
      width: 80px;
      margin-right: 10px;
      text-align: right;
    }
    .margin-top-xs {
      margin-top: 3px;
    }
  }
  .app-link-content {
    border-radius: 5px;
    overflow: hidden;
    width: 100%;
    .head {
      padding: 5px 12px;
      background: #f4f5f5;
      line-height: 28px;
    }
    .body {
      padding: 5px 12px;
    }
  }
}
</style>
