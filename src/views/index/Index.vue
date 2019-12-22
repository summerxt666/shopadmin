  <template>
  <div class="index">
    <el-container style="height:100%">
      <el-aside width="auto" class="aside">
        <transition enter-active-class="animated pulse" leave-active-class="animated fadeOutLeft">
          <el-menu
            id="some-element"
            router
            background-color="#304156"
            text-color="#bfcbd9"
            :default-active="this.$route.path"
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
          >
            <el-submenu :index="item.path" v-for="(item,index) in menuData" :key="index">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span class>{{item.authName}}</span>
              </template>
              <el-menu-item
                :index="tag.path"
                v-for="tag in item.children"
                :key="tag.id"
                @click="fun([item.authName,tag.authName,item.children[0].path],tag)"
              >
                <i class="el-icon-setting"></i>
                <span slot="title">{{tag.authName}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </transition>
      </el-aside>
      <el-main class="main">
        <div class="header">
          <div id="some-element1">
            <i :class="pictureStyle" @click="asideSqFn" style="font: 25px/45px ''"></i>
          </div>
          <!-- 面包屑 -->
          <div v-show="minbaoHidden" id="some-element2">
            <el-breadcrumb separator-class="el-icon-arrow-right" class="miaobaoxie" style="font: 16px/40px ''">
              <el-breadcrumb-item>
                <i
                  @click="chatRouter({authName:'首页',path:'/'},0)"
                  style="font-weight:800; cursor: pointer;"
                ><b>首页</b></i>
              </el-breadcrumb-item>
              <el-breadcrumb-item
                v-show="mianbaoxieData[0]"
                style="font-weight:800;"
                class="animated fadeInRight remove"
              ><i>{{mianbaoxieData[0]}}</i></el-breadcrumb-item>
              <el-breadcrumb-item
                v-show="mianbaoxieData[1]"
                class="animated fadeInRight remove"
                ref="animateFn"
              ><i>{{mianbaoxieData[1]}}</i></el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <!-- 全屏 -->
          <div class="btn-fullscreen" >
            <div @click="handleFullScreen">
              <el-tooltip effect="dark" :content="fullscreen ? `取消全屏`:`全屏`" placement="bottom">
                <i class="iconfont icon-quanping" id="some-element3" v-if="!fullscreen" style="font:20px/43px ''"></i>
                <i class="iconfont icon-suoxiao2" v-else ></i>
              </el-tooltip>
            </div>
          </div>

          <div class="right">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link" style="font:16px/50px ''" id="some-element4">
                个人中心
                <span class="iconfont icon-geren9" style="font:20px/20px '';margin-left:10px"></span>
                <i class="el-icon-arrow-down el-icon--right" style="font:16px/50px ''"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>您好，{{uname}}</el-dropdown-item>

                <!-- <el-dropdown-item command="imgageData" class="image">
                  <el-avatar shape="square" :size="50" :src="imageUrl!=null? imageUrl : url"></el-avatar>
                </el-dropdown-item> -->

                <el-dropdown-item command="a">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>

        <div class="preview animated fadeInRightBig" v-if="imageUnlode">
          <div class="preview-box">
            <input id="file1" type="file" name="img" accept="image/*" @change="uploadFile" />
            <label for="file1" id="lable">上传文件</label>
            <div class="preview-del">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUplosdFn"></el-button>
              <el-button type="success" size="mini" @click="uploadImg">
                <i class="el-icon-upload el-icon--right"></i>
              </el-button>
            </div>
          </div>
        </div>

        <!-- tabs选项卡 导航标签 -->

        <div style="height:50px">
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div class="swiper-slide">
                <el-tag
                  v-for="(tag,index) in dynamicTags"
                  :key="index"
                  :effect="tag.color"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag,index)"
                  @click="chatRouter(tag,index)"
                  class="animated bounceInLeft"
                  id="some-element5"
                >{{tag.authName}}</el-tag>
              </div>
            </div>
          </div>
        </div>
        <!-- <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button> -->
        <div class="router">
          <br />
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
// 加载swiper插件
import Swiper from "swiper";
import "swiper/css/swiper.min.css";

import driverStep from "@/utils/driver";
import {  getMenus } from "@/api";
export default {
  filters: {
    fiterStrFn(data) {
      if (!isNaN(data)) {
        return data.toString();
      } else {
        return data;
      }
    }
  },
  props: {},
  data() {
    return {
      // 上传图片的参数
      imageParam: null,
      imageUnlode: false,
      // 上传图片返回路径
      imageUrl: "",
      // 显示图片路径
      url:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      // 全屏

      fullscreen: false,
      // 用户名
      uname: "",
      // back
      // tags导航标签
      dynamicTags: [
        {
          id: 110,
          authName: "首页",
          path: "firstPage",
          color: "dark",
          fatherName: ""
        }
      ],
      inputVisible: false,
      inputValue: "",
      // 控制面包屑隐藏
      minbaoHidden: true,
      mianbaoxieData: [],
      //导航栏是否折叠
      isCollapse: false,
      // 图标样式
      pictureStyle: "el-icon-s-fold",
      menuData: [
        {
          id: 125,
          authName: "新手引导",
          path: "users",
          children: [
            { id: 10, authName: "首页", path: "/firstPage" },
            { id: 110, authName: "welcome", path: "/welcome" }
          ]
        }
      ]
    };
  },
  mounted() {
    if (!localStorage.getItem("newHeader")) {
      localStorage.setItem("newHeader", "newdata");
      this.newHeader();
    }
    this.$nextTick(() => {
      new Swiper(".swiper-container", {});
    });
  },
  created() {
    // 左侧导航菜单
    let id = localStorage.getItem("id");
    getMenus({ id: id }).then(res => {
      if (res.meta.status == 200) {
        res.data.forEach(item => {
          if (item.authName == "商品管理") {
            item.children.forEach((name, index) => {
              if (name.authName == "分类参数") {
                item.children.splice(index, 1);
              }
            });
          }
          this.menuData.push(item);
        });
      }
    });
    this.uname = localStorage.getItem("uname");
  },
  methods: {
    // // -----------------------------------上传图片--------------
    // uploadFile(event) {
    //   let file = event.target.files[0]; //获取input的图片file值
    //   let param = new FormData(); // 创建form对象
    //   param.append("file", file); //对应后台接收图片名
    //   this.imageParam = param;
    //   // console.log(this.imageParam);
    //   //将图片
    //   const reader = new FileReader();
    //   reader.readAsDataURL(file);
    //   reader.onload = arg => {
    //     document.querySelector("#lable").style.backgroundImage = `url(${arg.target.result})`;
    //   };
    // },
    // // 点击删除上传图片
    // delUplosdFn() {
    //   document.querySelector("#lable").style.backgroundImage = `none`;
    //   this.imageParam = null;
    //   this.imageUnlode = false;
    // },
    // // 点击上传图片
    // uploadImg() {
    //   if (this.imageParam == null) {
    //     this.imageUnlode = false;
    //     this.$notify({
    //       duration: 2000,
    //       title: "失败",
    //       message: "没有选择图片",
    //       type: "warning"
    //     });
    //     return;
    //   }
    //   postImg(this.imageParam).then(res => {
    //     //uploadPicture为我的api接口
    //     if (res.meta.msg == 200) {
    //       this.imageUnlode = false;
    //       this.$notify({
    //         duration: 2000,
    //         title: "成功",
    //         message: "上传成功！",
    //         type: "success"
    //       });
    //       this.imageParam = null;
    //     } else {
    //       this.$notify({
    //         duration: 2000,
    //         title: "失败",
    //         message: res.meta.msg,
    //         type: "error"
    //       });
    //     }
    //   });
    // },
    // 下拉菜单
    handleCommand(command) {
      if (command == "a") this.logout();
      if (command == "imgageData") this.imageUnlode = true;
    },
    // 全屏时间
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },

    // 新手引导
    newHeader() {
      this.$driver.defineSteps(driverStep);
      this.$driver.start();
    },
    start() {
      this.$nextTick(() => {
        this.$driver.defineSteps(driverStep);
        this.$driver.start();
      });
    },
    //退出
    logout() {
      this.$notify({
        title: "退出成功",
        message: "感谢您的访问，再见！",
        offset: 100,
        duration: 2000
      });
      // 清除登录状态
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      // 跳转到登录页面
      setTimeout(() => {
        this.$router.push({ name: "Login" });
      }, 2000);
    },
    // 点击tags标签
    handleClose(tag) {
      let pathIndex = this.dynamicTags.indexOf(tag);
      this.dynamicTags.splice(pathIndex, 1);
      let pathParams =
        this.dynamicTags.length == pathIndex
          ? this.dynamicTags[pathIndex - 1].path
          : this.dynamicTags[pathIndex].path;
      let nameParam =
        this.dynamicTags.length == pathIndex
          ? this.dynamicTags[pathIndex - 1].authName
          : this.dynamicTags[pathIndex].authName;
      let fatherParam =
        this.dynamicTags.length == pathIndex
          ? this.dynamicTags[pathIndex - 1].fatherName
          : this.dynamicTags[pathIndex].fatherName;
      let numColor =
        this.dynamicTags.length == pathIndex ? pathIndex - 1 : pathIndex;
      this.chatRouter(
        { authName: nameParam, fatherName: fatherParam, path: pathParams },
        numColor
      );
    },
    // 点击切换路由
    chatRouter(pathParams, index) {
      // ? this.mianbaoxieData=[pathParams.authName] : this.mianbaoxieData[1]=pathParams.authName
      if (pathParams.authName == "首页") {
        this.mianbaoxieData.length = 0;
      } else {
        this.mianbaoxieData[0] = pathParams.fatherName;
        this.mianbaoxieData[1] = pathParams.authName;
      }
      this.daohangColor(index);
      // 切换面包屑
      this.$router.push({ path: pathParams.path });
      this.breadAnimate();
    },
    // 点击首页
    headerFn() {
      this.mianbaoxieData = [];
    },
    // 导航标签变色
    daohangColor(index) {
      for (let i = 0; i < this.dynamicTags.length; i++) {
        this.dynamicTags[i].color = "light";
      }
      if (/^\d*$/g.test(index)) {
        this.dynamicTags[index].color = "dark";
      } else {
        this.dynamicTags[this.dynamicTags.indexOf(index)].color = "dark";
      }
    },
    //面包屑
    fun(data, pathParams) {
      // 点击标题将路由添加到tabs选项数据中
      // 判断是否已存在
      pathParams.color = "light";
      pathParams.fatherName = data[0];
      if (this.dynamicTags.indexOf(pathParams) == -1) {
        if (pathParams.authName == "首页") {
          this.daohangColor(0);
          return;
        }
        this.dynamicTags.push(pathParams);
        // 标签的名字
      }
      this.breadAnimate();
      this.mianbaoxieData = data;
      this.daohangColor(pathParams);
    },
    //面包屑动画
    breadAnimate() {
      this.minbaoHidden = false;
      setTimeout(() => {
        this.minbaoHidden = true;
      }, 100);
    },
    //   点击折叠导航栏
    asideSqFn() {
      this.isCollapse = !this.isCollapse;
      if (this.isCollapse) {
        this.pictureStyle = "el-icon-s-unfold";
      } else {
        this.pictureStyle = "el-icon-s-fold";
      }
    }
  }
};
</script>

  <style scoped lang="scss">
.index {
  // 上传图片样式
  .preview {
    width: 150px;
    border-radius: 10px;
    overflow: hidden;
    position: absolute;
    top: 50px;
    right: 10%;
    z-index: 1000000;
  }
  .preview .preview-box {
    position: relative;
  }
  .preview .preview-del {
    position: absolute;
    bottom: 0px;
    width: 100%;
    font-size: 13px;
    line-height: 20px;
    text-align: center;
    background: rgb(244, 244, 244);
    color: #ccc;
    cursor: pointer;
    z-index: 2;
  }
  .preview label {
    padding: 0px !important;
    margin: 0px !important;
  }
  .preview input[type="file"] {
    display: none;
  }
  .preview label {
    width: 100%;
    height: 150px;
    line-height: 150px;
    text-align: center;
    background: #fff;
    color: #ccc;
    background-size: 150px 150px;
    border-radius: 5px;
    display: inline-block;
    cursor: pointer;
  }
  .preview {
    border: 2px dashed #ccc;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
    margin-right: 50px;
  }
  .el-tag {
    cursor: pointer;
    margin: 8px;
  }
  .active {
    background: orangered;
  }
  // 鼠标移动到标签上是触发
  .el-tag:hover {
    background: #ccc;
  }
  height: 100%;
  .el-header,
  .el-footer {
    background-color: #b3c0d1;
    color: #333;
    text-align: center;
  }
  .el-icon-menu span {
    display: inline-block;
    width: 150px;
  }

  .el-aside {
    background-color: #d3dce6;
    color: #333;
  }

  .el-main {
    background-color: #e9eef3;
    color: #333;
    padding: 0;
  }
  .el-menu {
    border: none;
  }
  .aside {
    background: #304156;
    height: 100%;
  }
  .header {
    padding: 5px 20px;
    background: #f6f7f7;
    display: flex;
    border-bottom: 2px solid #f6f7f7;
    margin-bottom: 5px;
    text-align: center;
    .right,
    .btn-fullscreen {
      flex: 1;
      display: flex;
      .el-dropdown {
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .btn-fullscreen {
      justify-content: flex-end;
      flex: 4;
      i {
        margin-right: 20px;
      }
    }
    i {
      display: inline-block;
    }
    .miaobaoxie {
      align-self: center;
      padding-left: 10px;
    }
    div {
      height: 40px;
    }
  }
  .router {
    padding: 0 20px;
  }
  .tagsCLass {
    display: flex;
    padding: 5px 20px;
    border-bottom: 2px solid #f6f7f7;
  }
  .el-form {
    z-index: 1000000;
  }
}
.swiper-container {
  width: 100%;
  height: 50px;
  background: rgba(51, 51, 51, 0.8);
}
</style>
