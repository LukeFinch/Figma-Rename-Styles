<template>
<div
    class="style_icon swatch" 
    v-bind:class="{ checkerboard: this.alpha !== 1}"
>   
    
    <div
        v-for="(layer,index) in layers"
        :key=index
        class="layer"
        v-bind:style="{
            background: layer.background,
            opacity: layer.opacity
        }"

    />
    <div v-if="this.alpha < 1" 
    class="layer swatchLayerCheckerboard"
    v-bind:style="{
        opacity: 1 - this.alpha,
    }"
    />
    
</div>
</template>

<script>
export default {
  props: {
     alpha: Number,
     layers: Array      
  }
  
}
</script>

<style scoped>

.swatch{
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 100%;
  box-sizing: border-box;
  position: relative;
}
.layer{
  position: absolute;
  height: inherit;
  width: inherit;
  border-radius: 100%;
}

.swatchLayerCheckerboard {
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.08);
  border-radius: 100%;
  clip-path: polygon(0 0,100% 0,100% 100%);
  width: 18px;
  height: 18px;
  background: url('../assets/checkboard.svg')
}

.checkerboard-background {
  border-radius: 100%;
  background: url('../assets/checkboard.svg')
}
</style>