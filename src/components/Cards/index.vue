<script>
export default {
  name: 'card',
  props: {
    height: {
      type: String,
      default: 'auto'
    },
    hover: Boolean
  },
  render (h) {
    let data = {}
    let staticClass = 'card'
    if (this.hover) {
      staticClass += ' card--hover'
    }
    data.class = staticClass
    return h('div', data, this.$slots.default)
  }
}
</script>

<style lang="less">
.card {
  position: relative;
  border-radius: 2px;
  min-width: 0;
  &--hover {
    transition: all .4s cubic-bezier(.25,.8,.25,1);
    &:hover {
      cursor: pointer;
      transform: translateY(-6px);
      box-shadow: 0 26px 40px -24px rgba(0, 36, 100, 0.3);
      transition: all .4s cubic-bezier(.25,.8,.25,1);
    }
  }
}
</style>
