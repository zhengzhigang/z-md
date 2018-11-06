<template lang="html">
<div class="ms-dialog-wrap" v-show="visible">
  <div class="ms-dialog-inner" :style="style">
    <div class="ms-dialog-header">
      <slot name="header"></slot>
      <div class="ms-dialog-title" v-if="!customHeader">
        {{title}}
      </div>
    </div>
    <div class="ms-dialog-body">
      <div class="ms-dialog-content" :style="styleContent">
        <slot></slot>
      </div>
    </div>
    <div class="ms-dialog-footer">
      <slot name="footer"></slot>
      <div class="ms-dialog-actions" v-if="!customFooter">
        <a class="ms-button" @click="cancelAction">取消</a>
        <a class="ms-button ms-success" :disabled="disabled" @click="confirmSuccess">确定</a>
      </div>
    </div>
  </div>
  <div class="ms-overlayer" @click="cancelAction"></div>
</div>
</template>

<script>
import { addClass, removeClass } from '@/utils/help'
export default {
  name: 'ms-dialog',
  data () {
    return {}
  },
  props: {
    title: String,
    value: {
      type: Boolean,
      required: false
    },
    width: {
      type: [Number, String]
    },
    scrollArea: [Number, String],
    disabled: Boolean,
    customHeader: Boolean,
    customFooter: Boolean
  },
  computed: {
    visible () {
      return this.value
    },

    style () {
      return {
        width: this.width + 'px'
      }
    },

    styleContent () {
      return {
        height: this.scrollArea + 'px'
      }
    }
  },
  watch: {
    visible (newVal) {
      let elem = document.querySelector('html')
      if (newVal) {
        addClass(elem, 'hidden-html')
      } else {
        removeClass(elem, 'hidden-html')
      }
    }
  },
  methods: {
    confirmSuccess: function () {
      this.$emit('confirm-success')
    },
    cancelAction: function () {
      this.$emit('input', false)
    },
    disabledScroll: function (e) {
      e.preventDefault()
    }
  },
  beforeDestroy () {
  }
}
</script>

<style lang="less" scoped>
.ms-overlayer {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 9991;
}
.ms-dialog-wrap {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 9990;
}
.ms-dialog-inner {
  position: absolute;
  margin: 0 auto;
  left: 50%;
  top: 50%;
  width: 400px;
  height: 80%;
  overflow: hidden;
  max-width: 60%;
  max-height: 80%;
  -ms-transform: translate(-50%,-50%);
  -o-transform: translate(-50%,-50%);
  -moz-transform: translate(-50%,-50%);
  -webkit-transform: translate(-50%,-50%);
  transform: translate(-50%,-50%);
  background-color: rgb(255, 255, 255);
  border-radius: 3px;
  box-shadow: 1px 3px 4px rgba(0, 0, 0, 0.3);
  -moz-transition: all 1s;
  -ms-transition: all 1s;
  -webkit-transition: all 1s;
  transition: all 1s;
  z-index: 9992;
}
.ms-dialog-header {
  position: absolute;
  top: 0;
  width: 100%;
  height: 44px;
  max-height: 50px;
  z-index: 1;
  background-color: #fff;
}
.ms-dialog-title {
  border-bottom: 1px solid #eee;
  text-align: center;
  line-height: 44px;
}
.ms-dialog-body {
  height: 100%;
  overflow: hidden;
  padding: 44px 0px;
}
.ms-dialog-content {
  height: 100%;
  padding: 20px;
  min-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
}
.ms-dialog-footer {
  padding: 15px;
  position: absolute;
  width: 100%;
  height: auto;
  bottom: 0;
  min-height: 44px;
  z-index: 1;
  background-color: #fff;
}
.ms-dialog-actions {
  text-align: right;
}
</style>
