<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="index.html"> Каталог </a>
        </li>
        <li class="breadcrumbs__item">
           <router-link
              class="breadcrumbs__link"
              to="/cart"
            >
              Корзина
            </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link"> Оформление заказа </a>
        </li>
      </ul>
      <div class="content__row">
        <h1 class="content__title">Оформление заказа</h1>
      </div>
    </div>

    <section class="cart">
      <PreLoader v-if="sendOrderState" :message="'Отправка заказа ...'" />
      <form v-else class="cart__form form" action="#" method="POST" @submit.prevent="order()">
        <div class="cart__field">
          <div class="cart__data">
            <base-form-text
              v-model="formData.name"
              title="ФИО"
              type="text"
              :error="formError.name"
              placeholder="Введите ваше полное имя"
            />
            <base-form-text
              v-model="formData.address"
              title="Адрес доставки"
              type="text"
              :error="formError.address"
              placeholder="Введите ваш адрес"
            />
            <base-form-text
              v-model="formData.phone"
              title="Телефон"
              type="tel"
              :error="formError.phone"
              placeholder="Введите ваш телефон"
            />
            <base-form-text
              v-model="formData.email"
              title="Электронный адрес"
              type="email"
              :error="formError.email"
              placeholder="Введи ваш Email"
            />
            <base-form-area
              v-model="formData.comment"
              title="Комментарий к заказу"
              type="text"
              :error="formError.comment"
              placeholder="Комментарий к заказу"
            />
          </div>
          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li class="options__item" v-for="item in deliveriesData" :key="item.id">
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="delivery"
                    :value="item.id"
                    @change="loadPaymantsType(formData.deliveryTypeId)"
                    v-model="formData.deliveryTypeId"
                  />
                  <span class="options__value">
                    {{ item.title }} <b>{{ item.price }} ₽</b>
                  </span>
                  <span class="form__error" v-show="error">{{ error }}</span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li class="options__item" v-for="item in paymentsData" :key="item.id">
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="pay"
                    :value="item.id"
                    v-model="formData.paymentTypeId"
                  />
                  <span class="options__value"> {{ item.title }} </span>
                  <span class="form__error" v-show="formError.paymentTypeId">{{
                    formError.paymentTypeId
                  }}</span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <order-item v-for="item in products" :key="item.product.id" :item="item" />
          </ul>

          <div class="cart__total">
            <p>
              Доставка: <b>{{ deliveries.price }} ₽</b>
            </p>
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
      deliveriesData: null,
      paymentsData: null,
      deliveries: {},
      error: null,
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
    change(id) {
      //this.loadPaymantsType(id);
      //
    },
    loadDeliveryType() {
      axios
        .get(`${API_BASE_URL}/api/deliveries`)
        .then((response) => {
          this.deliveriesData = response.data;
          this.formData.deliveryTypeId = this.deliveriesData[0].id;
          this.loadPaymantsType(this.formData.deliveryTypeId);
        })
        .catch((error) => console.log(error.message));
    },

    loadPaymantsType(deliveryId) {
      axios
        .get(`${API_BASE_URL}/api/payments?deliveryTypeId=${deliveryId}`)
        .then((response) => {
          this.paymentsData = response.data;
          this.deliveries = this.deliveriesData[deliveryId - 1];
          //this.formData.paymentTypeId = this.paymentsData[1].id
        })
        .catch((error) => console.log(error.message));
    },

    order() {
      this.formError = {};
      this.formErrorMessage = '';
      this.sendOrderState = true;
      console.log(this.formData);
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
          .finally(() => {
            this.sendOrderState = false;
          });
      }, 1000);
    },
  },
  created() {
    this.loadDeliveryType();
  },
};
</script>
<style scoped>
  .options__label{
    position: relative;
  }
</style>
