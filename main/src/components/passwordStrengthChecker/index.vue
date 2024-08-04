<template lang="pug">
.strength-judg
  .bar
    #topJudgeBox.top(v-if='mergedOptions.style.shape !== "text" && (mergedOptions.level.title.place === "tl") || (mergedOptions.level.title.place === "tr") ? true : false')
      el-icon.loading-judge(class="is-loading" v-if="mergedOptions.level.title.place === 'tr'" v-show="loadingJudge" size="16px" color="var(--main-info)")
        Loading
      span#level.level.text-black(v-if='mergedOptions.style.showLevel ? mergedOptions.style.showLevel : false' style="margin-top: 8px;") {{ mergedOptions.level ? (mergedOptions.level.title.content ? mergedOptions.level.title.content : "密码强度") : "密码强度" }}: {{ psdLevel || '待校验'}}
      el-icon.loading-judge(class="is-loading" v-if="mergedOptions.level.title.place === 'tl'" v-show="loadingJudge" size="16px" color="var(--main-info)")
        Loading
    #rateBorder.rate(ref='rate', v-if='mergedOptions.style.shape ? mergedOptions.style.shape == "load" : true')
      .percent(ref='percent')
    .divide(:id="'divide-border-' + uuid" v-if='mergedOptions.style.shape == "divide"')
      .divide-children(v-for='(item, index) in mergedOptions.divideNum',:key='index',:ref='setItemRef')
    #bottomJudgeBox.bottom(v-if='mergedOptions.style.shape !== "text" && ((mergedOptions.level.title.place === "bl") || (mergedOptions.level.title.place === "br")) ? true : false')
      el-icon.loading-judge(class="is-loading" v-if="mergedOptions.level.title.place === 'br'" v-show="loadingJudge" size="16px" color="var(--main-info)")
        Loading
      span#levelBottom.level.text-black(v-if='mergedOptions.style.showLevel ? mergedOptions.style.showLevel : false') {{ mergedOptions.level ? (mergedOptions.level.title.content ? mergedOptions.level.title.content : "密码强度") : "密码强度" }}: {{ psdLevel || '待校验'}}
      el-icon.loading-judge(class="is-loading" v-if="mergedOptions.level.title.place === 'bl'" v-show="loadingJudge" size="16px" color="var(--main-info)")
        Loading
    .text-rule-info(v-if='mergedOptions.style.shape == "text"')
      el-icon.success-icon(v-if="ruleLoading" class="is-loading" color="var(--el-color-info)")
        Loading
      .text-rule-item(v-else v-show="item?.status" v-for="(item, key, i) in ruleInfoObj" :key="key" :class="{'is-valuable': item.valuable }")
        el-icon.success-icon(style="margin-right: 0.5rem" :color="item.valuable ? 'var(--el-color-success)' : 'var(--el-color-info)'")
          SuccessFilled
        span {{ item.info.join('') }}
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch, onBeforeMount, nextTick } from 'vue'
import { every, merge } from 'lodash'
import { zxcvbn } from '@zxcvbn-ts/core'
import { Config, checkPasswordStrength } from '@/service/manage'
import { SuccessFilled, Loading } from '@element-plus/icons-vue'
import { useSessionStorage } from '@vueuse/core'

const props = defineProps({
  password: {
    type: String,
    default: '',
  },
  options: {
    type: Object,
    default: null,
  },
})

const emits: any = defineEmits()

const pwdRule = useSessionStorage('pwdRule', '')

const defaultOptions = computed(() => ({
  remote: false, // 接口校验
  rule: pwdRule.value || 'A/a/num/#/leng_6', // Aa:包含大小写 支持A或a单独设置; Num或num:包含数字; #:包含特殊字符; leng_8:leng表示长度 下划线数字表示最大字符串长度; A%:必须大写字母开头
  divideNum: 5, // 3: WEAK,AVERAGE,SECURE 4: WEAK,AVERAGE,SECURE,VERY_SECURE 5: VERY_WEAK,WEAK,AVERAGE,SECURE,VERY_SECURE
  style: {
    shape: 'text', // divide: 分段样式 load: 加载样式  text:文本提示
    showLevel: true, // 是否显示强度文本提示
    borderRadius: 0, // 圆角
    padding: '', // 内边距
    margin: '', // 边距
    height: '', // 整体高度
    rateHeight: '', // 分段或进度条高度
    color: ['#e84118', '#fbc531', '#4cd137', 'black', 'red'], // 自定义颜色 需大于等于dividNum
  },
  level: {
    title: {
      content: '密码强度', // 默认显示提示语
      place: 'tl', // tl: 上左 tr: 上右 bl: 下左 br: 下右
    }, // 默认密码强度
    levels: ['弱', '一般', '强', '很强', '非常强'], // 配合divideNum数量配置
  },
}))

const mergedOptions: any = computed(() => merge(defaultOptions.value, props.options))

const percentRefs: any = ref([])
const setItemRef = (el: any) => {
  if (el) {
    percentRefs.value.push(el)
  }
}
const uuid = ref()
const len = ref(0)
const psdLevel = ref('')
const levelNum = ref(0)
const ruleLeng = ref(0)
const ruleLoading = ref(false)
const warn = ref('')
const levels: any = computed(() => {
  return mergedOptions.value.level.levels
    ? mergedOptions.value.level?.levels.length === 3
      ? {
        2: mergedOptions.value.level.levels[2],
        1: mergedOptions.value.level.levels[1],
        0: mergedOptions.value.level.levels[0],
      }
      : mergedOptions.value.level.levels.length === 4
        ? {
          3: mergedOptions.value.level.levels[3],
          2: mergedOptions.value.level.levels[2],
          1: mergedOptions.value.level.levels[1],
          0: mergedOptions.value.level.levels[0],
        }
        : mergedOptions.value.level.levels.length === 5
          ? {
            4: mergedOptions.value.level.levels[4],
            3: mergedOptions.value.level.levels[3],
            2: mergedOptions.value.level.levels[2],
            1: mergedOptions.value.level.levels[1],
            0: mergedOptions.value.level.levels[0],
          }
          : {
            6: '非常安全',
            5: '安全',
            4: '很强',
            3: '强',
            2: '一般',
            1: '弱',
            0: '很弱',
          }
    : {
      6: '非常安全',
      5: '安全',
      4: '很强',
      3: '强',
      2: '一般',
      1: '弱',
      0: '很弱',
    }
})
const minLeng = ref(0)
const maxLeng = ref(0)
const sum = ref(0)
const pass = ref({
  num: 0,
  lower: 0,
  upper: 0,
  topUpper: 0,
  upper_lower: 0,
  leng: 0,
  other: 0,
  hasPwd: 0,
})
const defaultColor = ref(['red', 'orange', 'green'])
const ruleList = ref({})
const timer = ref()
const loadingJudge = ref(false)
const textRuleData = {
  Aa: '大小写字母',
  A: '大写字母',
  a: '字母',
  N: '数字',
  S: '特殊字符',
  L: '长度为',
  TU: '大写字母开头',
}

const percent = ref()

const ruleInfoObj = computed(() => {
  let obj = {}
  const must = '必须'
  const mustInclued = '必须包含'
  const ruleText: any = []
  const ruleValuable: any = []
  const headText: any = []
  const headValuable: any = []
  const lengText: any = []
  const lengValuable: any = []
  const _rule = mergedOptions.value.rule
  const _ruleArr = _rule.split('/')
  // obj[must + ruleText.join('、')] = true

  // 大小写字母 数组 特殊字符
  if (
    _rule.indexOf('Aa') > -1 ||
    (_rule.indexOf('A') > -1 && _rule.indexOf('a') > -1)
  ) {
    ruleText.push(textRuleData.Aa)
    ruleValuable.push(
      pass.value.upper_lower || pass.value.upper & pass.value.lower,
    )
  } else {
    if (_rule.indexOf('A') > -1) {
      ruleText.push(textRuleData.A)
      ruleValuable.push(pass.value.upper)
    }
    if (_rule.indexOf('a') > -1) {
      ruleText.push(textRuleData.a)
      ruleValuable.push(pass.value.lower)
    }
  }
  if (_rule.indexOf('Num') > -1 || _rule.indexOf('num') > -1) {
    ruleText.push(textRuleData.N)
    ruleValuable.push(pass.value.num)
  }
  if (_rule.indexOf('#') > -1) {
    ruleText.push(textRuleData.S)
    ruleValuable.push(pass.value.other)
  }
  if (ruleText.length) {
    for (let i = 1; i < ruleText.length; i += 2) ruleText.splice(i, 0, '、')
    ruleText.unshift(mustInclued)
  }

  // 大写字母开头
  if (_rule.indexOf('A%') > -1) {
    headText.push(textRuleData.TU)
    headValuable.push(pass.value.topUpper)
  }
  if (headText.length) ruleText.unshift(must)

  // 长度为～
  if (_rule?.indexOf('leng') > -1) {
    lengText.push(textRuleData.L)
    for (const val of _ruleArr) {
      if (val.indexOf('leng') > -1) {
        const _a = val.split('leng_')
        if (_a?.[1]?.indexOf('-') > -1) {
          const leng = _a[1].split('-')
          lengText.push(...[leng[0], '-', leng[1], '位', '字符'])
        } else lengText.push(...[_a[1], '位', '或更多', '字符'])
      }
    }
    lengValuable.push(pass.value.leng)
  }
  obj = {
    ruleText: {
      status: !!ruleText?.length,
      valuable: every(ruleValuable),
      info: ruleText,
    },
    headText: {
      status: !!headText?.length,
      valuable: every(headValuable),
      info: headText,
    },
    lengText: {
      status: !!lengText?.length,
      valuable: every(lengValuable),
      info: lengText,
    },
  }
  return obj
})

onBeforeMount(() => {
  const _uuid: any = String(Math.random() * 100000000000)
  uuid.value = Math.floor(_uuid)
})

onMounted(() => {
  getPwdRule()
  if (mergedOptions.value.style.shape !== 'text') {
    if (mergedOptions.value.style.shape === 'divide') {
      const children: any = (
        document.getElementById('divide-border-' + uuid.value) as any
      ).children
      for (const key of children) {
        key.style.borderColor = mergedOptions.value.style.borderColor
        key.style.height = mergedOptions.value.style.rateHeight
          ? `${mergedOptions.value.style.rateHeight}px`
          : '10px'
      }
    } else {
      const rateBorder: any = document.getElementById('rateBorder')
      rateBorder.style.borderColor = mergedOptions.value.style.borderColor
      rateBorder.style.height = mergedOptions.value.style.rateHeight
        ? `${mergedOptions.value.style.rateHeight}px`
        : '10px'
    }
    if (mergedOptions.value.style.color) {
      if (
        mergedOptions.value.divideNum > mergedOptions.value.style.color.length
      ) {
        console.warn('颜色配置数量不够,请检查', mergedOptions.value)
      }
    }

    const bar: any = document.getElementById('bar')

    if (mergedOptions.value.style.borderRadius) {
      bar.style.borderRadius = `${mergedOptions.value.style.borderRadius}px`
    }
    if (mergedOptions.value.style.padding) {
      bar.style.padding = `${mergedOptions.value.style.padding}`
    }
    if (mergedOptions.value.style.padding) {
      bar.style.margin = `${mergedOptions.value.style.margin}`
    }
    if (mergedOptions.value.style.height) {
      bar.style.height = `${mergedOptions.value.style.height ? mergedOptions.value.style.height : '100px'}`
    }

    const level: any = document.getElementById('topJudgeBox')
    const levelBottom: any = document.getElementById('bottomJudgeBox')
    if (
      mergedOptions.value.style.showLevel &&
      mergedOptions.value.style.showLevel === true
    ) {
      if (
        mergedOptions.value.level.title.place === 'tl' ||
        mergedOptions.value.level.title.place === 'tr'
      ) {
        if (mergedOptions.value.level.title.place === 'tl')
          level.style.justifyContent = 'left'
        if (mergedOptions.value.level.title.place === 'tr')
          level.style.justifyContent = 'right'
      }
      if (
        mergedOptions.value.level.title.place === 'bl' ||
        mergedOptions.value.level.title.place === 'br'
      ) {
        if (mergedOptions.value.level.title.place === 'br')
          levelBottom.style.justifyContent = 'right'
        if (mergedOptions.value.level.title.place === 'bl')
          levelBottom.style.justifyContent = 'left'
      }
    }
  }
  // document.getElementsByClassName('border').style.borderColor = mergedOptions.value.style.borderColor
  // console.log(mergedOptions.value == null ? 'Aa/Num/#/leng_8' : mergedOptions.value.rule)
})

/**
 * 返回结果
 */
function getLevel() {
  emits('judge-result', levelNum.value + 1)
}

function level() {
  const s = sum.value
  if (mergedOptions.value && mergedOptions.value.divideNum > 0) {
    const percentArr: any = []
    const transStr = 'all 0.5s ease-in-out'
    const defaultBgColor = '#efefef'
    const levelScope = {
      load: !mergedOptions.value.remote
        ? {
          3: s < 1.5 ? 0 : s < 4.5 ? 1 : 2,
          4: s < 1.5 ? 0 : s < 3 ? 1 : s < 4.5 ? 2 : 3,
          5: s < 1 ? 0 : s < 2.5 ? 1 : s < 4 ? 2 : s < 4.8 ? 3 : 4,
        }
        : {
          3: s <= 3 ? 0 : s <= 6 ? 1 : 2,
          4: s <= 3 ? 0 : s <= 6 ? 1 : s <= 9 ? 2 : 3,
          5: s <= 2 ? 0 : s <= 6 ? 1 : s <= 9 ? 2 : s <= 12 ? 3 : 4,
        },
      divide: !mergedOptions.value.remote
        ? {
          3: s < 2 ? 0 : s < 4.8 ? 1 : 2,
          4: s < 2 ? 0 : s < 3.5 ? 1 : s < 4.5 ? 2 : 3,
          5: s < 2 ? 0 : s < 2.5 ? 1 : s < 3.5 ? 2 : s < 4.5 ? 3 : 4,
        }
        : {
          3: s <= 3 ? 0 : s <= 6 ? 1 : 2,
          4: s <= 3 ? 0 : s <= 6 ? 1 : s <= 9 ? 2 : 3,
          5: s <= 2 ? 0 : s <= 6 ? 1 : s <= 9 ? 2 : s <= 12 ? 3 : 4,
        },
    }
    //   密码强度显示效果为load时 执行以下代码
    switch (mergedOptions.value.style.shape) {
      case 'load':
        switch (mergedOptions.value.divideNum) {
          case 3:
          case 4:
          case 5:
            loadJudge(levelScope)
            break
        }
        break
      case 'divide':
        //   密码强度显示效果为divide时 执行以下代码
        for (let i = 0; i < mergedOptions.value.divideNum; i++) {
          percentArr.push(percentRefs.value[i])
        }
        switch (mergedOptions.value.divideNum) {
          case 3:
            divideJudge(percentArr, levelScope, transStr, defaultBgColor, s)
            break
          case 4:
            divideJudge(percentArr, levelScope, transStr, defaultBgColor, s)
            break
          case 5:
            divideJudge(percentArr, levelScope, transStr, defaultBgColor, s)
            break
        }
        break
    }
  }
}

/**
 * divide模式的等级渲染
 * @param percentArr
 * @param levelScope
 * @param transStr
 * @param defaultBgColor
 * @param s
 */
function divideJudge(
  percentArr: any,
  levelScope: any,
  transStr: any,
  defaultBgColor: any,
  s: any,
) {
  for (let j = 0; j < mergedOptions.value.divideNum; j++) {
    percentArr[j].style.backgroundColor = mergedOptions.value.style.color
      ? mergedOptions.value.style.color[j]
      : defaultColor.value[j]
    percentArr[j].style.transition = transStr
  }
  levelNum.value = levelScope.divide[mergedOptions.value.divideNum]
  for (
    let i = levelScope.divide[mergedOptions.value.divideNum];
    i < percentArr.length - 1;
    i++
  ) {
    percentArr[i + 1].style.backgroundColor = defaultBgColor
  }
  if (s === 0) {
    percentArr[0].style.backgroundColor = defaultBgColor
  }
}

/**
 * load模式的等级渲染
 * @param levelScope
 */
function loadJudge(levelScope: any) {
  percent.value.style.backgroundColor = mergedOptions.value.style.color
    ? mergedOptions.value.style.color[
    levelScope.load[mergedOptions.value.divideNum]
    ]
    : defaultColor.value[levelScope.load[mergedOptions.value.divideNum]]
  levelNum.value = levelScope.load[mergedOptions.value.divideNum]
}

// 计算密码强度 返回一个Number类型
async function initPass(val: any) {
  // alert(mergedOptions.value.remote)
  if (!mergedOptions.value.remote) {
    clear()
    ruleList.value = {
      type: '',
      msg: '',
      value: true,
    }
    const zxData = zxcvbn(val)
    // console.log(zxData)
    if (props.password) {
      pass.value.hasPwd = 0.01
    }
    const ruleArr = mergedOptions.value.rule.split('/')
    ruleLeng.value = ruleArr.length
    for (const key of ruleArr) {
      // 密码长度
      if (key.indexOf('leng_') >= 0) {
        const lengArr = key.split('_')
        const lengNumArr = lengArr[1].split('-')
        if (lengNumArr[1] === undefined) {
          if (val.length >= Number(lengNumArr[0])) {
            pass.value.leng = 1
          } else {
            pass.value.leng = 0
            ruleList.value = {
              type: `leng_${lengNumArr[0]}`,
              msg: `密码长度至少为${lengNumArr[0]}`,
              value: false,
            }
          }
        } else {
          if (
            val.length >= Number(lengNumArr[0]) &&
            val.length <= Number(lengNumArr[1])
          ) {
            pass.value.leng = 1
          } else {
            pass.value.leng = 0
            ruleList.value = {
              type: `leng_${lengNumArr[0]}-${lengNumArr[1]}`,
              msg: `密码长度必须在${lengNumArr[0]}到${lengNumArr[1]}之间`,
              value: false,
            }
          }
        }
      }
      // 大写开头
      if (key.indexOf('A%') >= 0) {
        const reg = /^[A-Z]/g
        if (reg.test(val) === true) {
          pass.value.topUpper = 1
        } else {
          pass.value.topUpper = 0
          ruleList.value = {
            type: 'A%',
            msg: '必须大写字母开头',
            value: false,
          }
        }
        // 包含大小写
      } else if (key.indexOf('Aa') >= 0) {
        const reg = /[A-Z]/g
        const _reg = /[a-z]/g
        if (reg.test(val) === true && _reg.test(val) === true) {
          pass.value.upper_lower = 1
        } else {
          pass.value.upper_lower = 0
          ruleList.value = {
            type: 'Aa',
            msg: '必须包含大小写',
            value: false,
          }
        }
        // 包含特殊符号
      } else if (key.indexOf('#') >= 0) {
        const reg = /[`~!@#$%^&*_+<>{}'"/\\\\[\]]/g
        if (reg.test(val) === true) {
          pass.value.other = 1
        } else {
          pass.value.other = 0
          ruleList.value = {
            type: '#',
            msg: '必须包含特殊符号(~!@#$%^&*_+<>{})',
            value: false,
          }
        }
        // 仅包含大写
      } else if (key.indexOf('A') >= 0) {
        const reg = /[A-Z]/g
        if (reg.test(val) === true) {
          pass.value.upper = 1
        } else {
          pass.value.upper = 0
          ruleList.value = {
            type: 'A',
            msg: '必须包含大写字母',
            value: false,
          }
        }
        // 仅包含小写
      } else if (key.indexOf('a') >= 0) {
        const reg = /[a-z]/g
        if (reg.test(val) === true) {
          pass.value.lower = 1
        } else {
          pass.value.lower = 0
          ruleList.value = {
            type: 'a',
            msg: '必须包含小写字母',
            value: false,
          }
        }
        // 包含数字
      } else if (key.indexOf('Num') >= 0 || key.indexOf('num') >= 0) {
        const reg = /[0-9]/g
        if (reg.test(val) === true) {
          pass.value.num = 1
        } else {
          pass.value.num = 0
          await nextTick()
          ruleList.value = {
            type: 'Num',
            msg: '必须包含数字',
            value: false,
          }
        }
      }
    }
    len.value =
      pass.value.num +
      pass.value.lower +
      pass.value.upper +
      pass.value.other +
      pass.value.leng +
      pass.value.upper_lower +
      pass.value.topUpper +
      pass.value.hasPwd
    sum.value = len.value / ruleLeng.value + zxData.score
  } else {
    if (!val) {
      sum.value = 0
      psdLevel.value = ''
      loadingJudge.value = false
      clear()
    } else await getPwdStrengthByAfterEnd(val)
  }
  setScore(val)
}

// 接口获取密码校验强度
function getPwdStrengthByAfterEnd(pwd: any) {
  const judge = (str: string) => {
    pass.value.upper = str.indexOf('A') > -1 ? 1 : 0
    pass.value.lower = str.indexOf('a') > -1 ? 1 : 0
    pass.value.num = str.indexOf('num') > -1 ? 1 : 0
    pass.value.upper_lower =
      str.indexOf('A') > -1 && str.indexOf('a') > -1 ? 1 : 0
    pass.value.other = str.indexOf('#') > -1 ? 1 : 0
    pass.value.topUpper = str.indexOf('A%') > -1 ? 1 : 0
    const lengArr = mergedOptions.value?.rule
      ?.split('leng_')?.[1]
      ?.split('-')
      .map(Number)
    const leng = Number(str?.split('leng_')?.[1] || 0)
    pass.value.leng =
      leng >= lengArr?.[0] && (lengArr?.[1] ? leng <= lengArr?.[1] : true)
        ? 1
        : 0
  }
  // EASY, MIDIUM, STRONG, VERY_STRONG, EXTREMELY_STRONG
  let rule = mergedOptions.value.rule.replace('Num', 'num')
  rule = rule.replace(/(leng_\d+)-\d+/g, '$1')
  const params = {
    password: pwd,
    passwordRule: rule,
  }
  return checkPasswordStrength(params)
    .then((r) => {
      ruleList.value = {}
      loadingJudge.value = false
      if (r.code === 200) {
        ruleList.value = {
          type: '',
          msg: r.data.passwordLevel !== 'EASY' ? '' : '密码过于简单',
          value:
            r.data?.ok !== undefined
              ? r.data?.ok
              : r.data.passwordLevel !== 'EASY',
        }
        if (mergedOptions.value.style.shape === 'text')
          judge(r.data.passwordStr)
        sum.value = r.data.passwordStrength
        // }
      } else {
        sum.value = 0
      }
    })
    .catch((err) => {
      console.error(err)
      loadingJudge.value = false
    })
}

// 防抖,当用户不再输入密码时调用接口
function debounce(fn: any, delay: any) {
  if (timer.value !== null) {
    clearTimeout(timer.value)
  }
  timer.value = setTimeout(() => {
    fn.call()
  }, delay)
}

// 清空所有计算值
function clear() {
  pass.value.num =
    pass.value.lower =
    pass.value.upper =
    pass.value.other =
    pass.value.upper_lower =
    pass.value.topUpper =
    pass.value.leng =
    pass.value.hasPwd =
    len.value =
    0
}
// 通过密码分数渲染等级字符串(如：'弱'、'强'等) 并渲染load模式先的进度条
async function setScore(pwd: any) {
  // document.getElementById('score').innerHTML =
  //   // '评分：' + this.score() +
  //   ' 等级：' + levels.value[this.level()]
  level()
  psdLevel.value = pwd ? levels.value[levelNum.value] || levels.value : ''
  await nextTick()
  if (mergedOptions.value.style.shape === 'load') {
    percent.value.style.width = (sum.value / 5) * 100 + '%'
    percent.value.style.transition = 'all 0.5s ease-in-out'
  }
  // else if (mergedOptions.value.style.shape === 'divide') {
  //   console.log('123321')
  // }
}

function getPwd(pwd: any) {
  if (mergedOptions.value.remote) {
    loadingJudge.value = true
    debounce(async () => {
      initPass(pwd)
    }, 500)
  } else {
    initPass(pwd)
  }
}

async function getPwdRule() {
  if (pwdRule.value) return
  ruleLoading.value = true
  const params = {
    code: 'managePasswordRule'
  }
  const { data: res, code, msg }: any = await Config.getSystemConfig(params).catch(() => {
    ruleLoading.value = false
  })
  ruleLoading.value = false
  if (code === 200) {
    pwdRule.value = res.value
  }
}

watch(
  () => props.password,
  (val) => {
    getPwd(val)
  },
)

watch(psdLevel, () => {
  getLevel()
})

watch(ruleList, (val) => {
  // console.log('ruleList', val)
  emits('back-rules', val)
})

watch(levelNum, (val) => {
  console.log('levelNum', val)

  emits('back-rules', val)
})
</script>

<style lang="scss" scoped>
.strength-judg {
  width: 100%;

  .warn {
    font-size: 0.75rem;
  }

  .bar {
    .top {
      display: flex;
      align-items: center;

      .loading-judge {
        margin: 8px 4px 0 4px;
      }
    }

    .bottom {
      display: flex;

      .loading-judge {
        margin: 0 4px;
      }
    }

    // width: 100%;
    // overflow: hidden;
    // display: flex;
    // align-items: center;
    background-color: transparent;
    box-sizing: border-box;

    .level {
      box-sizing: border-box;
      font-size: 0.75rem;
    }

    .divide {
      display: flex;
      width: 100%;
      padding: 0.5rem 0;

      .divide-children {
        // border: 1px solid transparent;
        border-radius: 10px;
        width: 100%;
        margin-right: 0.75rem;
        background-color: #efefef;

        &:last-child {
          margin-right: 0;
        }
      }
    }

    .rate {
      display: flex;
      width: 100%;
      margin: 0.5rem 0;
      border: 1px solid transparent;
      justify-content: space-between;
      background-color: #efefef;
      border-radius: 10px;

      .percent {
        border-radius: 10px;
        width: 0%;
        height: 100%;
      }
    }
  }

  .text-rule-info {
    padding: 0.5rem;
    font-size: 0.875rem !important;

    .text-rule-item {
      opacity: 0.5;
      display: flex;
      align-items: center;

      &:last-child {
        margin: 0;
      }
    }
  }

  .is-valuable {
    opacity: 1 !important;
    // color: $success;
  }
}
</style>