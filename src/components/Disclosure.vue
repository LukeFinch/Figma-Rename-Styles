<template>
    <!-- Disclosure -->
<ul class="disclosure">
 
  <li class="disclosure__item" v-bind:class="{ 'disclosure--expanded': expanded}" >
    <div class="disclosure__label" v-bind:class="{'disclosure--section': section }">{{heading}}</div> 
    <div class="disclosure__content"><slot /></div>
  </li>


</ul>
</template>
<script>
import { disclosure } from 'figma-plugin-ds'



export default {

    props: {
        heading: String,
        expanded: Boolean,
        section: Boolean,

    },
    mounted() {
      disclosure.init()
    }   
}
</script>
<style lang="scss" scoped>
.disclosure__content{
  pointer-events: auto;
}
</style>