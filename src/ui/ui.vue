

<template>
<div class="app-wrapper">
  
  <ShiftList :list="this.colors" />


<div class="box controls-wrapper">
<ScrollArea class="row content ">
<div class="input">
  <label for="find" class="label">Find</label >
  <input id="find" type="input" class="input__field" placeholder="Find" v-model="state.find">
</div>

  <div class="switch">
    <input class="switch__toggle" type="checkbox" id="ignoreCase" value="i" v-model="state.matchCase">
    <label class="switch__label" for="ignoreCase">Match Case</label>
</div>

<div class="input">
  <label for="replace" class="label">Replace</label>
  <input id="replace" type="input" class="input__field" placeholder="Replace" v-model="state.replace">
</div>


  <Disclosure heading="Preview" :expanded=true :section=false :scrollInside=true>
      <ul class="type type--pos-small-normal">
        <li v-for="(item, index) in state.replacedPreview" :key="index">
          {{item.name}} 
        </li>
      </ul>
  </Disclosure>


</ScrollArea>

    <footer class="row footer">


      	<button class="button button--primary" @click='rename'>Rename</button>

    </footer>
</div>

</div>

</template>

<script>

import { selection } from './components/ShiftList.vue'


import styles from 'figma-plugin-ds/dist/figma-plugin-ds.css'

import { ref, reactive, computed, watchEffect, onMounted } from 'vue'

import { dispatch, handleEvent } from "../utils/uiMessageHandler";

import { mapOrder } from '../utils/util'


import Disclosure from './components/Disclosure.vue'

import { default as ShiftList } from './components/ShiftList.vue'
import ScrollArea from './components/ScrollArea.vue'



export default {
  components: {
    ShiftList,
    Disclosure,
    ScrollArea
  },
  setup(props){

  const state = reactive({
    matchCase: false,
    find: "",
    replace: "",
    basePreview: computed(() => {return [...selection.value]}),
    replacedPreview: computed(() => {
                      //Assign a new mutable array thats a clone of the selection
                      let newPreview = state.basePreview.value ? state.basePreview.value.slice(0).map(o => {return Object.assign({},o)}) : [];
                      if(state.find !== ""){
                        newPreview.forEach(prev => {
                          let flags  = `g${state.matchCase ? 'i' : ''}`
                            prev.name = prev.name.replace(new RegExp (state.find, flags ), state.replace)
                        })                      
                      }
                      return newPreview
                      })
  })

  function orderedPreview(){
      return mapOrder(this.$store.state.selection, this.$store.state.list, 'id')
  }

onMounted( () => {
    watchEffect(() => state.basePreview.value = [...selection.value])

})







 function rename(){
       let data  = state.replacedPreview.map(x => {return {name: x.name, id: x.id}})
       dispatch('rename',data)
    }
    
    return {
      state,
      rename,
      colors: [],
    };
  }

 


};
</script>

<style lang='scss' scoped>
// @import "./figma-ui/figma-plugin-ds";

.label{
  color: var(--black-8)
}

.app-wrapper{
  display: flex;
  flex-direction: row;
  .sidebar{
    flex: 0 0 240px;
  }
  .controls-wrapper{
    flex: 1 1 50%;
    height: 100vh;
  }
}

.switch{
  cursor: pointer;
}


.input {
  display: flex;
  flex-direction: row;
  label {
    margin: 0px;
    padding-left: 0px;
    flex: 1 1 33%;
  }
}


.box{
  display: flex;
  flex-flow: column;
  height: 100vh;
    .row.header{
    flex: 0 1 40px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    box-shadow: inset 0px -1px 0 0 var(--grey);
  }
  .row.content{
    flex: 1 1 auto;
    min-height: 200px;
    padding: var(--size-small);
  }
  .row.footer{
    flex: 0 0 40px;
    box-shadow: inset 0px 1px 0 0 var(--grey);
    display: flex;
    justify-content: flex-end;
    padding: var(--size-xxxsmall);
  
  }
}

</style>
