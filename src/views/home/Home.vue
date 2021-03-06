<template>
  <div id="home">
    <nav-bar class="nav-bar">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control
      v-show="isTabFixed"
      class="fixed"
      @itemClick="tabClick"
      :titles="['流行', '新款', '精选']"
    ></tab-control>
    <scroll
      class="content"
      ref="scroll"
      @scroll="contentScroll"
      @pullingUp="loadMore"
      :data="showGoodsList"
      :pull-up-load="true"
      :probe-type="3"
    >
      <div>
        <home-swiper :banners="banners" ref="hSwiper"></home-swiper>
        <feature-view :features="recommends"></feature-view>
        <recommend-view></recommend-view>
        <tab-control @itemClick="tabClick" :titles="['流行', '新款', '精选']" ref="tabControl"></tab-control>
        <goods-list :goods-list="showGoodsList"></goods-list>
      </div>
    </scroll>
    <back-top @backTop="backTop" class="back-top" v-show="showBackTop">
      <img src="~assets/img/common/top.png" alt />
    </back-top>
  </div>
</template>

<script>
import NavBar from "common/navbar/NavBar";
import Scroll from "common/scroll/Scroll";
import TabControl from "content/tabControl/TabControl";
import BackTop from "content/backTop/BackTop";
import HomeSwiper from "./childComps/HomeSwiper";
import FeatureView from "./childComps/FeatureView";
import RecommendView from "./childComps/RecommendView";
import GoodsList from "./childComps/GoodsList";
import { getHomeMultidata, getHomeData, RECOMMEND, BANNER } from "network/home";
import { NEW, POP, SELL, BACKTOP_DISTANCE } from "@/common/const";

export default {
  name: "Home",
  components: {
    NavBar,
    Scroll,
    TabControl,
    BackTop,
    HomeSwiper,
    FeatureView,
    RecommendView,
    GoodsList
  },
  data() {
    return {
      banners: [],
      recommends: [],
      goodsList: {
        pop: { page: 1, list: [] },
        new: { page: 1, list: [] },
        sell: { page: 1, list: [] }
      },
      currentType: POP,
      isTabFixed: false,
      tabOffsetTop: 0,
      showBackTop: false
    };
  },
  computed: {
    // 展示的是被加载出来的商品信息
    showGoodsList() {
      return this.goodsList[this.currentType].list;
    }
  },
  created() {
    console.log("创建Home");
    // 请求多个数据
    this.getMultiData();

    // 请求商品数据
    this.getHomeProducts(POP);
    this.getHomeProducts(NEW);
    this.getHomeProducts(SELL);
  },
  activated: function() {
    this.$refs.hSwiper.startTimer();
  },
  deactivated: function() {
    this.$refs.hSwiper.stopTimer();
  },
  methods: {
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = POP;
          break;
        case 1:
          this.currentType = NEW;
          break;
        case 2:
          this.currentType = SELL;
          break;
      }
    },
    contentScroll(position) {
      // 决定tab-control是否处于吸顶显示状态
      this.isTabFixed = position.y < -this.tabOffsetTop;

      // 决定backTop是否显示
      this.showBackTop = position.y < -BACKTOP_DISTANCE;
    },
    loadMore() {
      this.getHomeProducts(this.currentType);
    },
    backTop() {
      this.$refs.scroll.scrollTo(0, 0, 300);
    },
    /**
     * 网络请求相关方法
     */
    getMultiData() {
      getHomeMultidata().then(res => {
        this.banners = res.data[BANNER].list;
        this.recommends = res.data[RECOMMEND].list;
        // 下次更新DOM时 获取新的tabOffsetTop值
        // 在create钩子函数中无法准确获取DOM元素 需要使用$nextTick()
        this.$nextTick(() => {
          this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop;
        });
      });
    },
    getHomeProducts(type) {
      getHomeData(type, this.goodsList[type].page).then(res => {
        const goodsList = res.data.list;
        this.goodsList[type].list.push(...goodsList);
        this.goodsList[type].page += 1;

        this.$refs.scroll.finishPullUp();
      });
    }
  }
};
</script>

<style scoped>
#home {
  /* 防止home页面不能占据整个屏幕引发的bug */
  height: 100vh;
}

.content {
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

.fixed {
  position: fixed;
  top: 44px;
  left: 0;
  right: 0;
}

.back-top {
  position: fixed;
  right: 10px;
  bottom: 60px;
}
</style>
