<template>

    <div class="sidebar list-column box">
      <header class="list-controls row header">
        <div class="input--with-clear">
          <div class="input input--with-icon">
          <div class="icon icon--search"></div>
          <input type="text" v-model="search" placeholder="Search" class="input__field" @input="updateCheckAll()">

          <div  v-if="search !== '' " class="icon icon--close right" @click='search = ""; updateCheckAll()'></div>
        </div>

          </div>
           <div>
                <input
                  type="checkbox"
                  class="checkbox__box"
                  id="checkAll"
                  @click="checkAll()"
                  v-model="isCheckAll"
                />
                <label
                  for="checkAll"
                  class="checkbox__label"
                  style="padding-right: 0px"
                  v-html="checkAllLabel">
                </label>
          </div>
      </header>
        <div class="row content"> 
        <ScrollArea>
            <div
              class="list-row"
              v-for="(item, index) in filteredList"
              :key="item.id"
              @click="onRowClick(item, index, $event)"
              v-bind:class="{selected: item.selected}"
            >
            <Swatch
               :layers="item.style"
               :alpha="item.alpha"
            />
              <div class="content">
                <input
                  type="checkbox"
                  class="hide"
                  v-model="selection"
                  :id="item.id"
                  :value="item"
                  @change="updateCheckAll(item, index, $event)"
                />
                
                <label for="item.id" class="type type--pos-small-normal">
                  {{ item.name }}
                </label>
              </div>
            </div>
        </ScrollArea>
        </div>

    <footer class="row footer">


        <select id="styleSelect" class="select-menu">
          <option value="1" >Paint</option>
          <option value="2" >Text</option>
          <option value="3" >Item 3</option>
        </select>

        <div class="icon-button" @click="refresh">
            <div class="icon icon--swap"></div>
        </div>

    </footer>
    </div>



</template>

<script>
import { ref, onMounted, computed, watchEffect, inject, reactive, toRefs } from 'vue'

import "../../node_modules/figma-plugin-ds/dist/figma-plugin-ds.css";
import { dispatch, handleEvent } from "../uiMessageHandler";


import Swatch from './swatch.vue'
import ScrollArea from './ScrollArea.vue'

import { mapOrder } from '../util'

import { selectMenu } from 'figma-plugin-ds'

function fuzzySearch(needle, haystack) {
  var hlen = haystack.length;
  var nlen = needle.length;
  if (nlen > hlen) {
    return false;
  }
  if (nlen === hlen) {
    return needle === haystack;
  }
  outer: for (var i = 0, j = 0; i < nlen; i++) {
    var nch = needle.charCodeAt(i);
    while (j < hlen) {
      if (haystack.charCodeAt(j++) === nch) {
        continue outer;
      }
    }
    return false;
  }
  return true;
}
const list=ref([])
export const selection = computed(() =>  {return list.value.filter(li => {return li.selected === true})})

export default {
  components: {
    Swatch,
    ScrollArea
  },
  setup( props ) {

    const search = ref('');

    var lastChecked=null
    var lastCheckedEl=null

    const isCheckAll = computed(() => {
     return filteredList.value.some((el) => el.selected === false)
    })

    const checkAllLabel = computed(() => isCheckAll.value ? 'None' : 'All')
    const orderedSel    = computed(() => mapOrder(Array.from(selection), list.value))
    const filteredList  = computed(() => list.value.filter((item) => { 
                          return fuzzySearch(search.value.toLowerCase(), item.name.toLowerCase())
                          }))

 


  function onRowClick(item, index, $event) {

       item.selected = !item.selected

      if ($event.shiftKey && lastChecked !== null && lastCheckedEl !== null) {

        let start = index;
        let end = lastChecked;

        var selectedChecks = filteredList.value.slice(
          Math.min(start, end),
          Math.max(start, end) + 1
        );

        if(lastCheckedEl.selected){
          selectedChecks.forEach(el => {
            el.selected = true
          })
        } else {
          selectedChecks.forEach(el => {
            el.selected = false
          })
        }

        lastChecked = null;
        lastCheckedEl = null;
      }

      lastChecked = index;
      lastCheckedEl = item;

    }

  function checkAll() {
      lastChecked = null;
      isCheckAll.value = !isCheckAll.value;

      filteredList.value.forEach((el) => {
        el.selected = false
      });

      if (isCheckAll.value) {
        //Check all
        for (var key in filteredList.value) {
          filteredList.value[key].selected = true
        }
      }
    }



   function refresh(){
    dispatch("requestColors")
    }  



    onMounted( () => {
   
        selectMenu.init();

        dispatch("requestColors")

        handleEvent("listColors", listOfColors => {

            let prevSel = list.value.filter(li => li.selected)

            list.value = listOfColors
            
            prevSel.forEach(sel => list.value.find((li) => li.id === sel.id).selected = sel.selected )


        

        })
  })




  watchEffect( () => {
    let values = new Set()
    orderedSel.value.forEach(val => values.add(val))

  })



  return {
      refresh,
      checkAll,
      onRowClick,
      filteredList,
      orderedSel,
      checkAllLabel,
      list,
      search,
      lastChecked,
      isCheckAll,
      selection
    }
  }
}




 
  
    
    

</script>
<style scoped lang="scss">

* {
  user-select: none;
}

.scroll-list {
  height: 100vh;
}


.wrapper {
  display: flex;
  flex-direction: row;
  align-items: top;
  box-shadow: inset -1px 0px 0 0 var(--grey);
  height: 100vh;
}

.box{
  box-shadow: inset -1px 0px 0 0 var(--grey);
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
   
  }
  .row.footer{
    flex: 0 0 40px;
    box-shadow: inset 0px 1px 0 0 var(--grey);
    display: flex;
    justify-content: space-between;
    padding: var(--size-xxxsmall);

    .select-menu {
      color: red;
      flex: 1 1 50px;
    }

  }
}

.list-controls{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: var(--size-xxsmall);
  .input--with-clear {
    width: 75%;
  }
}

.list-column {
  width: 240px;


  .list-row {
    display: grid;
    grid-template-columns: repeat(28, var(--size-xxsmall));
    padding-left: var(--size-xxsmall);
    padding-right: var(--size-xxsmall);
    grid-template-rows: var(--size-medium);

    align-items: center;
    position: relative;

    width: 100%;
    color: var(--black-8);

  &:hover:not(.selected){
    background: var(--grey)
  }

     .hide {
      visibility: hidden;
      display: none;
    }


    .style_icon {
      grid-column-end: span 4;
      justify-self: center;
      position: relative;
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
    }

    .content {
      grid-column-end: span 20;
      display: flex;
      align-items: center;

      label {
        flex-grow: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 0;
        white-space: nowrap;
        color: var(--black-8)
      }
    }
  }
}



.selected {
  background: var(--selection-a);
  &:hover{
    background: var(--selection-b)
  }
}

.right{
  right: 0;
  left: auto;
}

</style>