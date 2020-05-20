<template>
  <div class="hello">
    <!-- <h1><span>{{ msg }}</span></h1>
    <p>
      取得料框
    </p>
    <br/> -->
    <el-row :gutter="10">
      <el-col :span="8">
        <md-button type="primary" @click="greet">取得料框</md-button>
      </el-col>
      <el-col :span="8">
        <md-button type="primary" @click="greet">送料</md-button>
      </el-col>
      <el-col :span="8">
        <md-button type="primary" @click="greet">送回料框</md-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Button, Toast, Steps } from "mand-mobile";

export default {
  name: "AGV",
  components: {
    [Button.name]: Button,
    [Steps.name]: Steps,
  },
  props: {
    msg: String
  },
  data()
  {
    return {
      steps: [
        {
          name: '登录',
        },
        {
          name: '开通',
        },
        {
          name: '验证',
        },
        {
          name: '成功',
        },
      ],
    }
  },
  methods: {
    greet() {
      Toast.info("I'm Batman!");
    }
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
