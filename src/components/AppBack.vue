<template>
  <a href="#" class="back-link" @click.prevent="goBack">&larr; Back</a>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.back-link {
  color: #252525;
  text-decoration: none;
  &:hover {
    color: #00f;
  }
}
</style>
