import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//导入全局的样式配置
import '@/assets/css/reset.scss'
import './assets/Iconfont/iconfont.css'
// 粒子特效
import VueParticles from 'vue-particles'
Vue.use(VueParticles)


// 新手引导
import Driver from 'driver.js'
import 'driver.js/dist/driver.min.css'
Vue.prototype.$driver = new Driver({
  doneBtnText: '完成', // Text on the final button
  closeBtnText: '关闭', // Text on the close button for this step
  stageBackground: '#fff', // Background color for the staged behind highlighted element
  nextBtnText: '下一步', // Next button text for this step
  prevBtnText: '上一步', // Previous button text for this step
})
// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  easing: 'ease', // 动画方式    
  speed: 500, // 递增进度条的速度    
  showSpinner: false, // 是否显示加载ico    
  trickleSpeed: 200, // 自动递增间隔    
  minimum: 0.3 // 初始化时的最小百分比
})


  // echarts  图表
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

import animate from 'animate.css';
Vue.use(animate)
Vue.config.productionTip = false

//当路由进入前
router.beforeEach((to, from, next) => {
  // 每次切换页面时，调用进度条
  NProgress.start();
  // 这个一定要加，没有next()页面不会跳转的。这部分还不清楚的去翻一下官网就明白了
  next();
});
//当路由进入后：关闭进度条
router.afterEach(() => {
  // 在即将进入新的页面组件前，关闭掉进度条
  NProgress.done()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


Vue.directive('qfocus',{
	inserted(el){
    el.focus()
	}
});