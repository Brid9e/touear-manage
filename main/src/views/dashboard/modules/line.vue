<template lang='pug'>
#DashLine
  v-chart.dash-charts(:option='option', :autoresize='true')
</template>
<script lang='ts' setup>
import { ref, onMounted, computed, watch } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components';

use([
  CanvasRenderer,
  LineChart,
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
  const _opt: any = optionOrg.value
  _opt.series.data = Object.values(props.data)
  _opt.xAxis.data = Object.keys(props.data)
  return _opt
})

const optionOrg = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  // 布局
  grid: {
    // show: false,
    // z: 0,
    top: 16,
    left: 40,
    right: 16,
    bottom: 40
    // containLabel: true
  },
  // 上面两个控制显示折现的按钮样式
  legend: {
    data: [],
    // top: 5,
    // right: 32,
    // textStyle: {
    //   color: '#0c8aff'
    // }
  },
  // 横坐标样式
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [],
    axisLabel: {
      color: '#ccc',
      padding: [10, 0, 0, 0],
      formatter: (value: any) => {
        return value + '日'
      }
    },
    axisTick: {
      show: false // 不显示坐标轴刻度线
    },
    axisLine: {
      show: false,
      lineStyle: {
        color: 'rgba(30, 89, 167, 0.3)',
        width: 0
      },
      symbolSize: [10, 15]
    }
  },

  // 纵坐标样式
  yAxis: {
    type: 'value',
    axisLabel: {
      color: '#ccc',
      onZero: false,
      padding: [0, 10, 0, 0]
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#ccc'],
        width: 0.3,
        type: 'dashed'
      }
    }
  },
  // 数据
  series: {
    data: [],
    type: 'line',
    smooth: true,
    name: '',
    symbol: 'none',
    itemStyle: {
      color: '#504cde'
    },
    areaStyle: { // 面积图颜色设置
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
// 
        colorStops: [
          {
            offset: 0,
            color: '#504cde' // 0% 处的颜色
          },
          {
            offset: 1,
            color: 'rgba(51, 118, 255, 0)'
          }

        ],
        globalCoord: false // 缺省为 false
      }
    },
    tooltip: {
      // valueFormatter: function (value) {
      //   return value + ' 人次'
      // }
    }
  }
})

</script>
<style lang='scss' scoped>
#DashLine {
  height: 100%;
}
</style>