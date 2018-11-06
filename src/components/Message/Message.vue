<template>
<div v-if="messages.length" class="ms-messages">
  <div v-for="(m, inx) in messages" class="ms-message" :key="inx">
    <span class="ms-message-content">{{m.content}}</span>
  </div>
</div>
</template>

<script>
export default {
  props: {
    messages: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="less">
.ms-messages {
  position: fixed;
  top: 20px;
  right: 20px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 30%;
  width: auto;
  min-width: 20%;
  text-align: center;
  pointer-events: none;
  z-index: 10000;
  .ms-message {
    text-align: center;
    line-height: 1.5;
    margin-bottom: 10px;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 12px;
    background-color: #ff3860;
    color: #fff;
    box-shadow: 0 2px 8px rgba(255, 56, 96, .2);
  }
}
</style>
