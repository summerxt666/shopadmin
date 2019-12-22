<template>
  <div>
      <!-- 表格 -->
      <!-- 表格动画 -->
      <transition
        appear
        enter-active-class="animated fadeInUpBig"
        leave-active-class="animated fadeOutDownBig"
        mode="out-in"
    >
    <!-- 表格展示 -->
      <template>
        <el-table
            :data="initData"
            border
            stripe
            style="width: 100%">
            <el-table-column
              type="index"
              label="#"
              width="50">
            </el-table-column>
            <el-table-column
            prop="authName"
            label="权限名称"
            width="350">
            </el-table-column>
            <el-table-column
            prop="path"
            label="路径"
            width="350">
            </el-table-column>
            <el-table-column
              prop="level"
              label="权限等级">
                <template scope="scope">
                    <el-tag type="primary" v-if="scope.row.level==='0'">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.level==='1'">二级</el-tag>
                    <el-tag type="warning" v-else-if="scope.row.level==='2'">三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
        </template>
      </transition>


  </div>
</template>

<script>
import {
    getRights
} from '@/api'
export default {
    data() {
      return {
        //表格数据
        type:3,
        initData:[],
          
      }
    },
   created(){
     getRights()
     .then(res=>{
       this.initData=res.data
     })
   },
   methods:{
   }
    
}
</script>

<style>
</style>