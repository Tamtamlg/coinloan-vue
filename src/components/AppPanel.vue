<template>
  <div class="panel">
    <header class="panel__head">
      <h2 class="panel__title">{{title}}</h2>
    </header>

    <div class="panel__body">
      <slot name="body"></slot>
    </div>

    <footer class="panel__footer" v-if="footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script>
export default {
  name: "AppPanel",
  props: {
    title: {
      type: String,
      required: true
    },
    footer: {
      type: Boolean,
      required: true
    }
  }
};
</script>

<style scoped lang="scss">
.panel {
  background: #fff;
  border-radius: 3px;
  overflow: hidden;
  margin: 0 0 10px 0;
  box-shadow: 0 4px 12px rgba(224, 224, 224, 0.5);
}

.panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 5px 10px;
  background: #fafafa;
}
.panel__title {
  font-size: 24px;
}
.panel__body {
  padding: 20px 10px;
}
.panel__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 15px;
  background: #fafafa;
  & > * {
    margin-bottom: 0;
  }
}
</style>
