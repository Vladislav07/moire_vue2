<template>
  <li class="catalog__item" :product="product">
    <router-link class="catalog__pic" :to="{ name: 'product', params: { id: product.id } }">
      <img :src="product.image" :alt="product.title" />
    </router-link>

    <h3 class="catalog__title">
      <a href="#">
        {{ product.title }}
      </a>
    </h3>
    <radio-button :colorsItem="colors"></radio-button>
    <span class="catalog__price"> {{ product.price | numberFormat }} р </span>
  </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import gotoPage from '@/helpers/gotoPage';
import RadioButton from './baseRadioButton.vue';

export default {
  data() {
    return {
      color: '#73B6EA',
    };
  },
  props: ['product'],
  components: {
    'radio-button': RadioButton,
  },
  methods: {
    gotoPage,
  },
  filters: { numberFormat },
  computed: {
    colors() {
      const result = [];
      this.product.colors.map((item) => (result.push(item)));
      return result;
    },
  },
};
</script>
