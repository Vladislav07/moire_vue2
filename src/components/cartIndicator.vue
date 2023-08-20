<template>
  <div>
    <span v-if="state" class="header__cart header__cart--loader"
      ><img src="@/image/Hourglass.gif"
    /></span>
    <router-link v-else class="header__cart" :to="{ name: 'cart' }" aria-label="Корзина с товарами">
      <svg width="19" height="24">
          <use xlink:href="#icon-cart"></use>
        </svg>
      <span class="header__count" aria-label="Количество товаров">
        {{ total }}
      </span>
    </router-link>
  </div>
</template>
<script>
export default {
  data() {
    return {
      state: false,
    };
  },
  computed: {
    total() {
      return this.$store.state.cartProducts.length;
    },
  },
  watch: {
    total() {
      this.state = true;
      setTimeout(() => {
        this.state = false;
      }, 1000);
    },
  },
};
</script>
<style scoped>
.header__cart img {
  height: 21px;
}
</style>
