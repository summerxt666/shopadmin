import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)
// 测试组件
// 404页面

const NotFound =   () => import('../components/searchOut.vue')

const Login =   () => import('../views/public/Login.vue')
const Index =   () => import('../views/index/Index.vue')
const Users =   () => import('../views/user/Users.vue')
// 角色组件
const Roles =   () => import('../views/roles/Roles.vue')
// 新手引导
const Welcome = () => import('../views/public/Welcome.vue')
//权限列表
const Rights = () => import('../views/rights/Rights.vue')
// 订单
const Orders = () => import('../views/orders/Orders.vue')
// 图表
const Reports = () => import('../views/echarts/Echarts.vue')
// 首页
const FirstPage = () => import('../views/public/Index.vue')

const Goods = () => import('../views/goods/Goods.vue')
const AddGoods = () => import('../views/goods/AddGoods.vue')
const Categories = () => import('../views/goods/Categories.vue')

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    children:[
      // 用户列表
      {path:'users',name:'Users',component:Users},
      {path:'welcome',name:'Welcome',component:Welcome},
      // 角色列表
      {path:'roles',name:'Roles',component:Roles},
      //商品管理
      {path:'goods',name:'Goods',component:Goods},
      {path:'addGoods',name:'AddGoods',component:AddGoods},
      {path:'categories',name:'Categories',component:Categories},
      //权限列
      {path:'rights',name:'Rights',component:Rights},

      // 订单列表
      {path:'orders',name:'Orders',component:Orders},
      // 图表
      {path:'reports',name:'Reports',component:Reports},
      // 首页
      {path:'/',name:'FirstPage',component:FirstPage,alias:'firstPage'},
      
    ]
  },
  {path: '/login', name: 'Login', component: Login},
  { path: '/notFound', name: 'NotFound', component: NotFound },
  {
    path: '*', // 页面不存在的情况下会跳到404页面
    redirect: '/NotFound',
    name: 'notFound',
    hidden: true
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})



router.beforeEach((newRouter, oldRouter, next) => {
  // ...
  if(newRouter.path!='/login'){
    let token=localStorage.getItem('token')
    if(!token){
      console.log(222)
      next({path:'/login'})
      return
    }
  }
  next();
})

export default router
