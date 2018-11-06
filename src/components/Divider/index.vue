<script>
export default {
  name: 'divider',
  render (h) {
    return h('hr', {
      'class': 'divider'
    })
  }
}
</script>

<style lang="less">
.divider {
  display: block;
  width: 100%;
  height: 1px;
  background: rgba(0,0,0,.12);
  border: none;
}
</style>
