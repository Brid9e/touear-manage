<template lang='pug'>
#DashBar 
  v-chart.dash-charts(:option='option', :autoresize='true')
</template>
<script lang='ts' setup>
import { ref, onMounted, computed, watch } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components';
import { cloneDeep, flowRight, orderBy } from 'lodash';

use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])


const props = defineProps({
  data: {
    type: Object,
    default: {}
  }
})

const option = computed(() => {
  const _opt = optionOrg.value
  let _data = cloneDeep(props.data)
  let _arr = orderBy(Object.keys(_data).map((key: any) => {
    return { key: key, value: _data[key] }
  }), ['value'], ['desc'])
  _data = {}
  for (let val of _arr) _data[val.key] = val.value
  _opt.series.data = Object.values(_data)
  _opt.xAxis.data = Object.keys(_data)
  return _opt
})

const optionOrg: any = ref({
  animation: true,
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    // icon: 'circle',
    // top: 5,
    // right: 32,
    // textStyle: {
    //   color: '#0C8BFF'
    // }
  },
  grid: {
    top: 32,
    left: 16,
    right: 16,
    bottom: 16,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: true,
    data: [],
    axisLabel: {
      color: '#ffffff',
      // formatter: function (value) {
      //   return value.length > 2 ? value.substring(0, 2) + '...' : value
      // }
      padding: [5, 0, 0, 0]
    },
    axisTick: {
      show: false // 不显示坐标轴刻度线
    },
    axisLine: {
      show: false,
      lineStyle: {
        color: '#ffffff',
        width: 0
      }
    }
  },
  // 纵坐标样式
  yAxis: {
    type: 'value',
    // nameTextStyle: {
    //   //
    // },
    axisLabel: {
      color: '#ffffff'
      // formatter: '{value} 人次'
    },
    splitLine: {
      lineStyle: {
        color: ['#ffffff'],
        width: 0,
        type: 'dashed'
      }
    }
  },
  series: {
    // name: '客流量',
    type: 'bar',
    color: {
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: '#d2d2ff' // 0% 处的颜色
        },
        {
          offset: 1,
          color: '#3c39ab'
        }
      ]
    },
    stack: 'Total',
    emphasis: {
      focus: 'series'
    },
    tooltip: {
      // valueFormatter: function (value) {
      //   return value + ' 人次'
      // }
    },
    data: [],
    // label: {
    //   show: true,
    //   position: 'top'
    // },
    barWidth: 8, // 柱子宽度
    itemStyle: {
      normal: {
        // 这里设置柱形图圆角 [左上角，右上角，右下角，左下角]
        barBorderRadius: [10, 10, 10, 10]
      }
    }
  },
})

</script>
<style lang='scss' scoped>
#DashBar {
  height: 100%;
}
</style>