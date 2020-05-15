<template>
    <div class="sliderContainer">
        Select timespan of search: {{ sliderValues[0] }} - {{ sliderValues[1] }}
        <vue-slider @change="updateSearchBox" v-model="sliderValues" :interval="interval" :min="min" :max="max"></vue-slider>
    </div>
</template>

<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

export default {
  name: "timeSlider",
  components: {
    VueSlider
  },
  data: () => ({
    sliderValues:[],
  }),
  created() {
    this.sliderValues = this.values;
  },
  props: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    values: {
      type: Array,
      required: true
    },
    interval: {
      type: Number,
      required: true
    }
  },
  methods: {
    updateSearchBox() {
      console.log("updating yay")
      this.$emit('search-box-update', this.sliderValues)
    },
  },
};
</script>