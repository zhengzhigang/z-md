<template>
 <div class="empty-data">
     <slot></slot>
</div>
</template>
<script>
export default {
  name: 'ms-empty'
}
</script>

<style lang="less" scoped>
.empty-data {
    text-align: center;
    padding: 48px 0;
    color: #666;
    font-size: 14px;
    text-align: center;
}
</style>
