<template>
  <figure id="image">
    <p><img src="@/image/Hourglass.gif" /></p>
    <figcaption>{{ message }}</figcaption>
  </figure>
</template>
<script>
export default {
  props: ['message'],
};
</script>
<style>
#image {
  display: flex;
  flex-direction: column;
  align-items: center;
}
#image p img {
  width: 150px;
}
#image figcaption {
  text-align: center;
  font-size: 20px;
  margin-bottom: 40px;
}
</style>
