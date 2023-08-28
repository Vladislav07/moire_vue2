<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="index.html"> Каталог </a>
        </li>
        <li class="breadcrumbs__item">
          <a href="#" class="breadcrumbs__link">Корзина</a>
        </li>
      </ul>
      <div class="content__row">
        <h1 class="content__title">Корзина</h1>
        <span class="content__info"> {{ products.length }} </span>
      </div>
    </div>
    <pre-loader v-if="loader" :message="'Загрузка товаров из корзины...'" />
    <section v-else class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <ul class="cart__list">
            <cart-item v-for="item in products" :key="item.product.id" :item="item" />
          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе</p>
          <p class="cart__price">
            Итого: <span>{{ totalPrice | numberFormat }}₽</span>
          </p>

          <router-link
            tag="button"
            :to="{ name: 'order' }"
            class="cart__button button button--primery"
            type="submit"
            >Оформить заказ</router-link
          >
        </div>
      </form>
    </section>
  </main>
</template>
<script>
/* eslint-disable */
import numberFormat from '@/helpers/numberFormat';
import { mapGetters } from 'vuex';
import cartItem from '@/components/cartItem.vue';
import PreLoader from '@/components/basePreLoader.vue';

export default {
  data() {
    return {
      loader: true,
    };
  },
  filters: {
    numberFormat,
  },

  computed: {
    ...mapGetters({ products: 'cartDetailProduct', totalPrice: 'cartTotalPrice' }),
  },
  components: {
    cartItem,
    PreLoader,
  },
  created() {
    setTimeout(() => {
      this.loader = false;
    }, 1000);
  },
};
</script>
