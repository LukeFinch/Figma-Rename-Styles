<template>
<ul class="disclosure"> 
  <li class="disclosure__item" v-bind:class="{ 'disclosure--expanded': expanded}" >
    <div class="disclosure__label" v-bind:class="{'disclosure--section': section }">{{heading}}</div> 
    <div class="disclosure__content"><slot /></div>
  </li>


</ul>
</template>
<script>
import { disclosure } from 'figma-plugin-ds'
import { onMounted } from 'vue'


export default {
  props: {
        heading: String,
        expanded: Boolean,
        section: Boolean,

    },
  setup(props){


  onMounted( () => {
      disclosure.init() 
    }   
  )
}
}
</script>
<style lang="scss" scoped>
.disclosure__content{
  pointer-events: auto;
}
</style>