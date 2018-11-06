<template lang="html">
<div class="card__row" :style="styleObj">
  <slot></slot>
</div>
</template>

<script>
export default {
  name: 'card-row',
  props: {
    height: {
      type: String,
      default: 'auto'
    }
  },
  computed: {
    styleObj () {
      const styles = {
        height: this.height
      }
      return styles
    }
  }
}
</script>

<style lang="less">
</style>
