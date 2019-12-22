<template>
<transition
    appear
    enter-active-class="animated fadeInUpBig"
    leave-active-class="animated fadeOutDownBig"
    mode="out-in"
>
    <div class="roles" style="height:100%">
    <el-input placeholder="请输入内容" v-model="input" clearable style='width:180px'></el-input>
    <el-button type="primary" icon="el-icon-search" style='margin:10px 10px;' @click='searchFn'>搜索</el-button>
    <el-button type="primary" round @click='isShowRoles=true'>添加角色</el-button>
    <!-- 角色列表 -->
    <el-table
        type='index'
        :data="roleList"
        style="width: 100%"
        >
        <el-table-column
            prop=""
            type="expand"
        >
         <template slot-scope="scope">
        <el-row v-for='item1 in scope.row.children' :key='item1.id'>
            <span v-for='item2 in item1.children' :key='item2.id'>
              <span v-for='item3 in item2.children' :key='item3.id'>
                  <el-tag 
                  type='success'
                  style="margin:2px"
                   closable 
                   @close="handleClose(item3,scope.row)"
                   >{{item3.authName}}</el-tag>
              </span>
            </span>
        </el-row>
      </template>

        </el-table-column>
        <el-table-column
        prop="id"
        label="编号"
        width="250">
        </el-table-column>
        <el-table-column
        prop="roleDesc"
        label="角色权限"
        width="300">
        </el-table-column>
        <el-table-column
        prop="roleName"
        label="角色名称"
        width="300">
        </el-table-column>
        <el-table-column
        label="操作"
        width="300">
         <template slot-scope="scope">
         <el-button type="primary" icon="el-icon-edit" circle @click='isEditRoles(scope.row)'></el-button>
         <el-button type="danger" icon="el-icon-delete" circle @click='delRole(scope.row)'></el-button>
         <el-button type="success" icon="el-icon-check" circle @click='showShu(scope.row)'></el-button>
         </template>
        </el-table-column>
    </el-table>
<el-dialog
  title="添加"
  :visible.sync="isShowRoles"
  width="30%">
  <el-form label-width="80px" :model="addForm" ref="addForm">
 <el-form-item label="角色权限">
    <el-select v-model="addForm.roleDesc" placeholder="请选择权限">
        <el-option
        v-for="(role, index) in roleList"
        :key="index"
        :value="role.roleDesc">
        </el-option>
    </el-select>
 </el-form-item> 
<el-form-item label="角色名称">
    <el-select v-model="addForm.roleName" placeholder="请选择角色">
        <el-option
        v-for="(role, index) in roleList"
        :key="index"
        :value="role.roleName">
        </el-option>
    </el-select>
 </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="isShowRoles = false">取 消</el-button>
    <el-button type="primary" @click="addRoles('addForm')">确 定</el-button>
  </span>
</el-dialog>
<!-- 编辑的对话框 -->
<el-dialog
  title="编辑"
  :visible.sync="editDialogFormVisible"
  width="30%">
  <el-form label-width="80px" :model="editForm" ref="editForm">
   <el-form-item label="角色权限">
    <el-select v-model="editForm.roleDesc">
        <el-option
        v-for="(role, index) in roleList"
        :key="index"
        :value="role.roleDesc">
        </el-option>
    </el-select>
 </el-form-item> 
<el-form-item label="角色名称">
    <el-select v-model="editForm.roleName">
        <el-option
        v-for="(role, index) in roleList"
        :key="index"
        :value="role.roleName">
        </el-option>
    </el-select>
 </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="editFn('editForm')">确 定</el-button>
  </span>
</el-dialog>

<!-- 树形控件 -->
<el-dialog
  :visible.sync="isShowShu"
  title="权限分配"
  width="30%"
>
<el-tree
  ref="tree"
  :data="shuList"
  show-checkbox
  node-key="id"
  :default-expanded-keys="[2, 3]"
  :default-checked-keys="getShuList"
  :props="defaultProps">
</el-tree>
<span slot="footer" class="dialog-footer">
    <el-button @click="isShowShu = false">取 消</el-button>
    <el-button type="primary" @click="getCheckedKeys">确 定</el-button>
</span>
</el-dialog>
</div>
</transition>
</template>

<script>
import {
    getRoles,
    postRoles,
    delRoles,
    searchRoles,
    putRoles,
    getShu,
    postRights,
    delRights
} from '@/api'
export default {

    data() {
        return {
        //树形控件
        defaultProps: {
          children: 'children',
          label: 'authName'
        } ,
          roleIds:'',
          shuList:[],
          getShuList:[],
          isShowShu:false,
          editDialogFormVisible:false,
          isShowRoles: false,
          roleList:[],
          input: '',
          addForm:{ 
              roleDesc:'',
              roleName:'',
          },
          editForm:{
              id:0,
              roleDesc:'',
              roleName:''
          }
        };
    },
    methods:{
        //删除角色权限
        handleClose(tag,row){
           delRights(row.id,tag.id).then(res=>{
            if(res.meta.status==200){
               this.rolesListFn()
               this.$message.success('解除权限成功');
            }
           })
           
        },
        //显示树
        showShu(row){
          this.roleIds=row.id
          this.isShowShu=true 
          this.getShuList=[]
          getShu('tree').then(res=>{
              if(res.meta.status==200){
                  this.shuList=res.data
                  for(let i=0;i<row.children.length;i++){
                      for(let j=0;j<row.children[i].children.length;j++){  
                           for(let k=0;k<row.children[i].children[j].children.length;k++){
                               this.getShuList.push(row.children[i].children[j].children[k].id)
                           } 
                      }
                  }
              }           
          })
        },
        //分配权限
         getCheckedKeys() {
                let a=this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys()).join(',')
                postRights(this.roleIds,a).then(res=>{
                    if(res.meta.status==200){
                         this.rolesListFn()
                         this.$message.success('角色授权成功');
                    } })
                    this.isShowShu=false
        },
        isEditRoles(row){
           this.editForm.id=row.id
           this.editForm.roleDesc=row.roleDesc
           this.editForm.roleName=row.roleName
           this.editDialogFormVisible=true
        },
        //编辑角色
        editFn(){
            this.$refs.editForm.validate((valid) => {
                if(valid){
                    putRoles(
                        this.editForm.id,
                        {roleDesc:this.editForm.roleDesc,
                         roleName:this.editForm.roleName
                        }
                    ).then(res=>{
                        if(res.meta.status==200){
                             this.editDialogFormVisible=false 
                             this.rolesListFn()  
                             this.$message.success('编辑成功');               
                        }   
                    })
                }
            })
        },
        //搜索角色
        searchFn(){
            searchRoles(this.input).then(res=>{
                if(res.meta.status==200){
                    if(!res.data.hasOwnProperty('id')){
                        res.data.id=res.data.roleId
                    }
                    this.roleList=[res.data]                                  
                }
            })
        },
        //角色列表
        rolesListFn(){
            getRoles()
            .then(res=>{
                this.roleList=res.data
            })
        },
        //添加角色
       addRoles(){
           this.$refs.addForm.validate((valid) => {
               if(valid){
                    postRoles(
                    {
                    roleName:this.addForm.roleName,
                    roleDesc:this.addForm.roleDesc
                    }).then(res=>{
                        if(res.meta.status==201){
                            this.rolesListFn()  
                            this.addForm.roleDesc=''
                            this.addForm.roleName=''
                            this.isShowRoles=false
                            this.$message.success('添加成功');
                            
                        }   
                    })
               }
           }) 
       },
       //删除角色
       delRole(row){
         delRoles(row.id).then(res=>{
             if(res.meta.status==200){
                 this.rolesListFn()
                 this.$message.success('删除成功');
             }
         })
       }
    },
    created(){
      this.rolesListFn()
    },
    watch:{
        input(newData){
            if(newData==''){
                this.rolesListFn()
            }
        }
    }

};
</script>

<style scoped lang="scss">

</style>
