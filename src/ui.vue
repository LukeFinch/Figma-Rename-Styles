

<template>
<div class="app-wrapper">
  
  <ShiftList :list="this.colors" />


<div class="box controls-wrapper">
<ScrollArea class="row content ">
<div class="input">
  <label for="find" class="label">Find</label >
  <input id="find" type="input" class="input__field" placeholder="Find" v-model="find">
</div>

  <div class="switch">
    <input class="switch__toggle" type="checkbox" id="ignoreCase" value="i" v-model="regexflags" checked>
    <label class="switch__label" for="ignoreCase">Match Case</label>
</div>

<div class="input">
  <label for="replace" class="label">Replace</label>
  <input id="replace" type="input" class="input__field" placeholder="Replace" v-model="replace">
</div>


  <Disclosure heading="Preview" :expanded=true :section=false :scrollInside=true>
      <ul class="type type--pos-small-normal">
        <li v-for="(item, index) in this.newPreview" :key="index">
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

import styles from '../node_modules/figma-plugin-ds/dist/figma-plugin-ds.css'

import { toRef, unref } from 'vue'

import { dispatch, handleEvent } from "./uiMessageHandler";

import { mapOrder } from './util.ts'


import Disclosure from './components/Disclosure.vue'
import ColorList from './components/colorList.vue'
import ShiftList from './components/ShiftList.vue'
import ScrollArea from './components/ScrollArea.vue'



export default {
  components: {
    ColorList,
    ShiftList,
    Disclosure,
    ScrollArea
  },
  data() {
    return {
      selection: new Set(),
      preview: [],
      colors: [],
      message: "",
      find: "",
      replace: "",
      regexflags: ['i'],
      newPreview: [],
    };
  },
  watch:{
    regexflags:{
      handler: function(){
        this.updateFindReplace()
      },
      deep: true      
    },
    Sel: { 
      handler: function(){

      this.updateFindReplace()

    },
      deep: true
    },
     '$store.state.list': function(){
      this.list = this.$store.state.list
    },
    '$store.state.selection': function() {
      this.selection = this.$store.state.selection
    },
    find: function() {
      this.updateFindReplace()
    },
    replace: function() {
      this.updateFindReplace()
    }
  },
  mounted() {
  },
  computed: {
    Sel(){
      return this.selection
    },
    orderedPreview(){
      return mapOrder(this.$store.state.selection, this.$store.state.list, 'id')
    }
  },
  methods: {
    updateFindReplace(){

      this.preview = Array.from(this.$store.state.selection)

     // let newPrev = Object.assign({}, ...Object.keys(this.preview).map(k => ({[k]: this.preview[k]})))

     let newPreview = this.preview.map(obj => {
          return Object.assign({}, ...Object.keys(obj).map(k => ({[k]: obj[k]})))
      })

      this.newPreview = newPreview    

   
      this.newPreview.forEach(sel => {    
        //console.log('sel',sel)
        if(this.find !== ""){
          let reg = new RegExp(this.find,'g'+this.regexflags.join(""))  
          sel.name = sel.name.replace(reg, replace.value)
        }
      })
    },
    rename(){    
       let data  = this.newPreview.map(x => {return {name: x.name, id: x.id}})
       dispatch('rename',data)
    },

    createNode() {
      // This shows how the UI code can send messages to the main code.
      dispatch("createNode");
    }
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
