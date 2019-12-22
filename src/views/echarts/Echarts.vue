<template>
 <transition
        appear
        enter-active-class="animated fadeInUpBig"
        leave-active-class="animated fadeOutDownBig"
        mode="out-in"
    >
    <div class="echarts">
        <h2>数据统计</h2>
        <div id="myChart" :style="{width: '900px', height: '500px'}"></div>
    </div>
 </transition>
</template>

<script>
import {getEcharts} from "@/api"
// 引入基本模板
// let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  name: 'hello',
  data () {
    return {
    }
  },
  created(){
      getEcharts(1)
      .then(res=>{
          if(res.meta.status!==200) return
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('myChart'))
            // 绘制图表
            myChart.setOption({
                tooltip: {
                },
                xAxis: {
                    data: res.data.xAxis[0].data
                },
                yAxis: {
                //  type :"value"
                },
                series: res.data.series
            });
      })
  },
}
</script>

<style scoped lang="scss">
    .echarts{
        #myChart{
            margin: 0 auto
        }
        h2{
            text-align: center
        }
    }
</style>
