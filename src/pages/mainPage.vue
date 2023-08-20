<template>
  <main class="content container">
    <div class="content__top">
      <div class="content__row">
        <h1 class="content__title">Каталог</h1>
        <span class="content__info" v-if="!productsLoading"> {{ countProducts }} товара </span>
      </div>
    </div>

    <div class="content__catalog">
      <product-filter
        :priceFrom.sync="filterPriceFrom"
        :priceTo.sync="filterPriceTo"
        :categoriaId.sync="filterCatId"
        :colorId.sync="filterColorId"
      ></product-filter>

      <section class="catalog">
        <figure id="image" v-if="productsLoading">
          <p><img src="@/image/Hourglass.gif" /></p>
          <figcaption>Загрузка товаров...</figcaption>
        </figure>
        <figure id="image" v-if="LoadingFailed">
          <p><img src="@/image/Beatinghearts.gif" /></p>
          <figcaption>произошла ошибка при загрузке товаров</figcaption>
          <button class="button button--primery" @click="loadProducts()">Попробуте еще раз</button>
        </figure>
        <product-list :products="products"></product-list>
        <base-pagination v-model="page" :count="countProducts" :per-page="productsPerPage">
        </base-pagination>
      </section>
    </div>
  </main>
</template>

<script>
/* eslint-disable implicit-arrow-linebreak, comma-dangle,
function-paren-newline, no-return-assign, arrow-body-style */
import ProductList from '@/components/ProductList.vue';
import BasePagination from '@/components/basePagination.vue';
import ProductFilter from '@/components/ProductsFilter.vue';
import axios from 'axios';
import API_BASE_URL from '@/config';

export default {
  name: 'main',
  data() {
    return {
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCatId: 0,
      filterColorId: 0,
      productsPerPage: 12,
      page: 1,
      productsData: null,
      productsLoading: false,
      LoadingFailed: false,
    };
  },
  computed: {
    products() {
      return this.productsData;
      // ? this.productsData.items.map((p) => {
      //   return {
      //     ...p,
      //  image: p.image.file.url,
      //  colors: p.colors.map((i) => i.id),
      //  };
      //  })
      // : [];
    },
    countProducts() {
      return this.productsData ? this.productsData.pagination.total : 0;
    },
  },
  watch: {
    page() {
      this.loadProducts();
    },
    filterPriceFrom() {
      this.loadProducts();
    },
    filterPriceTo() {
      this.loadProducts();
    },
    filterCatId() {
      this.loadProducts();
    },
    filterColorId() {
      this.loadProducts();
    },
  },
  components: {
    'product-list': ProductList,
    'base-pagination': BasePagination,
    'product-filter': ProductFilter,
  },
  methods: {
    loadProducts() {
      this.productsLoading = true;
      this.LoadingFailed = false;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        axios
          .get(`${API_BASE_URL}/api/products`, {
            params: {
              page: this.page,
              limit: this.productsPerPage,
              categoryId: this.filterCatId,
              minPrice: this.filterPriceFrom,
              maxPrice: this.filterPriceTo,
              colorId: this.filterColorId,
            },
          })
          .then((response) => {
            console.log(response);
            this.productsData = response.data;
          })
          .catch(() => (this.LoadingFailed = true))
          .then(() => (this.productsLoading = false));
      }, 1000);
    },
  },
  created() {
    this.loadProducts();
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#image {
  display: flex;
  flex-direction: column;
  align-items: center;
}
#image p img {
  width: 250px;
}
#image figcaption {
  text-align: center;
  font-size: 20px;
  margin-bottom: 40px;
}
</style>
