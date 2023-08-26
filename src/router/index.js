import Vue from 'vue';
import VueRouter from 'vue-router';
import MainPage from '@/pages/mainPage.vue';
import ProductPage from '@/pages/productPage.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';
import CartPage from '@/pages/cartPage.vue';
import OrderPage from '@/pages/orderPage.vue';
import InfoPage from '@/pages/orderInfoPage.vue';

Vue.use(VueRouter);

const routes = [
  { name: 'mainMoire', component: MainPage, path: '/' },
  { name: 'mainMoire', component: MainPage, path: '/index.html' },
  { name: 'product', component: ProductPage, path: '/product/:id' },
  { name: 'cart', component: CartPage, path: '/cart' },
  { name: 'order', component: OrderPage, path: '/order' },
  { name: 'orderInfo', component: InfoPage, path: '/order/:id' },
  { name: 'notFound', component: NotFoundPage, path: '*' },
];

const router = new VueRouter({ mode: 'history', routes });

export default router;
