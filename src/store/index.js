/* eslint-disable */
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import API_BASE_URL from '@/config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cartProducts: [],
    userAccessKey: null,
    cartProductsData: [],
    orderInfo: null,
  },
  mutations: {
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },
    resetCart(state) {
      state.cartProducts = [];
      state.cartProductsData = [];
    },
    updateCartProductAmount(state, { productId, amount }) {
      const item = state.cartProducts.find((i) => i.productId === productId);
      if (item) {
        item.amount = amount;
      }
    },
    deleteCartProduct(state, productId) {
      state.cartProducts = state.cartProducts.filter((item) => item.productId !== productId);
    },
    updateAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updateProductsData(state, items) {
      state.cartProductsData = items;
    },
    syncCartProduct(state) {
      state.cartProducts = state.cartProductsData.map((item) => {
        return {
          productId: item.product.id,
          amount: item.quantity,
          color: item.color.color,
          articul: item.id,
        };
      });
    },
  },
  getters: {
    cartDetailProduct(state) {
      return state.cartProducts.map((item) => {
        const product = state.cartProductsData.find((p) => p.product.id === item.productId).product;
        return {
          ...item,
          product: {
            ...product,
            image: product.colors[0].gallery[0].file.url, // colors.map((item) => item.gallery[0].file.url),
          },
        };
      });
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProduct.reduce((acc, item) => {
        return acc + item.product.price * item.amount;
      }, 0);
    },
  },
  actions: {
    loadOrderInfo(context, orderId) {
      return axios
        .get(`${API_BASE_URL}/api/orders/${orderId}`, {
          params: { userAccessKey: context.state.userAccessKey },
        })
        .then((response) => {
          context.commit('updateOrderInfo', response.data);
        });
    },
    loadCart(context) {
      return axios
        .get(`${API_BASE_URL}/api/baskets`, {
          params: { userAccessKey: context.state.userAccessKey },
        })
        .then((response) => {
          if (!context.userAccessKey) {
            localStorage.setItem('userAccessKey', response.data.user.accessKey);
            context.commit('updateAccessKey', response.data.user.accessKey);
          }
          context.commit('updateProductsData', response.data.items);
          context.commit('syncCartProduct');
        });
    },
    addProductToCart(context, { productId, colorId, sizeId, amount }) {
      return new Promise((resolve) => setTimeout(resolve, 20)).then(() => {
        return axios
          .post(
            `${API_BASE_URL}/api/baskets/products`,
            {
              productId,
              colorId,
              sizeId,
              quantity: amount,
            },
            {
              params: {
                userAccessKey: context.state.userAccessKey,
              },
            }
          )
          .then((response) => {
            context.commit('updateProductsData', response.data.items);
            context.commit('syncCartProduct');
          });
      });
    },
    updateCartProductAmount(context, { productId, amount }) {
      context.commit('updateCartProductAmount', { productId, amount });
      if (amount < 1) {
        return;
      }
      return axios
        .put(
          `${API_BASE_URL}/api/baskets/products`,
          {
            basketItemId: productId,
            quantity: amount,
          },
          {
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          }
        )
        .then((response) => {
          context.commit('updateProductsData', response.data.items);
          context.commit('syncCartProduct');
        })
        .catch(() => {
          // todo
        });
    },
    deleteCartProduct(context, basketItemId) {
      return axios
        .delete(
          `${API_BASE_URL}/api/baskets/products`,
          {
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          },
          { basketItemId: basketItemId }
        )
        .then((response) => {
          context.commit('deleteCartProduct', response.data.items);
          context.commit('syncCartProduct');
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
