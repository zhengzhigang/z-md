<template lang="html">
<div class="subtitle">
  <slot></slot>
</div>
</template>

<script>
export default {
  name: 'ms-subtitle'
}
</script>

<style lang="less">
.subtitle {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  font-size: 16px;
  color: #333;
  padding: 15px;
  border-bottom: 1px solid #eee;
}
</style>
