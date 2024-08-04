<template lang="pug">
//- #login(:style="`background-image: url('${loginImgPul}')`" element-loading-background="#00000080")
#login
  .login-card(:class="classProp(animateClass)")
    .login-left
      .banner-swiper-box
      .logo
        h2 XXXXXXX
    .login-input(id="login-right")
      .light-bg
        .l1(id="l1Ball")
        .l2(id="l2Ball")
        .l3(id="l3Ball")
      .bg-round-1
      .bg-round-2
      .pc-login
        //- .title-bar
          span {{ showRecoverPwdPanel ? '通过邮箱找回密码' : '欢迎使用SaaS云平台'}}
        //- el-tabs(v-model="activeName")
          el-tab-pane 账号登录
          el-tab-pane 手机号登录
        el-form(:model="loginForm", :rules="rules", ref="ruleForm" label-position="top" :hide-required-asterisk="true" @submit.native.prevent)
          el-form-item(v-if="!showRecoverPwdPanel" prop="username")
            el-input(placeholder="请输入用户账号", v-model="loginForm.username", @keydown.enter="login", size="large")
              template(#prefix)
                el-icon(size="16" color="var(--el-color-primary)")
                  User
          el-form-item(v-if="!showRecoverPwdPanel" prop="password")
            el-input(placeholder="请输入登录密码", v-model="loginForm.password", @keydown.enter="login", show-password, size="large")
              template(#prefix)
                el-icon(size="16" color="var(--el-color-primary)")
                  Lock
            //- PasswordStrengthChecker(:password="loginForm.password" @back-rules="getBackResult")
          el-carousel(v-if="showRecoverPwdPanel" ref="recoverPwdPanelRef" :height="forgotPwdStep?.inputPassword || forgotPwdStep?.selectAcc ? '200px' : '120px'" :loop="false" :autoplay="false" indicator-position="none" arrow="never")
            el-carousel-item
              el-form-item(v-if="forgotPwdStep?.sendEmail" label="邮箱/Email:" prop="email")
                el-input(placeholder="请输入邮件地址", v-model="loginForm.email", @keydown.enter="onForgotPwd('sendEmail')", size="large" @keydown="onTabDown")
                  template(#prefix)
                    el-icon(size="16" color="var(--el-color-primary)")
                      Message
            el-carousel-item
              el-form-item(v-if="forgotPwdStep?.inputCode"  :label="`验证码已发送至您的邮箱(${loginForm.email})，请注意查收`" prop="emailCode")
                CodeInputBox(v-model="loginForm.emailCode", @finish="onFinishEmailCode" :digit="digit" :loading="loadingSend" @change="onInputCode")
            el-carousel-item
              el-form-item(v-if="forgotPwdStep?.inputPassword" label="输入新密码/New password" prop="newPwd")
                el-input(placeholder="请输入新密码", v-model="loginForm.newPwd", @keydown.enter="onForgotPwd('changePwd')", size="large" @keydown="onTabDown" type="password" show-password)
                PasswordStrengthChecker(:password="loginForm.newPwd" @back-rules="getBackResult")
            el-carousel-item
              el-form-item(v-if="forgotPwdStep?.selectAcc" label="该邮箱存在多个绑定账号，请选择一个账号进行密码重置" prop="account")
                el-scrollbar(style="width: 100%;height: 160px")
                  el-radio-group.acc-check(v-model="loginForm.account")
                    el-radio.acc-check-item(v-for="item in accountList" :value="item" :label="item" border) {{ item }}
              //- el-form-item(label="再次输入新密码" prop="email2")
                el-input(placeholder="请再次输入新密码", v-model="loginForm.newPwdAgain", @keydown.enter="onForgotPwd('sendEmail')", size="large" @keydown="onTabDown")

          .flex
            //- el-checkbox(:class="{ 'hide-checkbox': showRecoverPwdPanel }" v-model="state.autoLogin") 10天免登录
            el-checkbox(v-if="!showRecoverPwdPanel" v-model="state.autoLogin") 10天免登录
            el-button(link type="primary" size="small" @click="onRecoverPwd") {{ showRecoverPwdPanel ? '记得密码' : '忘记密码'}}
            //- el-popover(placement="right" trigger="click")
              .change
                i.el-icon-s-platform(v-if="loginType == 'QR'")
                img(:src="qrcodeIcon", alt="alt")
          el-button.login-button(v-if="!showRecoverPwdPanel" type="primary", @click="login", :loading="loading") {{ loading ? '登录中...' : '登录' }}
          el-button.login-button(v-else-if="forgotPwdStep?.sendEmail || forgotPwdStep?.inputPassword || forgotPwdStep?.selectAcc" type="primary", @click="onForgotPwd(forgotPwdStep?.sendEmail ? 'sendEmail' : 'changePwd', loginForm.account)", :loading="loadingSend") {{ forgotPwdStep?.sendEmail ? '发送验证码' : '确认重置密码' }}
          //- el-button.login-button(@click="onShowVerify") 验证
          //- .panel-bottom(v-show="!showRecoverPwdPanel")
            span 登录即表示同意
            el-button(type="primary" link @click="toProtocolPage('服务协议')") 服务协议
            | 和
            el-button(type="primary" link @click="toProtocolPage('隐私政策')") 隐私政策
      //- .isUnvalue(v-if="codeActive == false && loginType == 'QR'")

      //- .logo
      //-   img(:src="logo", alt="alt")
      //- .login-page(:style="`background: url('${loginImgPul}')`")
      .bottom-info
        span Copyright @2024 All Rights Reserved. 黑ICP备08101720号-13
        span 隐私条款｜法律声明｜工信部备案


  el-dialog(v-model="isVcodeShow" title="请完成安全验证" append-to-body :close-on-click-modal="false" width="440px")
    Vcode(:show="isVcodeShow" @success="onVcodeSuccess" @close="onVcodeClose" type="inside" :canvasWidth="400")
</template>

<script lang="ts" setup>
import {
  defineComponent,
  computed,
  ref,
  watch,
  onUnmounted,
  onMounted,
  onBeforeMount,
  reactive,
} from 'vue'
import { useStore } from 'vuex'
import { Platform, Refresh, User, Lock, CircleCheck, Message } from '@element-plus/icons-vue'
import { key } from '@/store'
import { mapActions } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Md5 } from 'ts-md5'
import _, { isArray, isEmpty, mapValues } from 'lodash'
import {
  verificationCode,
  checkVerificationCode,
  setPasswordByVerificationCode,
} from '@/service/manage'
import CodeInputBox from '@/components/codeInput.vue'
import PasswordStrengthChecker from '@/components/passwordStrengthChecker/index.vue'
import LoginBannerImg from '@/assets/images/login-banner.png'
import banner1 from '@/assets/images/bannerSwiperImage/banner-1.png'
import banner2 from '@/assets/images/bannerSwiperImage/banner-2.png'
import banner3 from '@/assets/images/bannerSwiperImage/banner-3.png'
import banner4 from '@/assets/images/bannerSwiperImage/banner-4.png'
import banner5 from '@/assets/images/bannerSwiperImage/banner-5.png'
// import QRCode from 'qrcode.vue'
import Vcode from "vue3-puzzle-vcode"
import Cookie from '@/assets/scripts/cookie'

// 背景图
const defaultLoginImgPul = new URL(
  '../assets/images/background-management.png',
  import.meta.url,
).href
const stepsList = ['sendEmail', 'inputCode']

const bannerGroup = [{
  image: banner1,
  title: '云平台新增管理功能',
  exampList: ['场馆预定管理', '订餐管理']
}, {
  image: banner2,
  title: '新增卡券管理功能',
  exampList: ['卡券管理', '卡券叠加', '卡券核销']
}, {
  image: banner3,
  title: 'SaaS移动服务平台',
  exampList: ['管理更便捷', '操作更高效']
}, {
  image: banner4,
  title: '新中新缴费大厅',
  exampList: ['充值缴费、流水查询', '校内缴费应用已上线...']
}, {
  image: banner5,
  title: '新有氧管理平台',
  exampList: ['每日有氧数据、绩效管理', '有氧活动、积分商城...']
}]

// banner1, banner2, banner3, banner4, banner5
const loadingTest = ref(false)
const store = useStore(key)
const { state, dispatch } = store
const router = useRouter()
const route = useRoute()
// const loginType = ref("QR");
const codeValue = ref('')
const codeActive = ref(true)
const timer: any = ref(new Function())
const code = ref('')
const loginLog = ref({ log: '点击刷新', status: 0 })

let loginImgPul = ref('')
const showRecoverPwdPanel = ref(false)
const loading = ref(false)
const loadingSend = ref(false)
const recoverPwdPanelRef = ref()
const ruleForm = ref()
const animateClass = ref('')
const loginForm: any = ref({
  username: '',
  password: '',
  captchasCode: '',
  email: '',
  newPwd: '',
  reNewPwd: '',
  emailCode: '',
  account: '',
})
const forgotPwdStep: any = ref({
  sendEmail: false,
  inputCode: false,
  inputPassword: false,
  selectAcc: false,
})
const codeUUid = ref('')
const codePass = ref()
const codeMsg = ref('')
const newPwdError = ref('')
const pwdPass = ref()
const accountList: any = ref()

const digit = 6

const captchas = reactive({
  key: '',
  image: '',
})
const animateTimer = ref()
const isVcodeShow = ref(false)

const loginLogo = computed(() => {
  return `${state.configs?.base || window.location.origin}/minio/public/login/logo-management.png`
})

const token = computed(() => state.token)
const token_type = computed(() => state.token_type)

const captchasCode = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请输入验证码'))
  }
  return callback()
}

/**
 * 校验邮箱合法性
 * @param rule
 * @param value
 * @param callback
 */
const emailVaild = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请输入邮箱'))
  }
  if (typeof codePass.value === 'boolean' && !codePass.value) {
    console.log('12312312')
    return callback(new Error(codeMsg.value))
  }
  return callback()
}

/**
 * 登录账号或密码校验
 * @param rule
 * @param value
 * @param callback
 */
const usernameVaild = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请输入账号'))
  }
  if (typeof codePass.value === 'boolean' && !codePass.value) {
    return callback(new Error(codeMsg.value))
  }
  return callback()
}


/**
 * 邮箱校验规则
 * @param rule
 * @param value
 * @param callback
 */
const emailCode = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请输入验证码'))
  }
  if (typeof codePass.value === 'boolean' && !codePass.value) {
    return callback(new Error(codeMsg.value))
  }
  return callback()
}

/**
 * 密码校验规则
 * @param rule
 * @param value
 * @param callback
 */
const newPassword = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请输入新密码'))
  }
  if (!pwdPass.value) {
    return callback(new Error())
  }
  return callback()
}

const loginImg = computed(() => {
  return new URL(
    process.env.NODE_ENV == 'development'
      ? '../../static/images/login-bg.png'
      : '/manage/static/images/login-bg.png',
    import.meta.url,
  ).href
})

/**
 * 校验规则
 */
const rules = reactive({
  username: [{ validator: usernameVaild, trigger: 'blur' }, { required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captchasCode: [{ validator: captchasCode, trigger: 'blur' }],
  email: [
    { validator: emailVaild, trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  emailCode: [{ validator: emailCode, trigger: 'blur' }],
  newPwd: [{ validator: newPassword, trigger: 'blur' }],
})
const updateCaptcha = () => {
  dispatch('getCaptcha')
}
/**
 * 点击忘记密码时
 */
function onRecoverPwd() {
  showRecoverPwdPanel.value = !showRecoverPwdPanel.value
  setHashCode()
}

/**
 * 设置hash值
 * @param code
 */
function setHashCode(code = 'sendEmail') {
  window.location.hash = ''
  window.location.hash = showRecoverPwdPanel.value
    ? window.location.hash + '#' + code
    : ''
}

/**
 * 获取codeBox结果
 */
async function onFinishEmailCode(verificationCode: string) {
  codePass.value = null
  loadingSend.value = true
  const params = {
    type: 'setPassword',
    uuid: codeUUid.value,
    value: loginForm.value.email,
    verificationCode,
  }
  const {
    data: res,
    code,
    msg,
  }: any = await checkVerificationCode(params).catch(() => {
    loadingSend.value = false
    codePass.value = false
    codeMsg.value = '接口请求错误'
    ruleForm.value.validate()
  })
  if (code === 200) {
    if (typeof res === 'boolean' && res) {
      forgotPwdStep.value.inputCode = false
      forgotPwdStep.value.inputPassword = true
      recoverPwdPanelRef.value.next()
      codePass.value = true
    } else {
      codePass.value = false
      codeMsg.value = '验证码错误'
      ruleForm.value.validate()
    }
  } else {
    codePass.value = false
    codeMsg.value = msg
    ruleForm.value.validate()
  }
  loadingSend.value = false
}

/**
 * 忘记密码业务
 */
function onForgotPwd(type?: string, account = undefined) {
  const isSendEmail = type === 'sendEmail'
  codePass.value = null
  ruleForm.value.validate(async (valid: any) => {
    if (valid) {
      const changePwdFunc = async () => {
        loadingSend.value = true
        const params: any = {
          sendEmail: {
            email: loginForm.value.email,
            sendType: 'email',
            type: 'setPassword',
            userExist: '1',
            userType: '1',
          },
          changePwd: {
            newPassword: loginForm.value.newPwd,
            reNewPassword: loginForm.value.newPwd,
            uuid: codeUUid.value,
            value: loginForm.value.email,
            sendType: 'email',
            verificationCode: loginForm.value.emailCode,
            account: account || undefined,
            userType: '1',
          },
        }
        const { data, code, msg }: any = await (
          isSendEmail ? verificationCode : setPasswordByVerificationCode
        )(params[type!], 'null').catch((err) => {
          loadingSend.value = false
          if (isSendEmail) {
            codeMsg.value = err.data.msg
            codePass.value = false
            ruleForm.value.validate()
          }
        })!
        loadingSend.value = false
        if (code === 200) {
          if (isSendEmail) {
            codeUUid.value = data
            forgotPwdStep.value[type] = false
            forgotPwdStep.value['inputCode'] = true
            recoverPwdPanelRef.value.next()
          } else {
            if (!isEmpty(data) && isArray(data)) {
              forgotPwdStep.value[type!] = false
              forgotPwdStep.value['selectAcc'] = true
              recoverPwdPanelRef.value.next()
              accountList.value = data
            } else {
              loginForm.value = {}
              router.back()
              ElMessage.success('密码重置成功，请登录')
            }
          }
        } else {
          if (isSendEmail) {
            codeMsg.value = msg
            codePass.value = false
            ruleForm.value.validate()
          }
        }
      }
      if (account) {
        ElMessageBox.confirm(`确定重置账号${account}的密码吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          changePwdFunc()
        })
      } else {
        changePwdFunc()
      }
    } else {
      return false
    }
  })
}

/**
 * 判断是否按下Tab键
 */
function onTabDown(e: any) {
  if (e.key === 'Tab') e.preventDefault()
}

/**
 * 登录表单提交
 */
async function submit() {
  const params: any = {
    username: loginForm.value.username,
    password: _.toUpper(Md5.hashStr(loginForm.value.password)),
  }
  if (store.state.needCaptcha) {
    params.captcha_header_code = loginForm.value.captchasCode
    params.captcha_header_key = store.state.needCaptcha.key
  }
  try {
    loading.value = true
    await dispatch('LoginAction', params)
    router.push({
      path: '/dashboard',
    })
  } catch (error: any) {
    codeMsg.value = error?.response?.data?.message || '登录失败'
    codePass.value = false
    ruleForm.value.validate()
    loading.value = false
    if (error?.response?.data?.code === 8000) { // 优化，密码错误情况再增加wrongTime数量
      const times = Number(Cookie.get('wrongTime')) || 0
      Cookie.remove('wrongTime')
      Cookie.set('wrongTime', String(times + 1), 1)
    }
  }
}

/**
 * 登录
 */
function login() {
  codePass.value = null
  ruleForm.value.clearValidate()
  // console.log('----------------------登录')
  ruleForm.value.validate((valid: any) => {
    if (valid) {
      const times = Number(Cookie.get('wrongTime')) || 0
      if (times > 5) {
        onShowVerify()
        return
      }
      submit()
    } else {
      return false
    }
  })
}

/**
 * 忘了干啥的
 * @param classname
 *
 */
function classProp(classname: string) {
  return `mg-${classname}`
}

function onInputCode(val: string) {
  if (val.length !== digit) {
    ruleForm.value?.clearValidate()
    codePass.value = codeMsg.value = null!
  }
}

/**
 * 密码校验返回
 * @param val
 */
function getBackResult(val: any) {
  pwdPass.value = val.value
  newPwdError.value = val.msg
}



/**
 * 小球随机移动
 * @param space
 * @param {Array<HTMLElement>} HTMLElement类型的元素数组
 */
function moveBall(space: any, ...args: Array<HTMLElement>) {
  const getRandomPosition = (max: any) => Math.floor(Math.random() * max)
  const [windowWidth, windowHeight] = [space?.offsetWidth, space?.offsetHeight]

  for (let e of args) {
    const eLeft = getRandomPosition(windowWidth - e?.clientWidth)
    const eTop = getRandomPosition(windowHeight - e?.clientHeight)
    e.style.left = `${eLeft}px`
    e.style.top = `${eTop}px`
  }
}

/**
 * 当验证码成功时
 * @param res
 */
function onVcodeSuccess(res: any) {
  setTimeout(() => {
    isVcodeShow.value = false
    submit()
  }, 500)
}

/**
 * 当验证码组件关闭时
 * @param res
 */
function onVcodeClose(res: any) {
  isVcodeShow.value = false
}

function onShowVerify() {
  isVcodeShow.value = true
}


/**
 * 去协议页
 * @param code
 */
function toProtocolPage(code: string) {
  const blankUrl = router.resolve({ name: 'SynProtocol', params: { code } })
  window.open(blankUrl.href, '_blank')
}

onMounted(async () => {
  const space = document.getElementById('login-right')!
  const l1Ball = document.getElementById('l1Ball')!
  const l2Ball = document.getElementById('l2Ball')!
  const l3Ball = document.getElementById('l3Ball')!
  moveBall(space, l1Ball, l2Ball, l3Ball)
  animateTimer.value = setInterval(val => moveBall(space, l1Ball, l2Ball, l3Ball), 5000)// 每隔1秒移动一次

  const disabledArea: any = document.getElementById('disabled-tab')
  loginImgPul.value = `${state.configs?.base || window.location.origin}/minio/public/login/background-management.png`
  const img: any = new Image()
  img.src = loginImgPul.value
  img.onerror = () => (loginImgPul.value = defaultLoginImgPul)
  // 监听键盘事件
  disabledArea?.addEventListener('keydown', (e: any) => {
    // 检查是否按下了 Tab 键
    if (e.key === 'Tab') {
      // 阻止默认行为
      e.preventDefault()
    }
  })
  // if (router.currentRoute.value.query.msg) {
  //   const msg: any = router.currentRoute.value.query.msg;
  //   ElMessage.error(msg);
  // }
  // getQrCode()
  // timer.value = setInterval(getQrCodeStatus, 2000);
  const getHashValue = () => {
    const hashValue = window.location.hash.substring(1)

    if (!hashValue) {
      forgotPwdStep.value = mapValues(forgotPwdStep.value, () => false)
      showRecoverPwdPanel.value = false
      loginForm.value = {}
      return
    }
    forgotPwdStep.value[hashValue] = showRecoverPwdPanel.value =
      stepsList.includes(hashValue)
  }
  getHashValue()
  window.addEventListener('hashchange', () => {
    // 当哈希值变化时，这里的代码会被执行
    getHashValue()
  })

  for (let key in state.microList) {
    await state.microList?.[key].unmount()
    delete state.microList[key]
  }
  if (route.query?.reload) {
    window.location.search = ''
  }
})

onUnmounted(() => {
  // 离开页面前销毁setInterval
  clearInterval(timer.value)
  clearInterval(animateTimer.value)
})
</script>

<style lang="scss" scoped>
#login {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-repeat: no-repeat !important;
  background-size: cover !important;
  background-position: center center;
  background-color: var(--main-primary);
}

// 响应式
@media screen and (max-width: 1100px) {

  // .logo-left {
  //   display: none
  // }
  .login-card {
    justify-content: unset !important;
  }

  .login-left {
    display: none !important;
  }

  .login-input {
    width: 100% !important;



    .bg-round-1 {
      display: flex;
      position: absolute;
      width: 1000px;
      height: 1000px;
      border-radius: 50%;
      background-color: var(--main-primary);
      top: -500px;
      right: -500px;
      overflow: hidden;

      .login-input-ui-image {
        opacity: 0.8;
      }
    }

    .bg-round-2 {
      position: absolute;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      background-color: var(--main-primary);
      bottom: -250px;
      left: -250px;
      overflow: hidden;
    }
  }

  // background-size: 100% 100% !important;
}

.login-bg {
  position: absolute;
  width: 100%;
  height: 100%;
}

.login-page {
  // width: 100%;
  // height: 100vh;
  // flex-shrink: 0;
  // overflow: hidden;
  // background-color: var(--el-color-primary);
  // position: absolute;
  // top: 0;
  // left: 0;

  :deep(.el-image) {
    height: 100%;

    img {
      object-position: left bottom;
      -o-object-position: left bottom;
    }

    // overflow: hidden;
  }
}

.el-form {
  .el-form-item {
    margin-bottom: 2rem;
  }
}

.qrcode-login {
  position: relative;
}

.isUnvalue {
  width: 100%;
  height: 100%;
  background-color: #ffffffe5;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;

  .unvalue-box {
    transition: all 0.3s ease;

    span {
      margin-left: 5px;
    }
  }
}

.isClick {
  &:hover {
    color: var(--main-primary);
  }
}

.qr-box {
  margin: 0 2rem 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-direction: column;

  .log {
    font-size: 12px;
  }
}

.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0 15px 0;

  .el-checkbox {
    display: flex;
    align-items: center;
  }
}

.login-card {
  width: 100%;
  height: 100%;
  // border-radius: 0 50px 0 50px;
  transition: all 0.3 ease-in-out;
  z-index: 1;
  // position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  // background-color: white;
  overflow: hidden;
  // box-shadow: 0px 20px 40px 0px rgba(16, 13, 128, 0.12);
  position: relative;

  .login-left {
    width: 40%;
    height: 100%;
    flex-shrink: 0;
    // background-color: var(--main-primary);
    position: relative;

    // display: flex;
    // flex-direction: column;
    // padding: 2.5rem 3.125rem;
    // box-sizing: border-box;

    .banner-ui-image {
      position: absolute;
      // bottom: 4rem;
    }

    .desc-info {
      p {
        font-size: 3vh;
        color: #ffffff;
        font-weight: 900;
        font-style: italic;
        text-shadow: 0 8px 12px rgba(0, 0, 0, 0.221);
      }

      .examp-row {
        margin-top: 1rem;

        .examp-row__item {
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          font-size: 3vh;
          font-weight: 500;
          line-height: 4vh;
          opacity: 0.8;
          color: #ffffff;

          .el-icon {
            margin-right: 1rem;
            font-size: 2.5vh;
          }
        }
      }


      position: absolute;
      top: -35%;
    }

    .logo {
      max-width: 260px;
      margin-top: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;

      h2 {
        color: #ffffff;
      }
    }

    .login-title,
    .login-title-sub,
    .left-footer {
      color: #ffffff;
    }

    .login-title {
      font-size: 34px;
      margin-top: 2.1875rem;
    }

    .login-title-sub {
      font-size: 16px;
      margin-top: 1.25rem;
    }

    .left-footer {
      position: absolute;
      bottom: 2.5rem;
    }
  }

  .login-input {
    width: 60%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-shrink: 0;
    background-color: #ffffff;
    position: relative;
    border-radius: 1rem 0 0 1rem;
  }

  .pc-login {
    width: 28rem;
    background-color: #ffffff49;
    box-shadow: 0px 20px 40px 0px rgba(16, 13, 128, 0.12);
    border-radius: .875rem;
    padding: 4rem 2rem 5.5rem 2rem;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
    backdrop-filter: blur(1.25rem);

    .panel-bottom {
      width: 100%;
      font-size: .875rem;
      height: .9375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      left: 0;
      bottom: 1.5rem;
      color: #727484;

      .el-button {
        margin: 0 0.3rem;
        padding: 0;
      }
    }
  }
}

.login-button {
  width: 100%;
  margin: 0.2rem 0;
  height: 48px;
  font-size: 16px;
  // border-radius: 8px;
}

.el-checkbox__label {
  font-weight: 400;
}

.el-tabs__nav-wrap::after {
  background-color: transparent;
}

.el-input__wrapper {
  //- #f2f3f5
  // border-radius: 8px;
  // background-color: #f2f3f5;
}

input[type='password']::-ms-reveal {
  display: none;
}

.el-divider__text.is-center {
  font-size: 12px;
  font-weight: 300;
  color: gray;
}

.el-tabs__active-bar {
  border-radius: 12px;
}

.el-checkbox__label {
  font-size: 12px;
  padding-left: 6px;
}

.el-card__body {
  padding: 0;
}

.el-tabs {
  margin: 20px;
}

.title-bar {
  // margin-left: 20px;
  // margin-top: 20px;
  font-size: 20px;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  color: #444444;
  display: flex;
  justify-content: center;
  margin-bottom: 2.5rem;
  // position: absolute;
  // top: 1.25rem;
  // left: 1.25rem;
}

.el-form {
  margin: 20px;
}

.el-button--text {
  font-weight: 400;
}

.code-box {
  display: flex;

  .el-input__inner {
    border-radius: 20px 0 0 20px;
  }

  .code {
    width: 40%;
    height: 38px;
    border: 1px solid #dcdfe6;
    border-left: none;
    // margin-left: 3px;
    border-radius: 0 5px 5px 0;
    flex-shrink: 0;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      user-select: none;
      cursor: pointer;
    }
  }
}

.change {
  z-index: 999;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 23px;
  cursor: pointer;
  opacity: 0.4;

  &:hover {
    opacity: 1;
  }

  img {
    width: 100%;
    height: 100%;
  }

  // .harf {
  //   width: 72px;
  //   height: 36px;
  //   background-color: rgb(255, 255, 255);
  //   position: absolute;
  //   right: 5px;
  //   top: 5px;
  //   transform: rotate(45deg);
  // }
}

.hide-checkbox {
  opacity: 0;
  pointer-events: none;
}

:deep(.el-carousel__container) {
  transition: all 0.3s ease;
}

.acc-check {
  width: 100%;
}

.acc-check-item {
  width: 100%;
  margin-bottom: 0.25rem;
  margin-right: 0;
  flex-shrink: 0;

  &:hover {
    // background-color: var(--el-fill-color-light);
  }

  :deep(.el-radio__input) {
    display: none;
  }
}

.light-bg {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 0;

  .l1,
  .l2,
  .l3,
  .l4 {
    border-radius: 50%;
    position: absolute;
    filter: blur(200px);
    transition: all 5s ease;
    opacity: 0.7;
  }



  .l1 {
    width: 10rem;
    height: 10rem;
    background-color: #00e5ff;
    top: 10%;
    left: 20%;
  }

  .l2 {
    width: 15rem;
    height: 15rem;
    background-color: #8800ffd1;
    right: 10%;
    bottom: 20%;
  }

  .l3 {
    width: 15rem;
    height: 15rem;
    background-color: #0633fc;
    right: 10%;
    top: 20%;
  }


}

.bottom-info {
  position: absolute;
  bottom: 1rem;
  opacity: 0.4;
  font-size: 14px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 1.8125rem;
  box-sizing: border-box;
}

.login-input-ui-image {
  width: 100%;
  opacity: 0;
  position: absolute;
  bottom: 0;
  pointer-events: none;
}

.bg-round-1 {
  position: absolute;
  display: none;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

.bg-round-2 {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}

.banner-swiper-box {
  width: 100%;
  height: 100%;
  position: absolute;
  // pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  // background-color: red;

  // background-color: green;
  .el-carousel {
    width: 100%;
    // background-color: red;
    overflow: unset;
  }

  .el-carousel__item {
    display: flex;
    justify-content: center;
    overflow: unset;
  }

  .el-image {
    object-fit: contain;
    flex-shrink: 0;
  }
}
</style>
