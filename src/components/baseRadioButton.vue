<template>
  <ul class="colors colors--black">
    <li class="colors__item" v-for="colorId in colorsItem" :key="colorId">
      <label class="colors__label">
        <input
          class="colors__radio sr-only"
          type="radio"
          :value="colorId"
          v-model="colorID"
          @change="change()"
        />
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
      colorID: this.colorsItem[0],
    };
  },
  watch: {
    currentColors(value) {
      this.colorID = value;
    },
  },
  computed: {
    colors() {
      return this.colorsData ? this.colorsData : [];
    },
  },
  methods: {
    color(colorId) {
      if (this.colorsData) {
        return this.colors.find((c) => c.id === colorId).code;
      }
      return null;
    },
    loadColors() {
      axios
        .get(`${API_BASE_URL}/api/colors`)
        .then((response) => (this.colorsData = response.data.items));
    },
    change() {
      this.$emit('update:currentColors', this.colorID);
    },
  },
  created() {
    this.loadColors();
  },
};
</script>
