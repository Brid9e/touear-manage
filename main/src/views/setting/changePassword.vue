<script lang='ts' setup>
import { ref, reactive } from 'vue'
import { key } from '@/store'
import { useStore } from 'vuex'
import PasswordStrengthChecker from '@/components/passwordStrengthChecker/index.vue'
import CodeInput from '@/components/codeInput.vue'
import { verificationCode, checkVerificationCode, setPasswordByVerificationCode } from '@/service/manage'
import { ElMessage } from 'element-plus'

const store = useStore(key)
const { state } = store

const form = ref({
  email: '',
  verificationCode: '',
  newPassword: '',
  reNewPassword: '',
})

const cd = ref(0)
const timer = ref()
const sendLoading = ref(false)
const submitLoading = ref(false)
const uuid = ref('')
const pwdPass = ref(false)
const ruleForm = ref()

/**
 * 校验邮箱合法性
 * @param rule
 * @param value
 * @param callback
 */
const verificationCodeVaild = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请输入验证码'))
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

/**
 * 确认密码校验
 * @param rule
 * @param value
 * @param callback
 */
const reNewPassword = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请再次输入新密码'))
  }
  if (value !== form.value.newPassword) {
    return callback(new Error('两次输入密码不一致!'))
  }
  return callback()
}

/**
 * 校验规则
 */
const rules = reactive({
  verificationCode: [{ validator: verificationCodeVaild, trigger: 'blur' }],
  newPassword: [{ validator: newPassword, trigger: 'blur' }],
  reNewPassword: [{ validator: reNewPassword, trigger: 'blur' }],
})

/**
 * 发送验证码
 */
async function sendEmail() {
  if (cd.value > 0) return
  sendLoading.value = true
  const params = {
    email: state.userInfo?.email,
    sendType: 'email',
    type: 'setPassword',
    userExist: '1',
    userType: '1',
  }
  const { data: res, code, msg }: any = await verificationCode(params, 'messageBox').catch(() => {
    sendLoading.value = false
  })
  sendLoading.value = false
  if (code === 200) {
    cd.value = 60
    uuid.value = res
    timer.value = setInterval(() => {
      cd.value--
      if (cd.value < 0) {
        clearInterval(timer.value)
      }
    }, 1000)
  }
}

/**
 * 修改密码
 */
async function changePassword() {
  submitLoading.value = true
  const params = {
    newPassword: form.value.newPassword,
    reNewPassword: form.value.reNewPassword,
    uuid: uuid.value,
    value: state.userInfo?.email,
    sendType: 'email',
    verificationCode: form.value.verificationCode,
    account: state.userInfo?.account || undefined,
    userType: '1',
  }
  const { data: res, code, msg }: any = await setPasswordByVerificationCode(params, 'messageBox').catch(() => {
    submitLoading.value = false
  })
  submitLoading.value = false
  if (code === 200) {
    ElMessage.success('修改成功，请重新登录')
    store.dispatch("LogoutAction")
  }
}

/**
 * 获取密码强度校验结果
 * @param res
 */
function getBackResult(res: any) {
  pwdPass.value = res.value
}

/**
 * 提交
 */
function onSubmit() {
  ruleForm.value.validate((valid: any) => {
    if (valid) {
      changePassword()
    }
  })
}

</script>
<template lang='pug'>
.change-password
  el-form(:model="form" label-width="80px" :rules="rules", ref="ruleForm" @submit.native.prevent)
    el-form-item(label="邮箱")
      span {{ state.userInfo?.email }}
    el-form-item(label="验证码" prop="verificationCode")
      //- .code-box
        CodeInput(v-model="form.verificationCode" :digit="6")
      el-input(v-model="form.verificationCode" :maxLength="6" placeholder="请输入6位验证码")
        template(#suffix)
          el-button(type="primary" link :loading="sendLoading" @click="sendEmail" :disabled="cd > 0") {{cd > 0 ? `${cd}s后可重试`: '发送邮箱验证码'}}
    el-form-item(label="新密码" prop="newPassword")
      el-input(v-model="form.newPassword" type="password" show-password placeholder="请输入密码")
      PasswordStrengthChecker(:password="form.newPassword" @back-rules="getBackResult")
    el-form-item(label="确认密码" prop="reNewPassword")
      el-input(v-model="form.reNewPassword" type="password" show-password placeholder="请再次输入密码")
    el-form-item
      el-button(type="primary" @click="onSubmit" :loading="submitLoading") 确认修改
</template>
<style lang='scss' scoped>
.change-password {
  max-width: 40%;
  min-width: 23.75rem;

  .code-box {
    width: 17.5rem;
  }
}
</style>