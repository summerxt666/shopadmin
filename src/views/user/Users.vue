<template>
    <transition
        appear
        enter-active-class="animated fadeInUpBig"
        leave-active-class="animated fadeOutDownBig"
        mode="out-in"
    >
    <div class=" users">
        <el-row>
            <!-- 搜索框 -->
            <el-input
            placeholder="请输入内容"
            v-model="search"
            style="width:200px"
            clearable 
            >
            </el-input>
            <el-button icon="el-icon-search" plain style="background:#ccc" @click="searchFn"></el-button>
             <el-button type="primary" plain @click="isShowAddUser=true">添加用户</el-button>
            <!-- 搜索日期 -->

            <el-date-picker
            v-model="value1"
            type="datetime"
            placeholder="选择日期时间" style="margin-left:200px">
            </el-date-picker>
            <el-date-picker
            v-model="value2"
            type="datetime"
            placeholder="选择日期时间" >
            </el-date-picker>
            <el-button icon="el-icon-search" plain style="background:#ccc" @click="searchByDate"></el-button>

        </el-row>
        <br>
        <div class="tableVisible" v-show="tableVisible">
            <!-- 表格数据 -->
          <el-table
            :data="initData.users"
            stripe
            style="width: 100%;border-radius:5px">
            <el-table-column
            prop="id"
            label="编号"
            >
            </el-table-column>
            <el-table-column
            prop="role_name"
            label="角色"
            >
            </el-table-column>
            <el-table-column
            prop="username"
            label="用户名">
            </el-table-column>
            <el-table-column
            prop="email"
            label="邮箱">
            </el-table-column>
            <el-table-column
            prop="mobile"
            label="手机号">
            </el-table-column>

            <el-table-column
            prop="create_time"
            label="时间" width="190px">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.create_time|filterDateFn }}</span>
            </template>
            </el-table-column>

            <el-table-column
            prop="mg_state"
            label="用户状态">
                <template slot-scope="scope">
                    <el-switch
                    @change='changeStatusFn(scope.row)'
                    v-model="scope.row.mg_state"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                    </el-switch>
                </template>
                
            </el-table-column>
            <el-table-column
            label="操作"
            width="180px">
            <template slot-scope="scope">
                <el-button type="success"  icon="el-icon-edit" circle @click="editUserFn(scope.row)"> </el-button>
                <el-button type="danger" icon="el-icon-delete" circle @click="delUserFn(scope.row.id)"></el-button>
                <el-button type="warning" icon="el-icon-check" circle @click="splitUserRoleFn(scope.row)"></el-button>
            </template>
            </el-table-column>
        </el-table>
        <br>
        <div class="pageChat">
        <!-- 分页 -->
        <el-pagination
            background
            :current-page="initData.pagenum"
            layout="prev, pager, next"
            :page-size="pagesize"
            @current-change="newPageFn"
            :total="initData.total">
        </el-pagination>
        </div>
    </div>
        
        <!-- 对话框 -->
        <el-dialog
        title="提示"
        :visible.sync="editUser"
        width="30%"
        >
        <el-form :model="editUserData" :rules="rules" ref="editUserData" label-width="100px" class="demo-ruleForm">
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editUserData.mobile"></el-input>
        </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="editUser = false">取 消</el-button>
            <el-button type="primary" @click="editFormSb('editUserData')" >确 定</el-button>
        </span>
        </el-dialog>
 <!-- 对话框添加用户 -->
        <el-dialog
        title="提示"
        :visible.sync="isShowAddUser"
        width="30%"
        >
        <el-form :model="addFormData" :rules="addRules" ref="addFormData" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
            <el-input v-model="addFormData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="addFormData.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="addFormData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addFormData.mobile"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editUser = false">取 消</el-button>
            <el-button type="primary" @click="addUserSubmitFn('addFormData')" >确 定</el-button>
        </span>
        </el-dialog>
        <!-- 分配用户角色 -->
        <el-dialog
        title="分配用户角色"
        :visible.sync="showUserRole"
        width="30%">
            <template>
                <el-select v-model="value" clearable placeholder="请选择用户角色">
                    <el-option
                    v-for="item in userRolesData"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </template>
            
            <br>
            <el-row  slot="footer" class="dialog-footer">
                <el-button @click="showUserRole = false">取 消</el-button>
                <el-button type="primary" @click="userRoleFn">确 定</el-button>
            </el-row>
        </el-dialog>
    </div>
         </transition>
</template>

<script>
import {
    getUsers,
    putUser,
    postUser,
    delUser,
    putUserStatus,
    // 分配角色
    putUserRole,
    getRoles
    } from '@/api'
 export default {
     filters:{
         filterDateFn(nowDate){
            var now=new Date(nowDate*1000)
            var year=now.getFullYear(); 
            var month=now.getMonth()+1; 
            var date=now.getDate(); 
            var hour=now.getHours(); 
            var minute=now.getMinutes(); 
            var second=now.getSeconds(); 
            return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
         }
     },
    data() {
        let editMobileRule= (rule, value, callback) => {
        if (/^[1][\d]{10}$/.test(value)) {
           callback();
        } else {
            callback(new Error('请输入真确的手机号码'));
        }
      };
      return {
        //   控制
        tableVisible:true,
           //   日期数据
           value1:"",
           value2:"",
        //   分配用户角色框状态
          showUserRole:false,
        //   用户角色数据
          userRolesData:[],
        //   分配的用户角色
          value:'',
          userRoleData:{
              id:1,
          },
        //   添加用户数据
        addFormData:{
            username:'',
            password:'',
            email:'',
            mobile:''
        },
        isShowAddUser:false,
        addRules:{
            username: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
            ],
            password: [
                { required: true, message: '请输入密码', trigger: 'blur' },
            ],
              email: [
                { required: true, message: '请输入邮箱', trigger: 'blur' },
                { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
            ],
            mobile: [
                { required: true, message: '请输入手机号', trigger: 'blur' },
                 { validator: editMobileRule, trigger: 'blur' }
            ],
        },
        //   b编辑用户验证规则
        rules: {
        email: [
                { required: true, message: '请输入邮箱', trigger: 'blur' },
                { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
            ],
        mobile: [
                { required: true, message: '请输入手机号', trigger: 'blur' },
                 { validator: editMobileRule, trigger: 'blur' }
            ],
        },
        //   编辑用户数据
        editUserData:{
            id:0,
            email:'',
            mobile:''
        },
        //   编辑用户出现隐藏
        editUser:false,
        //   表单数据
        initData:{
            pagenum:1,
            users:[],
            total:0,
        },
        pagesize:2,
        pagenum:1,
        search:'',
      }
    },
    watch:{
        search(newData){
            if(newData==''){
                this.getUsersData()
            }
        }
    },
    created(){
        this.getUsersData()
    },
    methods:{
        // 显示分配用户角色框
        splitUserRoleFn(row){
            this.showUserRole=true
            this.userRoleData.id=row.id
            getRoles().then(res=>{
                if(res.meta.status==200){
                    this.userRolesData=res.data
                }
            })
        },
        // 分配用户角色
        userRoleFn(){
            this.showUserRole=false
            putUserRole(this.userRoleData.id,{
                rid:this.value
            })
                .then(res=>{
                    if(res.meta.msg==200){
                        this.$message.success(res.data);
                        this.getUsersData()
                    }
                })
        },
        // 改变用户状态
        changeStatusFn(row){
            putUserStatus({
                id:row.id,
                type:row.mg_state
            }).then(res=>{
                if(res.meta.msg==200){
                    this.$message.success(res.data);
                }
            })
        },
        // 删除用户
        delUserFn(id){
            delUser(id)
            .then(res=>{
                if(res.meta.status==200){
                    this.$message.success('删除成功')
                    this.getUsersData()
                }else{
                    this.$message.error(res.meta.msg)
                    this.isShowAddUser=false
                }
            })
        },
        // 点击提交添加用户对话框
        addUserSubmitFn(addFormData){
            this.$refs[addFormData].validate((valid) => {
            if (valid) {
                postUser(this.addFormData)
                .then(res=>{
                    if(res.meta.status==201){
                        this.$message.success('添加成功')
                        this.isShowAddUser=false
                        this.getUsersData()
                    }else{
                        this.$message.error(res.meta.msg)
                        this.isShowAddUser=false
                    }
                })
            } else {
                return false;
            }
            });
        },
        //点击提交验证表单数据
        editFormSb(editUserData){
           this.$refs[editUserData].validate((valid) => {
          if (valid) {
            putUser(this.editUserData.id,this.editUserData)
            .then(res=>{
                if(res.meta.status==200){
                    // console.log(res)
                    this.$message.success('修改成功')
                    this.editUser=false
                    this.getUsersData()
                }else{
                     this.$message.error(res.meta.msg)
                }
            })
          } else {
            return false;
          }
        });
        },
        //获取用户数据
        getUsersData(){
            getUsers({
                pagesize :this.pagesize,
                pagenum:this.pagenum,
                query:this.search,
                start_time:this.value1,
                end_time:this.value2,
            })
            .then(res=>{
                // console.log(res.data.total)
                this.initData=res.data
            })
        },
        //点击分页 跟新页面
        newPageFn(nowPageData){
           this.pagenum=nowPageData
           this.getUsersData()
        },
        //搜索数据
        searchFn(){
            this.getUsersData()
        },
        // 按照时间搜索
        searchByDate(){
            this.getUsersData()
        },
        //对话框函数
        editUserFn(row){
            this.editUser=true
            this.editUserData.id=parseInt(row.id)
            this.editUserData.email=row.email
            this.editUserData.mobile=row.mobile
        },
    }
  }
</script>

<style scoped lang="scss">
.users{
    padding: 20px;
    .pageChat{
        display: flex;
        justify-content: flex-end;
    }
    .dialogPostions{
        position: fixed;
    }
}
</style>
