<template lang="html">
<div class="ms-avatar">
  <slot></slot>
</div>
</template>

<script>
export default {
  name: 'ms-avatar'
}
</script>

<style lang="less">
.ms-avatar {
  display: flex;
  align-items: center;
  text-align: center;
  img {
    display: flex;
    height: 42px;
    width: 42px;
    border-radius: 50%;
  }
}
</style>
