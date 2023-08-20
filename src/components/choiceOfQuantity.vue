<template>
  <div>
    <div class="form__counter">
      <button type="button" aria-label="Убрать один товар" @click="minusOne">
        <svg width="12" height="12" fill="currentColor">
          <use xlink:href="#icon-minus"></use>
        </svg>
      </button>

      <input type="text" v-model.number="currentQuantity" @change="change()" />

      <button type="button" aria-label="Добавить один товар" @click="plusOne">
        <svg width="12" height="12" fill="currentColor">
          <use xlink:href="#icon-plus"></use>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['quantity'],
  data() {
    return {
      currentQuantity: 1,
    };
  },
  watch: {
    quantity(value) {
      this.currentQuantity = value;
    },
  },
  methods: {
    change() {
      this.$emit('update:quantity', this.currentQuantity);
    },
    plusOne() {
      this.currentQuantity += 1;
      this.$emit('update:quantity', this.currentQuantity);
    },
    minusOne() {
      if (this.currentQuantity > 0) {
        this.currentQuantity -= 1;
      }
      this.$emit('update:quantity', this.currentQuantity);
    },
  },
};
</script>
