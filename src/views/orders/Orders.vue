<template>
<transition 
    appear
        enter-active-class="animated fadeInUpBig"
        leave-active-class="animated fadeOutDownBig"
        mode="out-in"
>
    <div class='orders'>
        <template>
            <!-- 输入框 -->
            <el-input
            style="width:250px;margin-top:20px"
            prefix-icon="el-icon-search"
            placeholder="请输入内容"
            v-model="query"
            clearable> 
            </el-input>
            <!-- 搜索按钮 -->
            <el-button type="primary" @click='searchOrdersFn'>搜索</el-button>
            <!-- 导出表格按钮 -->
            <el-button type="info" @click="exportExcel">点击导出<i class="el-icon-position"></i></el-button>
            <!-- 表格 -->
            <el-table
            id="out-table"
            :data="initData.goods"
            stripe
            style="width: 100%;margin-top:20px">
                <el-table-column
                prop="order_id"
                label="订单ID"
                width="70">
                </el-table-column>

                <el-table-column
                prop="user_id"
                label="用户编号"
                width="90">
                </el-table-column>

                <el-table-column
                prop="order_number"
                label="订单编号"
                width="200">
                </el-table-column>

                <el-table-column
                prop="order_price"
                label="订单价格"
                width="90">
                </el-table-column>

                <el-table-column
                prop="is_send"
                label="是否发货"
                width="90">
                    <template slot-scope="scope">
                        <el-tag v-if='scope.row.is_send=="否"' type="warning">否</el-tag>
                        <el-tag v-else-if='scope.row.is_send=="是"'>是</el-tag>
                    </template>
                </el-table-column>

                <el-table-column
                prop="pay_status"
                label="支付状态"
                width="90">
                    <template slot-scope="scope">
                        <el-tag v-if='scope.row.pay_status=="1"&&scope.row.order_pay!="0"'>已付款</el-tag>
                        <el-tag v-else type="warning">未付款</el-tag>
                    </template>
                </el-table-column>

                <el-table-column
                prop="order_pay"
                label="支付方式"
                width="90">
                <template slot-scope="scope">
                    <el-tag v-if='scope.row.order_pay==0' type="warning">未支付</el-tag>
                    <el-tag v-else-if='scope.row.order_pay==1'>支付宝</el-tag>
                    <el-tag v-else-if='scope.row.order_pay==2' type="success">微信</el-tag>
                    <el-tag v-else-if='scope.row.order_pay==3' type="info">银行卡</el-tag>
                </template>
                </el-table-column>

                <el-table-column
                prop="order_fapiao_title"
                label="订单发票"
                width="90">
                </el-table-column>

                <el-table-column
                prop="update_time"
                label="下单时间"
                width="170">
                <template slot-scope="scope">
                    {{scope.row.update_time | formatDate}}
                </template>
                </el-table-column>

                <el-table-column
                label="操作">
                    <template slot-scope="scope">
                        <el-button type="Info" icon="el-icon-edit" circle @click='editOrdersFn(scope.row)'></el-button>
                        <el-button type="success" icon="el-icon-check" circle @click="detailsOrderFn(scope.row.order_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
            background
            layout="prev, pager, next"
            :page-size="pagesize"
            :total="initData.total"
            @current-change='changePageFn'
            style="margin-top:20px">
            </el-pagination>
        </template>
        <!-- 编辑框 -->
        <el-dialog
        title="修改订单状态"
        :visible.sync="isShowEdit"
        width="40%">
            <el-form :model="editFormData" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
                <el-form-item label="订单ID" prop="id">
                    <el-input v-model="editFormData.id" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item label="订单编号" prop="order_number">
                    <el-input v-model="editFormData.order_number" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item label="订单价格" prop="order_price">
                    <el-input v-model="editFormData.order_price"></el-input>
                </el-form-item>

                <el-form-item label="是否发货" prop="is_send">
                    <el-select v-model="editFormData.is_send" placeholder="请选择发货状态">
                        <el-option
                        v-for="item in sendStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="支付状态" prop="pay_status">
                <el-cascader
                placeholder="请选择支付状态及支付方式"
                v-model="editFormData.pay_status"
                :options="options"
                :props="{ expandTrigger: 'hover' }"
                @change="handleChange"></el-cascader>
                </el-form-item>

                <el-form-item>
                    <el-button @click="isShowEdit = false">取 消</el-button>
                    <el-button type="primary" @click="editFormFn">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 详情框 -->
        <el-dialog title="订单详情" :visible.sync="showDetailsOrder">
            <el-table :data="detailsData">
                <el-table-column property="goods_id" label="商品ID" width="150"></el-table-column>
                <el-table-column property="goods_number" label="商品数量" width="200"></el-table-column>
                <el-table-column property="goods_price" label="商品价格"></el-table-column>
                <el-table-column property="goods_total_price" label="商品总价格"></el-table-column>
            </el-table>
            <el-button type="primary" @click="showDetailsOrder = false" style="margin-top:20px">确 定</el-button>
        </el-dialog>
        
    </div>
    </transition>
</template>

<script>
// 引入
import {formatDate} from '@/utils/date.js';
// 引入导出Excel表格依赖
import FileSaver from "file-saver";
import XLSX from "xlsx";
import {
    getOrders,
    putOrders,
    getOrdersDetails,
} from '@/api'
export default {
    // 时间过滤器
    filters: {
        formatDate(time) {
        var date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
        }
    },
    data() {
        // 自定义验证规则
        var checkPrice = (rule, value, callback) => {
        if (/\D/g.test(value)) {
            callback(new Error('只支持数字，至少1个字符'));
        }else {
            callback();
        }
      };
        return {
            value: [],
            options: [{
                value: '0',
                label: '未付款',
                children: [{
                    value: '0',
                    label: '未支付'
                }]
            },
            {
                value: '1',
                label: '已付款',
                children: [{
                    value: '1',
                    label: '支付宝'
                },
                {
                    value: '2',
                    label: '微信'
                },
                {
                    value: '3',
                    label: '银行卡'
                }]
            }],
            // 选择发货状态的数据
            sendStatus:[
                {
                    value: '0',
                    label: '未发货'
                },
                {
                    value: '1',
                    label: '已发货'
                }
            ],
            // 是否显示详情框
            showDetailsOrder:false,
            // 订单详情数据
            detailsData:[],
            // 是否显示编辑框
            isShowEdit:false,
            // 编辑订单状态的数据
            editFormData:{
                id:0,
                is_send:'',
                order_pay:'',
                pay_status:'',
                order_price:'',
                order_number:'',
            },
            query:'',
            pagesize:2,
            pagenum:1,
            //初始化列表数据
            initData:{
                pagenum:1,
                total:2,
                goods:[]
            },
            // 表单验证规则
            rules:{
                is_send: [
                    { required: true, message: '请选择发货状态', trigger: 'change' }
                ],
                pay_status: [
                    {  required: true, message: '请选择支付状态', trigger: 'change' }
                ],
                order_pay: [
                    { required: true, message: '请选择支付方式', trigger: 'change' }
                ],
                order_price: [
                    { required: true, message: '请输入订单价格', trigger: 'blur' },
                    { validator: checkPrice, trigger: 'blur' }
                ],
            }
        };
    },
    created() {
        this.getOrdersFn()
    },
    watch:{
        query(newData){
            if(newData==''){
                this.getOrdersFn()
            }
        }
    },
    methods: {
        handleChange(value) {
        this.editFormData.order_pay=value[1]
        this.editFormData.pay_status=value[0]
      },
        //定义导出Excel表格事件
        exportExcel() {
            /* 从表生成工作簿对象 */
            var wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
            /* 获取二进制字符串作为输出 */
            var wbout = XLSX.write(wb, {
                    bookType: "xlsx",
                    bookSST: true,
                    type: "array"
                });
                try {
                    FileSaver.saveAs(
                    //Blob 对象表示一个不可变、原始数据的类文件对象。
                    //Blob 表示的不一定是JavaScript原生格式的数据。
                    //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
                    //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
                    new Blob([wbout], { type: "application/octet-stream" }),
                    //设置导出文件名称
                    "sheetjs.xlsx"
                    );
                } catch (e) {
                    if (typeof console !== "undefined") console.log(e, wbout);
                }
            return wbout;
        },
        // 根据id搜索订单
        searchOrdersFn(){
            this.getOrdersFn()
        },
        //  查看订单详情
        detailsOrderFn(id){
            this.showDetailsOrder=true
            getOrdersDetails(id).then(res=>{
                if(res.meta.status==200){
                    this.detailsData=res.data.goods
                }
            })
        },
        // 修改订单状态
        editFormFn(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    putOrders(this.editFormData).then(res=>{
                        if(res.meta.status==201){
                            this.getOrdersFn()
                            this.$message.success(res.meta.msg);
                            // 修改后清空已选数据
                            this.$refs.form.resetFields();
                        }
                    })
                    this.isShowEdit=false
                }
            });
            
        },
        // 显示修改订单状态
        editOrdersFn(row){
            this.isShowEdit=true
            this.editFormData.id=row.order_id
            this.editFormData.order_number=row.order_number
            this.editFormData.order_price=row.order_price
        },
        // 初始化订单列表
        getOrdersFn(){
            getOrders({
                query:this.query,                
                user_id:this.query,                
                pagenum:this.pagenum,                
                pagesize:this.pagesize,
            }).then(res=>{
                if(res.meta.status==200){
                    this.initData=res.data;
                }

})
        },
        // 分页
        changePageFn(currentPage){
            this.pagenum=currentPage
            this.getOrdersFn()
        }
    },
};
</script>

<style scoped>

</style>
