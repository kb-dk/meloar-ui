<template>
    <div class="sliderContainer">
        Select search timespan: {{ $_deliverTimePeriodStamp(sliderValues[0]) }} to {{ $_deliverTimePeriodStamp(sliderValues[1]) }}
        <vue-slider @change="updateSearchBox" v-model="sliderValues" :interval="interval" :start="start" :end="end" :min="min" :max="max"></vue-slider>
        <div v-if="this.$route.name === 'Search'" @click="doNewSearch" class="reapply-time-filters">Reapply timespan</div>
      </div>
</template>

<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import SearchResultUtils from "../mixins/SearchResultUtils"

export default {
  name: "timeSlider",
  components: {
    VueSlider
  },
  data: () => ({
    initStartValue:0,
    initEndValue:0,
    sliderValues:[],
  }),
  created() {
    this.initStartValue = this.start;
    this.initEndValue = this.end;
    this.sliderValues = [this.start, this.end];
  },
  mixins: [SearchResultUtils],
  props: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    start: {
      type: Number,
      required: true
    },
    end: {
      type: Number,
      required: true
    },
    interval: {
      type: Number,
      required: true
    },
  },
  watch: {
      end: function(newValue) {
        this.sliderValues = [this.start,newValue];
      },
      start: function(newValue) {
        this.sliderValues = [newValue, this.end];
      },
  },
  methods: {
    updateSearchBox() {
      this.$emit('search-box-update', this.sliderValues);
    },
    doNewSearch() {
      this.initStartValue = this.sliderValues[0];
      this.initEndValue = this.sliderValues[1];
      this.$emit('do-new-search')
    },
  },
};
</script>