<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    data: {
      type: Array,
      default: () => {
        return [];
      }
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: {}
    };
  },
  mounted() {
    setTimeout(this.__initScroll, 20);
  },
  methods: {
    __initScroll() {
      // 初始化BScroll对象
      if (!this.$refs.wrapper) return;
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType, // 值不为0 1时可以监听滚动位置
        click: true, // 允许scroll内部的点击事件
        pullUpLoad: this.pullUpLoad // 上拉加载更多
      });

      // 监听scroll事件 传递pos位置给Home组件
      this.scroll.on("scroll", pos => this.$emit("scroll", pos));

      // 监听上拉加载事件
      this.scroll.on("pullingUp", () => {
        console.log("上拉加载");
        this.$emit("pullingUp");
      });
    },
    // 重新计算scoll容器高度的函数
    refresh() {
      this.scroll && this.scroll.refresh && this.scroll.refresh();
    },

    // 完成数据加载后需要执行一次finishPullUp()
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp && this.scroll.finishPullUp();
    },
    // 滚动条滚动到某个位置
    scrollTo(x, y, time) {
      this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x, y, time);
    }
  },
  watch: {
    // 监听商品数据的传入 为了防止商品数据的丢失 延迟20ms执行refresh()
    data() {
      setTimeout(this.refresh, 20);
    }
  }
};
</script>

<style scoped>
</style>
