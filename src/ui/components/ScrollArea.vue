<template>
    <div ref="root">
        <slot></slot>
    </div>
</template>

<script>
import SimpleBar from 'simplebar'
import 'simplebar/dist/simplebar.css'



import { onMounted, ref } from 'vue'


  export default {
    setup() {
      const root = ref(null)

      onMounted(() => {
        new SimpleBar(root.value, {autoHide: false})
      })

      return {
        root
      };
    }
  }

</script>
<style lang="scss">


    .simplebar-scrollbar{
        top: 0;
        bottom: 0;
        left:0;
        right:0;
    }
    .simplebar-track.simplebar-vertical {
        width: 6px;
        padding: 2px;
        box-sizing: content-box;
    }
        .simplebar-track.simplebar-horizontal {
        height: 6px;
        padding: 2px;
        box-sizing: content-box;
    }
    
    .simplebar-hover{
      
           background: hsla(0,0%,98.8%,.5);
           border-left: 1px solid #efefef;
        
    }
    .simplebar-scrollbar:before{
        top: 2px;
        bottom: 2px;
        border-radius: 6px;
        background: rgba(0,0,0,0.15);
    }
</style>