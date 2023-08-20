<template>
  <base-form-field :title="title" :error="error"
    ><input
      v-model="dataValue"
      class="form__input"
      :type="text"
      name="name"
      :placeholder="placeholder"
  /></base-form-field>
</template>
<script>
import formFieldMixin from '../mixins/formFieldMixin';

export default {
  props: {
    type: {
      default: 'text',
    },
  },
  mixins: [formFieldMixin],
};
</script>
