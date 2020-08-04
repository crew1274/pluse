<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>


<script>
export default {

}
</script>

<style>
  .row-bg {
    padding: 10px 0;
  }
  .hello {
    font-size: 20px;
  }
</style>