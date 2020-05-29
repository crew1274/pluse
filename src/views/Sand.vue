<template>
  <div>
    <md-tab-bar v-model="tab_current" :items="tab_items"/>
      <keep-alive>
        <component :is="tab_current"></component>
      </keep-alive>

    <!-- <md-swiper ref="swiper" :autoplay="0" :dragable="false" :is-loop="false" :has-dots="false"
      @before-change="onSwiperChange">
      <md-swiper-item>
        <keep-alive>
          <Home />
          <component :is="tab_current"></component>
        </keep-alive>
      </md-swiper-item>
      <md-swiper-item>
        <keep-alive>
          <Prod />
        </keep-alive>
      </md-swiper-item>
      <md-swiper-item>
        <keep-alive>
          <p class="hello">依照順序操作</p>
          <md-steps :steps="steps" :current="5"/>
          <AGV msg="Welcome to Your Mand Mobile"/>
        </keep-alive>
      </md-swiper-item>
    </md-swiper> -->
  </div>
</template>

<script>
import AGV from "@/components/Sand/AGV.vue"
import Prod from "@/components/Sand/Prod.vue"
import Home from "@/components/Sand/Home.vue"
import {TabBar, Steps,  Swiper, SwiperItem } from "mand-mobile"

export default {
  name: "Sand",
  components: {
    AGV,
    Prod,
    Home,
    [TabBar.name]: TabBar,
    [Steps.name]: Steps,
    [Swiper.name]: Swiper,
    [SwiperItem.name]: SwiperItem,
  },
  data()
  {
    return {

      tab_current: "Home",
      tab_items: [{name: "Home", label: '主站狀態'}, {name: "Prod", label: '投料操作'}, {name: "AGV", label: 'AGV操作'}],

      steps: [
        {
          name: '取得料框',
        },
        {
          name: '調整治具',
        },
        {
          name: '投入參數',
        },
        {
          name: '送出料框',
        },
      ],
    }
  },
  watch:
  {
    sand_tab_current(value)
    {
      this.$store.commit('update_sand_tab_current', value)
    }
  },
  methods:
  {

  }
};
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