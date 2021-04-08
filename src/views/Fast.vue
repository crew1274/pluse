<template>
  <div>
    <md-tab-bar v-model="tab_current" :items="tab_items"/>
      <keep-alive>
        <component :is="tab_current" :isRefresh="isRefresh" v-on:finishRefresh="finishRefresh" />
      </keep-alive>
  </div>
</template>

<script>
import Home from "@/components/Fast/Home.vue"
import {TabBar, Steps,  Swiper, SwiperItem } from "mand-mobile"

export default {
  name: "Fast",
  components: {
    Home,
    [TabBar.name]: TabBar,
    [Steps.name]: Steps,
    [Swiper.name]: Swiper,
    [SwiperItem.name]: SwiperItem,
  },
  props: 
  {
      isRefresh: Boolean,
  },
  data()
  {
    return {
      tab_current: "Home",
      tab_items: [
        {name: "Home", label: '快速蝕刻'},
      ],
    }
  },
  watch:
  {
      
  },
  created()
  {
    if(this.$route.params.components )
    {
        this.tab_current = this.$route.params.components
    }
  },
  methods:
  {
    finishRefresh()
    {
      this.$emit('finishRefresh')
    }
  }
}
</script>

<style scoped>
.hello {
  text-align: center;
  padding: 20px;
  font-size: 32px;
  color: #666;
  line-height: 56px;
}

.hello h1 {
  color: #333;
  line-height: 1.15;
  font-size: 64px;
  margin-bottom: 32px;
}

.hello h1 span {
  position: relative;
}

.hello h1 span::after {
  content: "";
  position: absolute;
  z-index: -1;
  left: 0;
  bottom: 8px;
  width: 100%;
  height: 20px;
  background: #ecf6ff;
}
</style>