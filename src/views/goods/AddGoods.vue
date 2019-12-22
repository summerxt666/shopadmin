<template>
  <div class="addGoods">
    <div class="mainbox">
      <!-- 首部弹框提示 -->
      <el-alert center title="添加商品信息" type="info"></el-alert>

      <!-- 添加步骤条 -->
      <el-steps :active="active | filterData" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="提交信息"></el-step>
      </el-steps>
    </div>

    <el-tabs tab-position="left" style="height: auto;" v-model="active">
      <el-tab-pane label="基本信息" name="0">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="addGoodForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="ruleForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model.number="ruleForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model.number="ruleForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model.number="ruleForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="多级分类">
            <el-cascader :options="cateList" :props="cateProps" v-model="ruleForm.goods_cat"></el-cascader>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="商品参数" name="1">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="商品规格" prop="name">
            <el-cascader v-model="value" :options="options"></el-cascader>
          </el-form-item>
          <el-form-item label="商品规格" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="属性图片" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="商品参数" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="商品相册" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="商品属性" name="2">
        <!-- <el-form :model="ruleForm3" :rules="rules3" ref="ruleForm3" label-width="100px" class="demo-ruleForm" >
            <el-form-item label="关联专题" prop="name">

                <template>
                <el-transfer
                    filterable
                    :filter-method="filterMethod"
                    filter-placeholder="请输入城市拼音"
                    v-model="value"
                    :data="data">
                </el-transfer>
                </template>
            </el-form-item>
            <el-form-item label="关联优选" prop="name">
                <el-input v-model="ruleForm3.region"></el-input>
            </el-form-item>
        </el-form>-->
      </el-tab-pane>

      <el-tab-pane label="商品图片" name="3">
        <el-upload
          class="uploadImage"
          drag
          action="http://47.98.218.49:8888/api/private/v1/upload"
          :headers="setHeader()"
          :on-success="handleSuccess"
          :file-list="filelist"
          list-type="picture"
        >
          <i class="el-icon-upload"></i>
          <br />将文件拖到此处或
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <!-- <el-form :model="ruleForm3" :rules="rules3" ref="ruleForm3" label-width="100px" class="demo-ruleForm" >
            <el-form-item label="关联优选" prop="name">
                <el-input v-model="ruleForm3.region"></el-input>
        </el-form-item>-->
        <!-- 上传图片 -->
        <!-- <el-upload
            style="margin-left:100px"
            tip	="上传商品图片"
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>

        </el-form>-->
      </el-tab-pane>
      <el-tab-pane label="提交信息" name="5">
        <h1>确定提交吗？</h1>
      </el-tab-pane>
    </el-tabs>
    <div class="bock" v-show="vhidden">
      <span>
        <el-button style="margin-top: 12px;" @click="prev">上一步</el-button>
        <el-button style="margin-top: 12px;" @click="submitForm">下一步</el-button>
      </span>
      <el-button style="margin-top: 12px;" type="primary" @click="cancelFn">取消</el-button>
    </div>

    <div class="bock" v-show="!vhidden">
      <el-button style="margin-top: 12px;" @click="prev">取消</el-button>
      <el-button style="margin-top: 12px;" @click="addGoodsFn">提交</el-button>
    </div>
  </div>
</template>

<script>
import { getCategories, postGood } from "@/api";

export default {
  filters: {
    filterData(data) {
      return parseInt(data);
    }
  },
  data() {
    // 穿梭框
    const generateData = () => {
      const data = [];
      const cities = ["上海", "北京", "广州", "深圳", "南京", "西安", "成都"];
      const pinyin = [
        "shanghai",
        "beijing",
        "guangzhou",
        "shenzhen",
        "nanjing",
        "xian",
        "chengdu"
      ];
      cities.forEach((city, index) => {
        data.push({
          label: city,
          key: index,
          pinyin: pinyin[index]
        });
      });
      return data;
    };

    return {
      //图片存放索引
      fileIndex: [],
      filelist: [],
      //获取token
      token1: "",
      // 控制上一步和下一步出现和隐藏,true为显示，false为提交
      vhidden: true,
      //存放分类数据
      cateList: [],
      //级联显示分类数据
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
        //每项单个选中
        checkStrictly: true
      },
      // 编辑用户信息
      id: 0,
      //添加商品传入的参数
      ruleForm: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_cat: [],
        goods_introduce: "",
        pics: [],
        attrs: []
      },
      //添加商品规则
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
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ]
      },
      // 上传图片
      // dialogImageUrl: "",
      // dialogVisible: false,
      // 穿透框
      data: generateData(),
      value: [],
      filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1;
      },
      // 级联数据
      options: [
        {
          value: "zhinan",
          label: "手机数码-手机通讯",
          children: [
            {
              value: "zhinan1",
              label: "服装-T恤",
              children: [
                {
                  value: "zhinan1",
                  label: "配件"
                }
              ]
            }
          ]
        },
        {
          value: "zhinan1",
          label: "服装-T恤"
        },
        {
          value: "zhinan2",
          label: "服装-裤装"
        },
        {
          value: "zhinan3",
          label: "配件"
        }
      ],
      // 精度条参数
      active: "0"
    };
  },
  created() {
    //多级分类自调用
    this.getCategoriesFn();
  },
  methods: {
    //自定义请求头
    setHeader() {
      var mytoken = localStorage.getItem("token");
      return {
        Authorization: mytoken
      };
    },
    //上传成功接收返回值
    handleSuccess(response, file, fileList) {
      // console.log(response);
      // console.log(file);
      // console.log(fileList);
      if (response.meta.msg == 200) {
        this.$message({ type: fileList[0].status, message: response.data });
        let img = { pic: response.data.tmp_path };
        // console.log(img);
        this.ruleForm.pics.push(img);
        this.fileIndex.push(fileList.uid);
        // console.log(this.fileIndex);
      }
    },

    //  handlePreview(file) {
    //     console.log(file);
    //   },

    // 上传图片
    //      handleRemove(file, fileList) {
    // },
    // handlePictureCardPreview(file) {
    //   this.dialogImageUrl = file.url;
    //   this.dialogVisible = true;
    // },
    //点击下一步提交编辑商品信息
    submitForm() {
      this.$refs.addGoodForm.validate(async valid => {
        if (valid) {
          if (this.active <= 3) {
            this.active = (parseInt(this.active) + 1).toString();
            this.vhidden = true;
          } else {
            this.vhidden = false;
          }
        } else {
          return false;
        }
      });
    },
    //获取分类数据
    async getCategoriesFn() {
      const getCategoriesData = await getCategories();
      this.cateList = getCategoriesData.data;
    },
    //点击提交完成商品添加
    addGoodsFn() {
      this.ruleForm.goods_cat = this.ruleForm.goods_cat.join(",");
      postGood(this.ruleForm).then(res => {
        if (res.meta.status == 201) {
          this.$message({
            type: "success",
            message: res.meta.msg
          });
          this.$router.push({ path: "/goods" });
        } else {
          this.$message({
            type: "info",
            message: res.meta.msg
          });
          this.ruleForm.goods_cat = this.ruleForm.goods_cat.split(",");
        }
      });
    },
    // 点击取消返回商品页
    cancelFn() {
      this.$router.push({ path: "/goods" });
    },
    prev() {
      if (this.active >= 1) {
        this.active = (this.active - 1).toString();
        this.vhidden = true;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.addGoods {
  margin: 0 auto;
  background: #fff;
  padding: 20px 50px 20px 50px;
  .mainbox {
    padding: 20px 100px;
    margin: 20px;
    border-radius: 10px;
  }
  .bock {
    display: flex;
    justify-content: space-between;
  }
}
</style>