<template>
  <ul class="catalog__list">
    <product-item
      :product="product"
      v-for="product in products"
      :key="product.id"
    />
  </ul>
</template>

<script>
import ProductItem from './ProductItem.vue';

export default {
  props: ['products'],
  components: {
    'product-item': ProductItem,
  },
};
</script>
