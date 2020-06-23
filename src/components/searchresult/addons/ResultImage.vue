<template>
  <div :class="fullPicture ? 'imgContainer unfolded' : 'imgContainer'">
        <img v-if="imgsrc !== 'No image'" v-on:click="showFullPicture()" :src="imgsrc" />
        <div class="noImgContainer" v-if="imgsrc === 'No image'">No image</div>
    </div>
</template>
<script>

export default {
name: "ResultImage",

props: {
  imgsrc: {
    type: String,
    required: true
  },
},

data: () => ({ 
  fullPicture: false
}),

methods: {
  showFullPicture() {
    this.fullPicture = !this.fullPicture
  }
},

mounted() {
},

};
</script>
