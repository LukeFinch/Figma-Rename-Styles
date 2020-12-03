<template>
<div v-if="listType == 'paint'"
    class="style_icon swatch" 
    v-bind:class="{ checkerboard: item.alpha !== 1}"
>   
    
    <div
        v-for="(layer,index) in item.style"
        :key=index
        class="layer"
        v-bind:style="{
            background: layer.background,
            opacity: layer.opacity
        }"

    />
    <div v-if="item.alpha < 1" 
    class="layer swatchLayerCheckerboard"
    v-bind:style="{
        opacity: 1 - item.alpha,
    }"
    />
    
</div>

<div v-if="listType == 'text'" :style="{'background-image': `url(${item.img})`}" class="style_icon style_icon--text" />
<div v-if="listType == 'grid'" class="style_icon "> 
<div  class="icon figma_icon" :class='gridType(item)'></div>
</div>

<div v-if="listType == 'effect'" class="style_icon "> 
<div  class="icon figma_icon icon--effects" ></div>
</div>

<!-- <div v-if="listType == 'grid' && item.layoutGrids.slice(-1)[0].pattern == 'ROWS'" class="icon icon--layout-grid-rows"></div>
<div v-if="listType == 'grid' && item.layoutGrids.slice(-1)[0].pattern == 'COLUMNS'" class="icon icon--layout-grid-columns"></div> -->
</template>

<script>
import {computed, onMounted} from 'vue'

//            :layers="item.style"
//            :alpha="item.alpha"
export default {

  props: {
     listType: String,
     item: Object,
  },
  setup(props) {

  function gridType(item){
      let gridIcon = ""
      let grids = new Set()
      if(item.layoutGrids.length == 1){
        //Need to do a for loop >_<
        switch (item.layoutGrids[0].pattern){
          case "GRID":
            gridIcon = "uniform"
            break;
          case "COLUMNS": 
            gridIcon = "columns"
            break;
          case "ROWS":
            gridIcon = "rows"
            break;
          default: gridIcon = "uniform"
        }
        } else {  
            gridIcon = "uniform" 
          
        }
        return 'icon--layout-grid-'+gridIcon
      }
    




    return {
    props,
    gridType
    }
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

.figma_icon{
  width: var(--size-xsmall);
  height: var(--size-xsmall);
  background-position: center center;
}
</style>