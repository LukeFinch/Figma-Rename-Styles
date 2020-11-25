<template>
  <select v-model="selected" class="select-menu">
    <option v-for="(item, index) in options" :key="index" :value="item.value">
      {{ item.label }}
    </option>
  </select>
</template>


<script>
import { useModelWrapper } from "../../utils/modelWrapper";
import { selectMenu } from 'figma-plugin-ds'
import { onMounted } from 'vue'


export default {  
  props: {
        options: Array,
        modelValue: String
    },
    setup(props, {emit}){

      onMounted( () => {
        selectMenu.init()
      })

      return{
        selected: useModelWrapper(props,emit, "modelValue")
      }
    }

  }

</script>
<style lang="scss" scoped>

.select-menu__button{
  padding: 0px 0px 0px var(--size-xxsmall);
}

</style>

