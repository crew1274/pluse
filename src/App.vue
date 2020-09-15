<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>


<script>
export default {
  created()
  {
    // this.resize()
  },
  methods:
  {
      resize()
      {
        console.log("vue resize")
        var ww = window.innerWidth
        if (ww > window.screen.width)
        {
          window.requestAnimationFrame(this.resize())
        } 
        else 
        {
          if (ww > 750) 
          {
            ww = 750
          }
          document.documentElement.style.fontSize = ww * 100 / 750 + 'px'
        }
      }

  }
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