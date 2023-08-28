<template>
  <aside class="filter">
    <form class="filter__form form" action="#" method="get" @submit.prevent="submit()">
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="min-price"
            v-model.number="currentPriceFrom"
          />
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input class="form__input" type="text" name="max-price" v-model.number="currentPriceTo" />
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select">
          <select
            class="form__select"
            type="text"
            name="category"
            v-model.number="currentCategoriesId"
          >
            <option value="0">Все категории</option>
            <option :value="categoria.id" v-for="categoria in categories" :key="categoria.id">
              {{ categoria.title }}
            </option>
          </select>
        </label>
      </fieldset>
      <fieldset class="form__block">
        <legend class="form__legend">Цвет</legend>
        <ul class="colors">
          <li class="colors__item" v-for="color in colors" :key="color.id">
            <label class="colors__label">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                name="color"
                :value="color.id"
                v-model.number="currentColorId"
                @change="change"
              />
              <span class="colors__value" :style="{ 'background-color': color.code }"> </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Материал</legend>
        <ul class="check-list">
          <li class="check-list__item" v-for="material in materials" :key="material.id">
            <label class="check-list__label">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                name="material"
                :value="material.id"
                v-model.number="materialsArray"
              />
              <span class="check-list__desc">
                {{ material.title }}
                <span>({{ material.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Коллекция</legend>
        <ul class="check-list">
          <li class="check-list__item" v-for="season in seasons" :key="season.id">
            <label class="check-list__label">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                name="collection"
                :value="season.id"
                v-model.number="seasonsArray"
              />
              <span class="check-list__desc">
                {{ season.title }}
                <span>({{ season.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <button class="filter__submit button button--primery" type="submit">Применить</button>
      <button class="filter__reset button button--second" type="button" @click.prevent="reset()">
        Сбросить
      </button>
    </form>
  </aside>
</template>

<script>
/* eslint-disable no-return-assign */
import axios from 'axios';
import API_BASE_URL from '@/config';

export default {
  data() {
    return {
      currentPriceFrom: 0,
      currentPriceTo: 0,
      currentCategoriesId: 0,
      currentColorId: [],
      materialsArray: [],
      seasonsArray: [],
      categoryData: null,
      colorData: null,
      materialsData: null,
      seasonsData: null,
    };
  },
  props: ['priceFrom', 'priceTo', 'categoriaId', 'colorId', 'materialIds', 'seasonIds'],
  computed: {
    categories() {
      return this.categoryData ? this.categoryData.items : [];
    },
    colors() {
      return this.colorData ? this.colorData.items : [];
    },
    materials() {
      return this.materialsData ? this.materialsData.items : [];
    },
    seasons() {
      return this.seasonsData ? this.seasonsData.items : [];
    },
  },
  watch: {
    priceFrom(value) {
      this.currentPriceFrom = value;
    },
    priceTo(value) {
      this.currentPriceTo = value;
    },
    categoriaId(value) {
      this.currentCategoriesId = value;
    },
    colorId(value) {
      this.currentColorId = value;
    },
    materialIds(value) {
      this.materialsArray = value;
    },
    seasonIds(value) {
      this.seasonsArray = value;
    },
  },
  methods: {
    change() {
    },
    submit() {
      this.$emit('update:priceFrom', this.currentPriceFrom);
      this.$emit('update:priceTo', this.currentPriceTo);
      this.$emit('update:categoriaId', this.currentCategoriesId);
      this.$emit('update:colorId', this.currentColorId);
      this.$emit('update:materialIds', this.materialsArray);
      this.$emit('update:seasonIds', this.seasonsArray);
      // this.$router.push('/');
    },
    reset() {
      this.$emit('update:priceFrom', 0);
      this.$emit('update:priceTo', 0);
      this.$emit('update:categoriaId', 0);
      this.$emit('update:colorId', 0);
      this.$emit('update:materialIds', []);
      this.$emit('update:seasonIds', []);
      // this.$router.push('/');
    },
    loadCategory() {
      axios
        .get(`${API_BASE_URL}/api/productCategories`)
        .then((response) => (this.categoryData = response.data));
    },
    loadColor() {
      axios.get(`${API_BASE_URL}/api/colors`).then((response) => (this.colorData = response.data));
    },
    loadMaterials() {
      axios
        .get(`${API_BASE_URL}/api/materials`)
        .then((response) => (this.materialsData = response.data));
    },
    loadSeasons() {
      axios
        .get(`${API_BASE_URL}/api/seasons`)
        .then((response) => (this.seasonsData = response.data));
    },
  },
  created() {
    this.loadCategory();
    this.loadColor();
    this.loadMaterials();
    this.loadSeasons();
  },
};
</script>
