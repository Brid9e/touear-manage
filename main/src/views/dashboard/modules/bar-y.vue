<template lang='pug'>
#DashBarY 
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
import { cloneDeep, orderBy } from 'lodash';

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
  _data = orderBy(_data, ['value'], ['asc'])
  _opt.series.data = Object.values(_data)
  _opt.yAxis.data = Object.keys(props.data).map((key: any) => {
    return props.data[key].name
  })
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
    left: 32,
    right: 32,
    bottom: 26,
    containLabel: true
  },
  xAxis: {
    type: 'value',
    boundaryGap: true,
    data: [],
    axisLabel: {
      color: '#ffffff',
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
    },
    splitLine: {
      show: false // 不显示网格线
    },
  },
  // 纵坐标样式
  yAxis: {
    type: 'category',
    // nameTextStyle: {
    //   //
    // },
    axisTick: {
      show: false // 不显示坐标轴刻度线
    },
    axisLabel: {
      color: '#ffffff',
      // formatter: '{value} 人次'
      padding: [0, 10, 0, 0]
    },
    axisLine: {
      show: false,
      lineStyle: {
        color: '#ffffff',
        width: 0
      }
    },
    splitLine: {
      show: false,
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
      colorStops: [
        {
          offset: 0,
          color: '#3c39ab' // 0% 处的颜色
        },
        {
          offset: 1,
          color: '#d2d2ff'
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
#DashBarY {
  height: 100%;
}
</style>