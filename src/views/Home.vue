<template>
  <div class="home">
    <AGV msg="Welcome to Your Mand Mobile"/>
    <Prod />
  </div>
</template>

<script>
// @ is an alias to /src
import AGV from "@/components/AGV.vue";
import Prod from "@/components/Prod.vue";

export default {
  name: "home",
  components: {
    AGV,
    Prod,
  }
};
</script>
