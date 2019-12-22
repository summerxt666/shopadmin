<template>
  <div
    class="categories"
    v-loading="screenLoading"
    element-loading-text="正在努力加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(239,239,239,0.5)"
  >
    <!-- 标题 -->
    <h2>
      <i class="iconfont icon-shujutongji6">数据分类展示</i>
      <span>
        <i class="iconfont icon-sousuo" @click="inputShow = !inputShow"></i>
        <transition
          appear
          enter-active-class="animated rotateIn"
          leave-active-class="animated rotateOut"
          mode="out-in"
        >
          <el-input
            @keyup.enter.native="searchCatFn"
            v-model.number="search"
            v-if="inputShow"
            placeholder="请输入分类ID"
            size="small"
            autofocus
          ></el-input>
        </transition>
      </span>
      <el-button type="primary" @click="showAddFn">添加分类</el-button>
    </h2>

    <!-- 分类表格显示 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      row-key="cat_id"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="cat_id" label="商品类别编号" width="180"></el-table-column>
      <el-table-column prop="cat_name" label="分类名称" width="180"></el-table-column>
      <el-table-column prop="cat_level" label="分类等级">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag type="success" size="medium" v-if="scope.row.cat_level == 0">一 级</el-tag>
            <el-tag type="warning" size="medium" v-else-if="scope.row.cat_level == 1">二 级</el-tag>
            <el-tag type="danger" size="medium" v-else-if="scope.row.cat_level == 2">三 级</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="updatetkOn(scope.row)"
            v-if="scope.row.cat_level==2"
            circle
          ></el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            v-if="scope.row.cat_level==2"
            @click="deletetkFn(scope.row)"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改数据编辑框 -->
    <el-dialog title="分类类别" :visible.sync="updatetk">
      <el-form :model="editForm" :rules="rules" ref="editTempForm">
        <el-form-item label="分类名称" label-width="120px" prop="cat_name">
          <el-input v-model="editForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updatetk = false">取 消</el-button>
        <el-button type="primary" @click="updateCategories">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 删除确认框 -->
    <el-dialog title="提示" :visible.sync="deleteShow" width="30%">
      <span>确认删除该分类吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteShow = false">取 消</el-button>
        <el-button type="primary" @click="deleteCatFn">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加分类编辑框 -->
    <el-dialog title="添加分类" :visible.sync="addShow">
      <el-form :model="addForm" ref="addTempForm" label-width="100px" class="demo-addForm">
        <el-form-item
          label="分类名称"
          prop="cat_name"
          :rules="[{ required: true, message: '请输入分类名称', trigger: 'blur' }]"
        >
          <el-input type="info" v-model="addForm.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="多级分类">
          <el-cascader
            type="info"
            :options="dataList"
            :props="cateProps"
            v-model="propProps"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addShow = false">取 消</el-button>
        <el-button type="primary" @click="addCatFn('addTempForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCategories,
  getCat,
  putCategories,
  delCategory,
  postCategory
} from "@/api";

export default {
  data() {
    return {
      //参数
      type: 3,
      //input显示
      inputShow: false,
      //搜索框内容
      search: "",
      //显示loading
      screenLoading: true,
      //添加分类form表单数据
      dataList: [],
      propProps: [],
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
        checkStrictly: true
      },
      addForm: {
        cat_name: "",
        cat_pid: [],
        cat_level: 2
      },
      //添加分类编辑框显示
      addShow: false,
      //删除分类id
      deleteId: 0,
      // 删除确认框显示
      deleteShow: false,
      //显示分类数据
      tableData: [],
      //修改规则
      rules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      //修改的分类参数
      catId: 0,
      editForm: {
        cat_name: ""
      },
      //编辑弹框
      updatetk: false
    };
  },
  created() {
    //设置延时器,等待异步请求
    setTimeout(() => {
      //改变loading值
      this.screenLoading = false;
    }, 1000);
    //调用接口获取商品分类列表
    this.getCategoriesData();
  },
  methods: {
    //根据分类ID查询
    searchCatFn() {
      if (this.search) {
        getCat(this.search).then(res => {
          // console.log(res.data)
          this.tableData.splice(0);
          this.tableData.push(res.data);
        });
      } else {
        this.type = 3;
        this.getCategoriesData();
      }
    },
    //显示添加分类框
    showAddFn() {
      this.addShow = true;
      this.type = 2;
      this.getCategoriesData();
    },
    // 添加分类
    addCatFn(tempForm) {
      this.$refs[tempForm].validate(async valid => {
        if (valid) {
          if (this.propProps.length == 0) {
            //顶级
            this.addForm.cat_pid = 0;
            this.addForm.cat_level = 0;
          } else if (this.propProps.length == 1) {
            //二级
            this.addForm.cat_pid = this.propProps[0];
            this.addForm.cat_level = 1;
          } else if (this.propProps.length == 2) {
            //三级
            this.addForm.cat_pid = this.propProps[1];
            this.addForm.cat_level = 2;
          }
          await postCategory(this.addForm).then(res => {
            // console.log(res);
            if (res.meta.status == 201) {
              this.$message({
                type: "success",
                message: res.meta.msg
              });
              this.$refs[tempForm].resetFields();
              this.addShow = false;
              this.type = 3;
              this.getCategoriesData();
            } else {
              this.$message({
                type: "danger",
                message: res.meta.msg
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    //级联选择器选中项变化，会触发这个函数  TODO
    handleChange() {
      if (this.addForm.cat_pid.length !== 2) {
        this.addForm.cat_pid = [];
      }
    },
    // 级联选择器方法
    tableRowClassName({ rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    //显示删除弹框
    deletetkFn(row) {
      this.deleteShow = true;
      this.deleteId = row.cat_id;
    },
    //删除商品分类
    deleteCatFn() {
      delCategory(this.deleteId).then(res => {
        this.deleteShow = false;
        this.$message.success(res.meta.msg);
        this.getCategoriesData();
      });
    },
    //显示修改弹框
    updatetkOn(row) {
      this.updatetk = true;
      this.catId = row.cat_id;
      this.editForm.cat_name = row.cat_name;
    },
    //修改分类名称
    updateCategories() {
      this.$refs.editTempForm.validate(valid => {
        if (valid) {
          putCategories(this.catId, this.editForm).then(res => {
            if (res.meta.status == 200) {
              this.$message.success(res.meta.msg);
              this.editFormIsShow = false;
              this.getCategoriesData();
            } else {
              this.$message.error(res.meta.msg);
            }
          });
        }
      });
      this.updatetk = false;
    },
    //显示分类数据
    getCategoriesData() {
      if (this.type == 3) {
        getCategories({ type: this.type }).then(res => {
          if (res.meta.status == 200) {
            // console.log(res.data)
            this.tableData = res.data;
          }
        });
      } else {
        getCategories({ type: this.type }).then(res => {
          if (res.meta.status == 200) {
            // console.log(res.data)
            this.dataList = res.data;
          }
        });
      }
    }
  }
};
</script>

<style scoped lang='scss'>
.categories {
  h2 {
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
    span {
      i {
        cursor: pointer;
      }
      .el-input {
        width: 200px;
      }
    }
  }
  .iconfont {
    font-size: 20px;
  }
}
</style>
