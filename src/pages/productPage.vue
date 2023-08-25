<template>
  <div>
    <main class="content container" v-if="productLoading">
      <figure id="image">
        <p><img src="@/image/Hourglass.gif" /></p>
        <figcaption>Загрузка товара...</figcaption>
      </figure>
    </main>
    <main class="content container" v-else-if="LoadingFailed">
      <figure id="image">
        <p><img src="@/image/Beatinghearts.gif" /></p>
        <figcaption>произошла ошибка при загрузке товаров</figcaption>
        <button class="button button--primery">Попробуте еще раз</button>
      </figure>
    </main>
    <main class="content container" v-else>
      <div class="content__top">
        <ul class="breadcrumbs">
          <li class="breadcrumbs__item">
            <router-link class="breadcrumbs__link" to="/"> Каталог </router-link>
          </li>
          <li class="breadcrumbs__item">
            <a class="breadcrumbs__link" href="#" @click.prevent="$router.push({ name: 'main' })">
              {{ category.title }}
            </a>
          </li>
          <li class="breadcrumbs__item">
            <a class="breadcrumbs__link"> {{ product.title }} </a>
          </li>
        </ul>
      </div>

      <section class="item">
        <div class="item__pics pics">
          <div class="pics__wrapper">
            <img width="570" height="570" :src="product.image[0]" :alt="product.title" />
          </div>
          <ul class="pics__list">
            <li class="pics__item" v-for="img in product.image" :key="img.id">
              <a href="" class="pics__link">
                <img
                  width="98"
                  height="98"
                  :src="img"
                  srcset="img/product-square-2@2x.jpg 2x"
                  alt="Название товара"
                />
              </a>
            </li>
          </ul>
        </div>

        <div class="item__info">
          <span class="item__code">{{ product.id }}</span>
          <h2 class="item__title">{{ product.title }}</h2>
          <div class="item__form">
            <form class="form" action="#" method="POST" @submit.prevent="addToCart">
              <div class="item__row item__row--center">
                <choiseOfQuantity :quantity.sync="productAmount" />

                <b class="item__price"> {{ product.price | numberFormat }} ₽ </b>
              </div>
              <div class="item__row">
                <fieldset class="form__block">
                  <legend class="form__legend">Цвет:</legend>
                  <radio-button :colorsItem="product.colors" :currentColors.sync="productColors" />
                </fieldset>
                <fieldset class="form__block">
                  <legend class="form__legend">Размер</legend>
                  <label class="form__label form__label--small form__label--select">
                    <select class="form__select" type="text" name="category" v-model="productSize">
                      <option value="0">Все категории</option>
                      <option :value="size.id" v-for="size in product.sizes" :key="size.id">
                        {{ size.title }}
                      </option>
                    </select>
                  </label>
                </fieldset>
              </div>
              <div class="item__row">
                <button
                  class="item__button button button--primery"
                  type="submit"
                  :disabled="productAddSending"
                >
                  В корзину
                </button>
              </div>

              <div v-show="productAdded">Товар добавлен в корзину</div>
              <div v-show="productAddSending">Происходит добавление товара в корзину</div>
            </form>
          </div>
        </div>
        <div class="item__desc">
          <ul class="tabs">
            <li class="tabs__item">
              <a
                id="1"
                href="#"
                class="tabs__link"
                v-bind:class="{ 'tabs__link--current': links['1'] }"
                @click.stop="tabSwitch"
                >Информация о товаре</a
              >
            </li>
            <li class="tabs__item">
              <a
                id="2"
                href="#"
                class="tabs__link"
                v-bind:class="{ 'tabs__link--current': links['2'] }"
                @click.stop="tabSwitch"
                >Доставка и возврат</a
              >
            </li>
          </ul>
          <component :is="currentView"></component>
        </div>
      </section>
    </main>
  </div>
</template>
<script>
/* eslint-disable no-return-assign, arrow-body-style, arrow-parens, object-shorthand */
import axios from 'axios';
import gotoPage from '@/helpers/gotoPage';
import numberFormat from '@/helpers/numberFormat';
import choiseOfQuantity from '@/components/choiceOfQuantity.vue';
import API_BASE_URL from '@/config';
import { mapActions } from 'vuex';
import RadioButton from '../components/baseRadioButton.vue';
import ProductContent from '../components/ProductContent.vue';
import ProductDelivery from '../components/ProductDelivery.vue';

export default {
  data() {
    return {
      productAmount: 1,
      productData: null,
      productLoading: false,
      LoadingFailed: false,
      productAdded: false,
      productAddSending: false,
      currentView: ProductContent,
      links: { 1: true },
      productColors: null,
      productSize: 0,
    };
  },
  computed: {
    product() {
      return {
        id: this.productData.id,
        title: this.productData.title,
        image: this.productData.colors.map((item) => item.gallery[0].file.url),
        price: this.productData.price,
        colors: this.productData.colors.map((p) => p.color.id),
        sizes: this.productData.sizes,
      };
    },
    category() {
      return this.productData.category;
    },
  },
  methods: {
    ...mapActions(['addProductToCart']),
    gotoPage,
    addToCart() {
      this.productAdded = false;
      this.productAddSending = true;
      this.addProductToCart({
        productId: this.product.id,
        colorId: this.productColors,
        sizeId: this.productSize,
        amount: this.productAmount,
      }).then(() => {
        this.productAdded = true;
        this.productAddSending = false;
      });
    },
    LoadProduct() {
      this.productLoading = true;
      this.LoadingFailed = false;
      axios
        .get(`${API_BASE_URL}/api/products/${this.$route.params.id}`)
        .then((response) => {
          this.productData = response.data;
        })
        .catch(() => (this.LoadingFailed = true))
        .then(() => {
          this.productLoading = false;
          this.productColors = this.productData.colors[0].color.id;
          this.productSize = this.productData.size[0].id;
        });
    },
    tabSwitch(e) {
      e.preventDefault();
      const n = e.target.id;
      if (n === '2') {
        this.currentView = ProductDelivery;
      } else {
        this.currentView = ProductContent;
      }
      this.links = {};
      this.links[n] = true;
    },
  },
  filters: { numberFormat },
  components: {
    choiseOfQuantity,
    RadioButton,
    ProductContent,
    ProductDelivery,
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.LoadProduct();
      },
      immediate: true,
    },
  },
};
</script>
