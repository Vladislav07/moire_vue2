<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="index.html"> Каталог </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="cart.html"> Корзина </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link"> Оформление заказа </a>
        </li>
      </ul>

      <h1 class="content__title">Корзина</h1>
      <span class="content__info"> {{ countProducts }} товара </span>
    </div>

    <section class="cart">
      <PreLoader v-if="sendOrderState" :message="'Отправка заказа ...'" />
      <form v-else class="cart__form form" action="#" method="POST" @submit.prevent="order()">
        <div class="cart__field">
          <div class="cart__data">
            <base-form-text
              v-model="formData.name"
              title="ФИО"
              :error="formError.name"
              placeholder="Введите ваше полное имя"
            />
            <base-form-text
              v-model="formData.address"
              title="Адрес доставки"
              :error="formError.address"
              placeholder="Введите ваш адрес"
            />
            <base-form-text
              v-model="formData.phone"
              title="Телефон"
              :type="tel"
              :error="formError.phone"
              placeholder="Введите ваш телефон"
            />
            <base-form-text
              v-model="formData.email"
              title="Электронный адрес"
              :type="email"
              :error="formError.email"
              placeholder="Введи ваш Email"
            />
            <base-form-area
              v-model="formData.comment"
              title="Комментарий к заказу"
              :error="formError.comment"
              placeholder="Комментарий к заказу"
            />

            <div class="cart__options">
              <h3 class="cart__title">Доставка</h3>
              <ul class="cart__options options">
                <li class="options__item">
                  <label class="options__label">
                    <input
                      class="options__radio sr-only"
                      type="radio"
                      name="delivery"
                      value="0"
                      checked=""
                    />
                    <span class="options__value"> Самовывоз <b>бесплатно</b> </span>
                  </label>
                </li>
                <li class="options__item">
                  <label class="options__label">
                    <input
                      class="options__radio sr-only"
                      type="radio"
                      name="delivery"
                      value="500"
                    />
                    <span class="options__value"> Курьером <b>500 ₽</b> </span>
                  </label>
                </li>
              </ul>

              <h3 class="cart__title">Оплата</h3>
              <ul class="cart__options options">
                <li class="options__item">
                  <label class="options__label">
                    <input class="options__radio sr-only" type="radio" name="pay" value="card" />
                    <span class="options__value"> Картой при получении </span>
                  </label>
                </li>
                <li class="options__item">
                  <label class="options__label">
                    <input class="options__radio sr-only" type="radio" name="pay" value="cash" />
                    <span class="options__value"> Наличными при получении </span>
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <order-item v-for="item in products" :key="item.product.id" :item="item" />
          </ul>

          <div class="cart__total">
            <p>Доставка: <b>500 ₽</b></p>
            <p>
              Итого: <b>{{ countProducts }}</b> товара на сумму
              <b>{{ totalPrice | numberFormat }} ₽</b>
            </p>
          </div>

          <button class="cart__button button button--primery" type="submit">Оформить заказ</button>
        </div>
        <div class="cart__error form__error-block" v-if="formErrorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>{{ formErrorMessage }}</p>
        </div>
      </form>
    </section>
  </main>
</template>
<script>
/* eslint-disable */
import axios from 'axios';
import API_BASE_URL from '@/config';
import numberFormat from '@/helpers/numberFormat';
import { mapGetters } from 'vuex';
import BaseFormText from '@/components/baseFormText.vue';
import BaseFormArea from '@/components/baseFormArea.vue';
import OrderItem from '@/components/orderItem.vue';
import PreLoader from '@/components/basePreLoader.vue';

export default {
  data() {
    return {
      formData: {},
      formError: {},
      formErrorMessage: '',
      sendOrderState: false,
    };
  },
  components: {
    BaseFormArea,
    BaseFormText,
    OrderItem,
    PreLoader,
  },
  filters: {
    numberFormat,
  },
  computed: {
    ...mapGetters({ products: 'cartDetailProduct', totalPrice: 'cartTotalPrice' }),
    countProducts() {
      return this.products.reduce((acc, item) => {
        return acc + item.amount;
      }, 0);
    },
  },
  methods: {
    order() {
      this.formError = {};
      this.formErrorMessage = '';
      this.sendOrderState = true;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        axios
          .post(
            API_BASE_URL + '/api/orders',
            { ...this.formData },
            {
              params: {
                userAccessKey: this.$store.state.userAccessKey,
              },
            }
          )
          .then((response) => {
            this.$store.commit('resetCart');
            this.$store.commit('updateOrderInfo', response.data);
            this.$router.push({ name: 'orderInfo', params: { id: response.data.id } });
          })
          .catch((error) => {
            this.formError = error.response.data.error.request || {};
            this.formErrorMessage = error.response.data.error.message;
          })
          .finally(()=>{
            this.sendOrderState = false;
          });
      }, 1000);
    },
  },
};
</script>
