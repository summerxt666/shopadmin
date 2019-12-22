<template>
    <div class="login">
        <div class="login-form animated  fadeInUp remove" >
            <el-form label-position="right" :rules="rules" ref="formObj" :model="fromData" style="width:100%">
            <h1> 商务管理系统后台</h1>
                <br>
                <el-form-item  prop="username">
                    <el-input v-model="fromData.username" class="bgColor" 
                        placeholder="请输入用户名"
                        prefix-icon="el-icon-user"
                    v-qfocus></el-input>
                </el-form-item>
                <br>

                <el-form-item  prop='password'>
                    <el-input type="password" v-model="fromData.password"
                    show-password
                    class="bgColor" 
                     placeholder="请输入密码"
                     prefix-icon="el-icon-lock"
                    ></el-input>
                </el-form-item>
                <br>

                 <el-form-item>
                    <el-button type="primary" @click="submitForm('formObj')" style="width:68%" >登录</el-button>
                    <el-button @click="resetForm('formObj')" style="width:28%">重置</el-button>
                </el-form-item>
            </el-form>
        </div>  
        <div class="particles">
        <vue-particles
        shapeType="star"
        class="lizi"
        z-index=-111111
        color="#899ab5"
        :lineOpacity="0.4"
        :particleOpacity="0.7"
        >
        </vue-particles>
        </div>
        
    </div>
</template>
<script>
import {postLogin} from '@/api'
export default {
    data() {
        return {
            lizi:'',
            fromData:{
                username : '',
                password:''
            },
            rules:{
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 7, message: '长度在 3 到 7 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 7, message: '长度在 3 到 7 个字符', trigger: 'blur' }
                ],
            }

        };
    },
    methods:{
        submitForm(formName) {
            // this.$refs.loginBtn.setAttribute('disabled','disabled')
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    postLogin(this.fromData)
                    .then(res=>{
                        if(res.meta.status==200){
                            localStorage.setItem('token',res.data.token)
                            localStorage.setItem('uname',res.data.username)
                            localStorage.setItem('id',res.data.id)
                            this.$message.success('登录成功');
                            this.$router.push({path:'/'})
                        }else{
                            this.$message.error(res.meta.msg);
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
};
</script>

<style lang="scss">
.login{
    background-color: #2d3a4b;
    height: 100%;
     display: flex;
    justify-content: center;
    align-items: center;
    .login-form{
        z-index: 10000000;
        height: 300px;
        width: 400px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        h1{
            text-align: center;
            color: #fff
        }
    }
    .bgColor .el-input__inner{
        background-color: #2d3a4b;
        color: #fff
    }
    .particles{
        position:fixed;
        width: 100%;
        height: 100%;
    }
}
</style>
