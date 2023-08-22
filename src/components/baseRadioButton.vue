<template>
  <ul class="colors colors--black">
    <li class="colors__item" v-for="colorId in colorsItem" :key="colorId">
      <label class="colors__label">
        <input class="colors__radio sr-only" type="radio" :value="colorId" v-model="checkedData" />
        <span class="colors__value" :style="{ 'background-color': color(colorId) }"> </span>
      </label>
    </li>
  </ul>
</template>

<script>
/* eslint-disable no-return-assign */
import axios from 'axios';
import API_BASE_URL from '@/config';

export default {
  props: ['colorsItem', 'currentColors'],
  data() {
    return {
      colorsData: null,
      checkedData: null,
    };
  },
  computed: {
    colors() {
      console.log(this.colorsData);
      return this.colorsData ? this.colorsData : [];
    },
  },
  methods: {
    color(colorId) {
      return this.colors.find((c) => c.id === colorId).code;
    },
    loadColors() {
      axios
        .get(`${API_BASE_URL}/api/colors`)
        .then((response) => (this.colorsData = response.data.items));
    },
  },
  created() {
    this.loadColors();
  },
};
</script>
