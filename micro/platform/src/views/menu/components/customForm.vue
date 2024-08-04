<template lang='pug'>
div
  //- | lg {{ lg }}
  //- | formAdd {{ formAdd }}
  //- p selectedPlat {{ selectedPlat }}
  //- p platTypeList {{ platTypeList }}
  el-row.group-input-box.content-createCustomMenu
    el-col(:xs="24", :sm="{ span: 16, offset: 3 }", :md="{ span: 16, offset: 3 }", :lg="{ span: lg?.span || 12, offset: lg?.offset || 5 }", :xl="{ span: lg?.span || 12, offset: lg?.offset || 5 }")
      el-form(ref="ruleFormRef", label-width="120px", :rules="rules", :model="formAdd")
        //- el-form-item(label='indexCode' prop="indexCode").is-required
        //-   el-input(v-model='formAdd.indexCode')
        el-form-item.is-required(label="名称", prop="name")
          el-input(v-model="formAdd.name")
        el-form-item(label="英文名称", prop="nameEn")
          el-input(v-model="formAdd.nameEn")
        el-form-item.is-required(label="用户类型", prop="typeArr")
          el-checkbox-group(v-model="formAdd.typeArr")
            el-checkbox(v-for="(item, i) in userTypeList", :label="item.label", name="type") {{ item.name }}
        el-form-item.is-required(label="终端类型", prop="platTypeArr")
          p(v-if="props.options && props.options.platType")
            | {{ platTypeLevel.find((sitem) => sitem.code === props.options.platType)?.name }}
          el-checkbox-group(v-else, v-model="formAdd.platTypeArr", @change="changePlatType")
            el-checkbox(v-for="(item, i) in platTypeLevel", :label="item.code", name="type") {{ item.name }}
        template(v-if="selectedPlat.length > 0")
          template(v-for="(item, i) in selectedPlat")
            //- p {{ item }}
            el-form-item.icon-box-item(:label="item.name + '图标'")
              //- |　{{ item.code }}
              .upload-box
                .upload-item(v-for="(subItem, key) in iconModeList[(item.parentCode || item.code)]", :key="key")
                  p.text-center.title.font-size-14 {{ subItem.name }}
                  .text-center
                    el-upload.avatar-uploader(v-model="imgFile[item.code][subItem.code].file", action="#", :http-request="imgFile[item.code][subItem.code].httpRequest", accept="image/gif,image/jpeg,image/jpg,image/png,image/svg")
                      .avatar-uploader-icon(v-if="!imgFile[item.code][subItem.code].src")
                        el-icon(:size="50", color="#999" style="margin-top: 23px")
                          CameraFilled
                      //- img(:src="imgFile[item.code][subItem.code].src")
                      el-image.image-middle(v-else, :src="imgFile[item.code][subItem.code].src")
                        template(#error)
                          .icon-picture-size
                            Picture
        el-form-item(v-if="selectedPlat.length > 0", label="菜单地址")
          //- p {{ selectedPlat }}
          .app-link-content(v-for="(item, i) in selectedPlat")
            //- p {{ item }}
            //- .url-type-item(v-if="item.children.length > 0")
              .url-group-item.margin-bottom-x(v-for="(child, i) in item.children", :key="i")
                //- p {{child}}
                span.title-width.input-item-left {{ child.name }}:
                .input-item-right
                  inputUrl(v-if="child.code !== 'wechat-mina'", v-model="child.url", :defaultUrl="child.url")
                  el-input(v-else, v-model="child.url", placeholder="请输入菜单地址")
                  el-input.margin-top-xs(v-if="child.appIdRequired === 1", v-model="child.appId", placeholder="请输入Appid")
                  //- el-input.margin-top-xs(v-if='child.routingParameters === 1', v-model='child.route', placeholder='请输入路由（route）')
            .url-type-item.url-group-item
              span.title-width.input-item-left {{ item.name }}:
              .input-item-right
                inputUrl(v-if="item.code !== 'wechat-mina'", v-model="item.url", :defaultUrl="item.url")
                el-input(v-else, v-model="item.url", placeholder="请输入菜单地址")
                el-input.margin-top-xs(v-if="item.appIdRequired === 1", v-model="item.appId", placeholder="请输入Appid")
        el-form-item(v-if="!(props.options && !props.options.isButton)")
          //- .text-center
          //- p {{!(props.options && !props.options.isButton)}}
          //- p {{props.options.isButton}}
          el-button(@click="resetForm") 清空
          el-button(type="primary", @click="submitForm", :loading="saveLoading") 保存
</template>
<script lang='ts' setup>
  import { ref, reactive, onActivated, onMounted } from "vue";
  import { useStore } from "vuex";
  import { key } from "@/store";
  import inputUrl from "@/components/form/inputUrl.vue";
  import { Picture, CameraFilled } from "@element-plus/icons-vue";
  const { state } = useStore(key);
  const { moduleTypeList, userTypeList, platTypeList, platTypeLevel, installStatusList, iconModeList } = state;
  const emit = defineEmits(["addMenu"]);
  const props = defineProps(["options"]);
  console.log("options", props.options);
  const ruleFormRef = ref();
  const formAdd: any = ref({
    // 添加菜单-表单内容
    name: "",
    nameEn: "",
    type: "",
    platType: "",
    platTypeArr: [],
    typeArr: [],
    // indexCode: '',
    // indexCode: "lifeServices"
    flagIsCloud: 2 // 自定义添加
  });
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
  });
  const saveLoading = ref(false);
  let selectedPlat: any = ref([]); // 已选终端类型
  const imgFile: any = ref({});

  const changePlatType = (val: any) => {
    selectedPlat.value = platTypeLevel.filter((item: any) => {
      return val.indexOf(item.code) !== -1
    })
    //  platTypeLevel.forEach((element: any) => {
    //    console.log(val.indexOf(element.code))
    //    if (val.indexOf(element.code) !== -1) {
    //    selectedPlat.value.push(element)
    //   }
    //  })
    // console.log("changePlatType", val, selectedPlat.value)
    console.log("changePlatType", platTypeLevel, val, selectedPlat.value)
  };
  const resetForm = () => {
    ruleFormRef.value.resetFields();
    initImgFile();
    selectedPlat.value = [];
    // typeArr
    // platTypeList = []
    console.log("resetForm", selectedPlat.value);
  };
  const submitForm = () => {
    let flag = true;
    ruleFormRef.value.validate((valid: any) => {
      if (valid) {
        console.log("submit!");
      } else {
        flag = false;
        console.log("error submit!");
        return false;
      }
    });
    // console.log('---', flag)

    // /minio/public/pay-icon/
    if (!flag) {
      return false;
    }
    // 处理菜单地址路由数据
    const urlArr: any = ref([]);
    selectedPlat.value.forEach((element: any) => {
      //  console.log(element);
      //  if (element.children.length > 0) {
      //    element.children.forEach((subEle: any) => {
      //      urlArr.value.push(subEle);
      //    });
      //  } else {
        urlArr.value.push(element)
      //  }
    });

    formAdd.value.extraConfig = JSON.stringify(urlArr.value);
    // console.log(formAdd)
    // const message = appContext.config.globalProperties.$message({
    //   message: '添加中...',
    //   duration: 0
    // })
    // isProgress.value = true
    // percentage.value = 0
    // const timer = setInterval(() => {
    //   // console.log(1)
    //   percentage.value += 8
    //   if (percentage.value >= 99){
    //     percentage.value = 99
    //   }
    //   // console.log(percentage.value)
    // }, 200)
    // progressText.value  = '正在添加...'
    const formData = new FormData();
    Object.keys(formAdd.value).forEach((key: any) => {
      if (key === "platTypeArr") {
        formData.append("zAppIndex[0].platType", formAdd.value.platTypeArr.join(","));
      } else if (key === "typeArr") {
        let type = ''
        if (formAdd.value.typeArr.length > 1) {
          type = 'common'
        } else {
          type = formAdd.value.typeArr[0]
        }
        formData.append("zAppIndex[0].type", type)
      } else {
        if (formAdd.value[key]) formData.append(`zAppIndex[0].${key}`, formAdd.value[key])
      }
    });
    let index = 0;
    Object.keys(imgFile.value).forEach((plat: any) => {
      console.log('--------imgFile', plat, imgFile.value[plat]);
      Object.keys(imgFile.value[plat]).forEach((item: any) => {
        // console.log(imgFile.value[plat][item], plat + "#" + item)
        if (imgFile.value[plat][item].file) {
          formData.append(`zAppIndex[0].iconByFile[${index}].type`, plat + "#" + item);
          formData.append(`zAppIndex[0].iconByFile[${index}].file`, imgFile.value[plat][item].file);
          index++;
        }
      });
    });
    emit("addMenu", formData);
    // addMenu(formData, () => {
    //   // message.close()
    //   isProgress.value = false
    //   clearInterval(timer)
    // })
  };
  // 初始化图标文件
  const initImgFile = () => {
    console.log('initImgFile----', platTypeLevel)
    platTypeLevel.forEach((element: any) => {
      imgFile.value[element.code] = {}
      const key = element.parentCode || element.code
      console.log(iconModeList[key])
      iconModeList[key].forEach((subEle: any) => {
        imgFile.value[element.code][subEle.code] = {
          file: null,
          src: null,
          httpRequest: (data: any) => {
            console.log("httpRequest", data);
            imgFile.value[element.code][subEle.code].src = URL.createObjectURL(data.file);
            imgFile.value[element.code][subEle.code].file = data.file;
          }
        };
      });
    })
  //    for (const key in iconModeList) {
  //      imgFile.value[key] = {};
  //      console.log(iconModeList[key])

  //    }
  };
  // onActivated(() => {
  //   initImgFile()
  //   console.log('onActivated', props.options)

  //   // alert(1)
  // })
  const lg = ref();
  const xl = ref();
  onMounted(() => {
    initImgFile();
    // platTypeList = state.platTypeList
    if (props.options) {
      if (props.options.platType) {
        // formAdd.value.platType = props.options.platType
        // formAdd.value.platTypeArr = [props.options.platType]
        formAdd.value.platTypeArr.push(props.options.platType);
        const obj = platTypeList.find((sitem: any) => sitem.code === props.options.platType);
        selectedPlat.value.push(JSON.parse(JSON.stringify(obj)));
        // selectedPlat.value = platTypeList.find((sitem: any) => sitem.code === props.options.platType)
        console.log(
          "ssss",
          platTypeList.find((sitem: any) => sitem.code === props.options.platType)
        );
      }
      if (props.options.layout) {
        lg.value = props.options.layout.lg;
        xl.value = props.options.layout.xl;
      }
    }
    // console.log('onMounted', formAdd.value, selectedPlat.value, platTypeList, state.)
  });
  defineExpose({
    resetForm,
    submitForm
  });

</script>

<style lang='scss'>
.upload-box {
  width: 100%;
  // .avatar-uploader
}

.content-createCustomMenu {

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