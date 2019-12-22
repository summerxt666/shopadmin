<template>
    <div class="welcome animated  fadeInUp remove">
        <br>
        <el-button type="primary" plain  @click="startNewHeader"> 开启新手引导</el-button>
</div>
            
</template>

<script>
export default {
    props: {

    },
    
    data() {
        return {
            scroll:null,
        };
    },
    methods:{
        startNewHeader(){
            localStorage.removeItem("newHeader")
            location.reload()
        }
    }
};
</script>

<style scoped lang="scss">
    
</style>
