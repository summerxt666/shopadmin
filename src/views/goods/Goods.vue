<template>
  <div class="goods">
    <!-- 商品搜索-->
    <div id="search">
      <el-input placeholder="请输入内容" v-model="search" class="input-with-select left">
        <el-button slot="append" icon="el-icon-search" @click="searchGoodsFn"></el-button>
      </el-input>
    </div>

    <br />
    <!-- 商品列表表格 -->
    <transition appear enter-active-class="animated fadeInUp" mode="out-in">
      <el-table :data="goodsListData.goods" stripe style="width: 100% ;border-size:1px">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column type="goods_id" prop="goods_id" label="商品编号"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格"></el-table-column>
        <el-table-column prop="goods_number" label="商品数量"></el-table-column>
        <el-table-column prop="goods_state" label="商品状态">
          <template slot-scope="scope">
            <el-tag
              type="info"
              v-if="scope.row.goods_state==null||scope.row.goods_state==0"
            >{{scope.row.goods_state |filterFn}}</el-tag>
            <el-tag
              type="warning"
              v-else-if="scope.row.goods_state==1"
            >{{scope.row.goods_state |filterFn}}</el-tag>
            <el-tag type="success" v-else>{{scope.row.goods_state |filterFn}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              round
              @click="updateGoodsFn(scope.$index)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              round
              @click="deletetkFn(scope.row)"
            ></el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-postcard"
              round
              @click="showGoodsInfoFn(scope.$index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </transition>

    <!--分页 -->
    <transition appear enter-active-class="animated fadeInUp" mode="out-in">
      <div class="block">
        <el-pagination
          background
          @size-change="changeSizeFn"
          @current-change="changeCurrentFn"
          :current-page="pagenum"
          :page-sizes="[1, 2, 3, 4, 5]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="goodsListData.total"
        ></el-pagination>
        <el-button type="primary" @click="addGoodsFn">添加商品</el-button>
      </div>
    </transition>

    <!--显示商品详细信息对话框 -->
    <el-dialog title="商品详细信息" :visible.sync="showGoodsInfo" width="30%">
      <div>商品ID :{{goodsInfo.goods_id }}</div>
      <div>商品名称:{{goodsInfo.goods_name}}</div>
      <div>价格:{{goodsInfo.goods_price}}</div>
      <div>数量 :{{goodsInfo.goods_number}}</div>
      <div>重量 :{{goodsInfo.goods_weight}}</div>
      <div>商品状态 :{{goodsInfo.goods_state}}</div>
      <div>添加时间 :{{goodsInfo.add_time |formatDateFn}}</div>
      <div>更新时间 :{{goodsInfo.upd_time|formatDateFn}}</div>
      <div>热销品数量 :{{goodsInfo.hot_mumber}}</div>
      <div v-if="goodsInfo.is_promote">是热销品</div>
    </el-dialog>

    <!--修改商品信息对话框 -->
    <el-dialog title="编辑商品信息" :visible.sync="editGoods" width="50%">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="editGoodForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="ruleForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="goods_price">
          <el-input v-model.number="ruleForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="goods_number">
          <el-input v-model.number="ruleForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="重量" prop="goods_weight">
          <el-input v-model.number="ruleForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="多级分类">
          <el-cascader :options="cateList" :props="cateProps" v-model="ruleForm.goods_cat"></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editFormFn()">确定</el-button>
          <el-button @click="editGoods = false">取 消</el-button>
          <!-- <el-button @click="resetFormFn('ruleForm')">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 删除确认框 -->
    <el-dialog title="提示" :visible.sync="deleteShow" width="30%">
      <span>确认删除该条数据吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteShow = false">取 消</el-button>
        <el-button type="primary" @click="deleteGoodsFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//导入请求接口
import {
  getGoodsList,
  putGoods,
  delGood,
  getGoods,
  getCategories
} from "@/api";

export default {
  //数据
  data() {
    return {
      // 删除框显示
      deleteShow: false,
      //需要删除的商品编号
      deleteId: 0,
      //商品id
      id: 0,
      //修改商品信息对话框显示
      editGoods: false,
      //修改商品提交的参数
      ruleForm: {
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: []
      },
      //存放分类数据
      cateList: [],
      //级联数据显示
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
        //每项单个选中
        checkStrictly: true
      },
      //修改商品规则
      rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 3, message: "长度最少 3 个字符", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入价格", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请选择商品类型", trigger: "blur" }
        ]
      },
      //是否显示商品详细信息对话框
      showGoodsInfo: false,
      //存放商品详细信息
      goodsInfo: {},
      //渲染表格传入的参数
      pagesize: 2,
      pagenum: 1,
      search: "",
      //渲染商品表格（响应数据）
      goodsListData: {
        total: 1,
        pagenum: 1,
        goods: [
          {
            goods_id: "",
            goods_name: "",
            goods_price: "",
            goods_number: 1,
            goods_weight: 1,
            goods_state: 0,
            add_time: "",
            upd_time: "",
            hot_mumber: ""
          }
        ]
      }
    };
  },
  created() {
    this.getGoodsData();
  },
  //普通方法
  methods: {
    //获取商品数据
    getGoodsData() {
      getGoodsList({
        pagesize: this.pagesize,
        pagenum: this.pagenum,
        query: this.search
      }).then(res => {
        this.goodsListData = res.data;
      });
    },
    //搜索商品
    searchGoodsFn() {
      let value = this.search;
      // 判断是否是数字
      if (isNaN(value) || !value) {
        this.getGoodsData();
      } else {
        this.searchGoodsByIdFn();
      }
    },
    //通过id查询
    searchGoodsByIdFn() {
      getGoods(parseInt(this.search)).then(res => {
        this.goodsListData.goods.splice(0);
        this.goodsListData.goods.push(res.data);
      });
    },
    //添加商品
    addGoodsFn() {
      this.$router.push({ path: "/addGoods" });
    },
    //显示修改弹框
    updateGoodsFn(index) {
      this.editGoods = true;
      this.index = index;
      this.id = this.goodsListData.goods[index].goods_id;
      this.ruleForm.goods_name = this.goodsListData.goods[index].goods_name;
      this.ruleForm.goods_price = this.goodsListData.goods[index].goods_price;
      this.ruleForm.goods_number = this.goodsListData.goods[index].goods_number;
      this.ruleForm.goods_weight = this.goodsListData.goods[index].goods_weight;
      this.getCategoriesData();
    },
    //获取商品分类数据
    getCategoriesData() {
      getCategories().then(res => {
        if (res.meta.status == 200) {
          this.cateList = res.data;
        }
      });
    },
    //修改商品确定触发
    editFormFn() {
      this.$refs.editGoodForm.validate(async valid => {
        if (valid) {
          this.ruleForm.goods_cat = this.ruleForm.goods_cat.join(",");
          await putGoods(this.id, this.ruleForm).then(res => {
            if (res.meta.status == 200) {
              this.$message.success("商品修改成功");
              this.editGoods = false;
              this.getGoodsData();
            } else {
              this.$message.error(res.meta.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    //显示删除弹框
    deletetkFn(row) {
      // console.log(row)
      this.deleteShow = true;
      this.deleteId = row.goods_id;
    },
    //删除商品
    deleteGoodsFn() {
      delGood(this.deleteId).then(res => {
        this.deleteShow = false;
        this.$message.success(res.meta.msg);
        this.getGoodsData();
      });
    },
    //显示商品详细信息
    showGoodsInfoFn(index) {
      this.goodsInfo = this.goodsListData.goods[index];
      this.showGoodsInfo = true;
    },
    // 改变每页显示条数
    changeSizeFn(val) {
      this.pagesize = val;
      this.getGoodsData({
        pagenum: this.pagenum,
        pagesize: val
      });
    },
    //改变页码
    changeCurrentFn(val) {
      this.pagenum = val;
      this.getGoodsData({
        pagenum: val,
        pagesize: this.pagesize
      });
    }
  },
  //过滤器
  filters: {
    filterFn(data) {
      //  <!-- 商品状态 0: 未通过 1: 审核中 2: 已审核 -->
      if (data == 0 || data == null) {
        return "未通过";
      } else if (data == 1) {
        return "审核中";
      } else {
        return "已审核";
      }
    },
    formatDateFn(param) {
      var date = new Date(param); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var year = date.getFullYear(),
        month = ("0" + (date.getMonth() + 1)).slice(-2),
        sdate = ("0" + date.getDate()).slice(-2),
        hour = ("0" + date.getHours()).slice(-2),
        minute = ("0" + date.getMinutes()).slice(-2),
        second = ("0" + date.getSeconds()).slice(-2);
      // 拼接
      var result =
        year +
        "-" +
        month +
        "-" +
        sdate +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second;
      return result;
    }
  }
};
</script>

<style scoped lang="scss">
.input-with-select {
  margin-right: 20px;
}
.goods {
  padding: 20px;
  background: #fff;
  #search .left {
    float: left;
    width: 300px;
  }
  .el-table {
    margin-bottom: 10px;
  }
  .block {
    display: flex;
    justify-content: space-between;
  }
}
</style>
