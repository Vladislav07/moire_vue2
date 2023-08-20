<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img :src="item.product.image" width="120" height="120" :alt="item.product.title" />
    </div>
    <h3 class="product__title">{{ item.product.title }}</h3>
    <span class="product__code">{{ item.product.id }}</span>

    <div class="product__counter form__counter">
      <button type="button" aria-label="Убрать один товар" @click="minusOne(item.product.id)">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-minus"></use>
        </svg>
      </button>

      <input type="text" v-model.number="amount" name="count" />

      <button type="button" aria-label="Добавить один товар" @click="plusOne(item.product.id)">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-plus"></use>
        </svg>
      </button>
    </div>

    <b class="product__price"> {{ (item.product.price * item.amount) | numberFormat }} ₽ </b>

    <button
      class="product__del button-del"
      type="button"
      aria-label="Удалить товар из корзины"
      @click="deleteProduct(item.product.id)"
    >
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>
<script>
import numberFormat from '@/helpers/numberFormat';

export default {
  props: ['item'],
  filters: {
    numberFormat,
  },
  computed: {
    amount: {
      get() {
        return this.item.amount;
      },
      set(value) {
        this.$store.dispatch('updateCartProductAmount', {
          productId: this.item.product.id,
          amount: value,
        });
      },
    },
  },
  methods: {
    deleteProduct(productId) {
      this.$store.dispatch('deleteCartProduct', productId);
    },
    plusOne(productId) {
      this.$store.dispatch('updateCartProductAmount', {
        productId,
        amount: this.item.amount + 1,
      });
    },
    minusOne(productId) {
      if (this.item.amount > 0) {
        this.$store.dispatch('updateCartProductAmount', {
          productId,
          amount: this.item.amount - 1,
        });
      }
    },
  },
};
</script>
