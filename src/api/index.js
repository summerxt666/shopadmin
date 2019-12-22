//1.引入axios模块
import axios from 'axios'
//2.全局配置
axios.defaults.baseURL = 'http://47.98.218.49:8888/api/private/v1'

//3.添加请求拦截器
axios.interceptors.request.use(function (config) {
    //1.获取token
    let token = localStorage.getItem('token')
    //2.判断
    if (token) {
        //设置请求头（后期请求接口 http请求头携带Authorization参数）
        config.headers['Authorization'] = token
    }
    return config 
}, function (error) {
    // Do something with request error
    return Promise.reject(error)
})

// let token = localStorage.getItem('token') ||  '固定的'
// let token = localStorage.getItem('token') || 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjUwMCwicmlkIjowLCJpYXQiOjE1NzYwNTc0NDQsImV4cCI6MTU3NjE0Mzg0NH0.StBDtdPJE-hHAWi7epyKGRNCZOTWDtVguaFSXNGCPOs'
// axios.defaults.headers.common['Authorization'] = token

// 语法
// GET      axios.get(请求路径，{params: 数据对象})   
//          axios.get(请求路径，{params: {uname:'aaa', pwd:'bbb'}})   
// POST     axios.post(请求路径，数据对象)   
// PUT      axios.put(请求路径，数据对象)   
// DELETE   axios.delete(`请求路径/${id}`) 
export const postLogin = postData => {
    return axios.post('login', postData).then(res => res.data)
}

//获取用户列表数据
export const getUsers = getData => {
    return axios.get('users', {
        params: getData
    }).then(res => res.data)
}
//修改用户列表数据
export const putUser = (id, putData) => {
    return axios.put(`users/${id}`, putData).then(res => res.data)
}
//添加用户
export const postUser = postData => {
    return axios.post('users', postData).then(res => res.data)
}
//删除用户
export const delUser = id => {
    return axios.delete(`users/${id}`).then(res => res.data)
}
//修改用户状态
export const putUserStatus = (params) => {
    return axios.put(`users/${params.id}/state/${params.type}`).then(res => res.data)
}
//分配用户角色
export const putUserRole = (id, params) => {
    return axios.put(`users/${id}/role`, params).then(res => res.data)
}
//左侧导航
export const getMenus = (id) => {
    return axios.get('menus', {
        params: id
    }).then(res => res.data)
}

//id查询商品
export const getGoods = id => {
    return axios.get(`goods/${id}`).then(res => res.data)
}
//获取商品列表数据
export const getGoodsList = getData => { //{query,pagenum,pagesize}
    return axios.get('goods', {
        params: getData
    }).then(res => res.data)
}
//修改商品数据
export const putGoods = (id, putData) => {
    return axios.put(`goods/${id}`, putData).then(res => res.data)
}
//删除商品
export const delGood = id => {
    return axios.delete(`goods/${id}`).then(res => res.data)
}

//添加商品
export const postGood = postData => {
    return axios.post('goods', postData).then(res => res.data)
}
//获取商品分类数据
export const getCategories = getData => {
    return axios.get('categories', {
        params: getData
    }).then(res => res.data)
}
//id查询商品分类
export const getCat = id => {
    return axios.get(`categories/${id}`).then(res => res.data)
}
//修改分类数据
export const putCategories = (id, putData) => {
    return axios.put(`categories/${id}`, putData).then(res => res.data)
}
//删除分类
export const delCategory = id => {
    return axios.delete(`categories/${id}`).then(res => res.data)
}

//添加分类
export const postCategory = postData => {
    return axios.post('categories', postData).then(res => res.data)
}
//角色列表
export const getRoles = () => {
    return axios.get('roles').then(res => res.data)
}
//增加角色
export const postRoles = (postData) => {
    return axios.post('roles', postData).then(res => res.data)
}
//删除角色
export const delRoles = id => {
    return axios.delete(`roles/${id}`).then(res => res.data)
}
//查询角色
export const searchRoles = id => {
    return axios.get(`roles/${id}`).then(res => res.data)
}
//编辑角色
export const putRoles = (id, putData) => {
    return axios.put(`roles/${id}`, putData).then(res => res.data)
}
//树形控件
export const getShu = type => {
    return axios.get(`rights/${type}`).then(res => res.data)
}
//角色授权
export const postRights = (roleId, rids) => {
    return axios.post(`roles/${roleId}/rights`, {
        rids: rids
    }).then(res => res.data)
}
//删除角色指定授权
export const delRights = (roleId, rightId) => {
    return axios.delete(`roles/${roleId}/rights/${rightId}`).then(res => res.data)
}
//权限列表
export const getRights = () => {
    return axios.get('rights/list').then(res => res.data)
}
// 订单列表
export const getOrders = getData => {
    return axios.get('orders', {
        params: getData
    }).then(res => res.data)
}
// 修改订单状态
export const putOrders = (putData) => {
    return axios.put(`orders/${putData.id}`, putData).then(res => res.data)
}
// 查看订单详情
export const getOrdersDetails = id => {
    return axios.get(`orders/${id}`).then(res => res.data)
}
//数据统计
export const getEcharts = (params) => {
    return axios.get(`reports/type/${params}`).then(res => res.data)
}

//数据统计
export const postImg = (params) => {
    return axios.post(`upload`, params).then(res => res.data)
}