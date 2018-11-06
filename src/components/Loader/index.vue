<template lang="html">
  <div class="ms-loader-wrap" v-show="visible">
    <div class="ms-loader-inner" :style="styleObject">
      <span class="ms-loader-rect"></span>
      <span class="ms-loader-rect rect2"></span>
      <span class="ms-loader-rect rect3"></span>
      <span class="ms-loader-rect rect4"></span>
      <span class="ms-loader-rect rect5"></span>
    </div>
    <!-- <div class="ms-overlayer"></div> -->
  </div>
</template>

<script>
export default {
  name: 'ms-loader',
  props: {
    loader: Boolean,
    top: {
      type: Number,
      default: 50
    }
  },
  computed: {
    visible: function () {
      return this.loader
    },
    styleObject () {
      return {
        top: this.top + '%'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.ms-loader-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  height: 60px;
  -webkit-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: 10px;
  z-index: 9999;
}
.ms-loader-rect {
  background-color: #666;
  height: 100%;
  width: 6px;
  margin: 0 2px;
  display: inline-block;
  -webkit-animation: stretchdelay 1.2s infinite ease-in-out;
  animation: stretchdelay 1.2s infinite ease-in-out;
}

.ms-loader-rect.rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.ms-loader-rect.rect3 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}

.ms-loader-rect.rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.ms-loader-rect.rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

@-webkit-keyframes stretchdelay {
  0%, 40%, 100% { -webkit-transform: scaleY(0.4) }
  20% { -webkit-transform: scaleY(1.0) }
}

@keyframes stretchdelay {
  0%, 40%, 100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }  20% {
    transform: scaleY(1.0);
    -webkit-transform: scaleY(1.0);
  }
}
</style>
