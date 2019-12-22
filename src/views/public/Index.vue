<template>
 <transition
        appear
        enter-active-class="animated fadeInUpBig"
        leave-active-class="animated fadeOutDownBig"
        mode="out-in"
    >
    <div class="echarts">
        <span class="tag-group__title" style="display: inline-block; color:orange;font-weight:600;margin: 0 80px 20px 10px">网站流量统计:</span>
       
         <el-tag
         v-for="(item,index) in items"
         :key="index"
         :type="item.type"
         effect="dark"
         style="margin-right:50px"
         >{{ item.label }}</el-tag>
        <div class="nav">
            <ul>
                <li class="bb"><span class="iconfont icon-dingdanliebiao1" style="font:50px/90px ''"></span> <p><i>home page</i><em>{{itemData[0]}}次</em></p></li>
                <li class="bb"><span class="iconfont icon-shangpinfenlei" style="font:50px/90px ''"></span><p><i> Category</i><em>{{itemData[1]}}次</em></p></li>
                <li class="bb"><span class="iconfont icon-shangpin" style="font:50px/90px ''"></span><p><i>merchandi </i><em>{{itemData[2]}}次</em></p></li>
                <li class="bb"><span class="iconfont icon-shangpin1" style="font:50px/90px ''"></span><p><i>commodity </i><em>{{itemData[3]}}次</em></p></li>
            </ul>
        </div>
        <br>
        <div id="myChart" :style="{width: '90%', height: '600px'}"></div>
        
    </div>
 </transition>
</template>
<script>
import {getEcharts,
// postImg
} from "@/api"
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
        itemData:[],
        items:[
            { type: "", label: "男性占60%" },
            { type: "danger", label: "女性占40%" }
        ],
        methods:{
            fun(){
                this.setOptionData.series.splice(0,1)
            }
        },
        setOptionData:{
            dataZoom: [
                 { //Y轴固定,让内容滚动
                        type: 'slider',
                        show: false,
                        xAxisIndex: [0],
                        start: 1,
                        end: 80,//设置X轴刻度之间的间隔(根据数据量来调整)
                        zoomLock: false, //锁定区域禁止缩放(鼠标滚动会缩放,所以禁止)
                    },
                    {
                        type: 'inside',
                        xAxisIndex: [0],
                        start: 1,
                        end: 80,
                        zoomLock: false, //锁定区域禁止缩放
                    },
            ],
            legend: {},
            tooltip: {},
            dataset: {
                source: [
                    ['product', '"首页"', '"分类"', '商品列表',"商品详情"],
                ]
            },
            xAxis: {type: 'category'},
            yAxis: {type: 'value'},
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: [
                {type: 'bar'},
                {type: 'bar'},
                {type: 'bar'},
                {type: 'bar'}
            ]
            
        }
    }
  },
  created(){
      getEcharts(2)
      .then(res=>{
           let tempData1=0;
           let tempData2=0;
           let tempData3=0;
           let tempData4=0;
            // this.setOptionData.dataset.source
            for(let key in res.data){
                let tempArr=[]
                tempArr[0]=key  
                res.data[key].forEach((item)=>{
                    tempArr.push(item.rp2_count)
                })
                tempData1+=tempArr[1]
                tempData2+=tempArr[2]
                tempData3+=tempArr[3]
                tempData4+=tempArr[4]
               this.setOptionData.dataset.source.push(tempArr)
            }
            this.itemData.push(tempData1)
            this.itemData.push(tempData2)
            this.itemData.push(tempData3)
            this.itemData.push(tempData4)
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('myChart'))
            // 绘制图表
            myChart.setOption(this.setOptionData);
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
        .nav{
            padding:20px 0;
            ul{
                display: flex;
                justify-content: space-around;
                li{
                    cursor: pointer;
                    border-radius: 5px;
                    box-shadow: 10px 10px 5px #888888;
                    background: #fff;
                    list-style: none;
                    height: 90px;
                    width: 200px;
                    span{
                        margin-left: 10px;
                        color: #40c9c6;
                    }
                    p{
                        float: right;
                        display: flex;
                        flex-direction: column;
                        text-align: center;
                        padding: 20px 20px 20px 0;
                        i{
                            color: #8c8c8c;
                        }
                        em{
                            padding: 10px 0;
                            font-weight:800;
                            color:#6a6a6a;
                        }
                    }
                }
                li:hover{
                    span{
                        margin: 10px ;
                        padding: 10px;
                        color: #fff;
                        background: #40c9c6;
                    }
                    
                }
            }
        }
       
}
.bb::before, .bb::after {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.bb {
  position: relative;
  color: #69ca62; //<---边框颜色 --!>
  box-shadow: inset 0 0 0 1px rgba(105, 202, 98, 0.5);
}
.bb::before, .bb::after {
  content: '';
  z-index: 1000;
  margin: -3%;
  border: 3px solid #40c9c6;
  box-shadow: inset 0 0 0 2px;
  animation: clipMe 8s linear infinite;
}
.bb::before {
  animation-delay: -4s;
}
@keyframes clipMe {
  0%{
    border-color: #B03060;
    clip: rect(0,210px,5px,0);
  }
  25%{
    border-color: #8B5A00;
    clip: rect(0,210px,100px,205px);
  }
  50%{
    border-color: 	#8B3E2F;
    clip: rect(105px,210px,210px,0);
  }
  75%{
    border-color: 	#EE0000;
    clip: rect(0,5px,100px,0);
  }
  100%{
    border-color: #CDCD00	;
    clip: rect(0,210px,5px,0);
  }

} 


 
   
</style>
