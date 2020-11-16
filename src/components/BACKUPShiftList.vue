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
import { ref, onBeforeUpdate, onUpdated } from 'vue'

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

export default {
  data() {
    return {
      list: [],
      search: "",
      lastChecked: null,
      isCheckAll: false,
      selection: new Set(),
    };
  },
    components: {
    Swatch,
    ScrollArea
  },
  computed: {
    checkAllLabel(){
      return this.isCheckAll ? 'None' : 'All '
    },

    orderedSel() {
      //return this.selection
      return mapOrder(Array.from(this.selection), this.list);
    },

    filteredList() {

      return this.list.filter((item) => {
        return fuzzySearch(this.search.toLowerCase(), item.name.toLowerCase());
      });
    },
  },
  watch: {
    orderedSel: {
      //selection
      handler: function (newVal) {
        
        let values = new Set()

        newVal.forEach(val => values.add(val))

        this.storeSelection(values)

      },
      deep: true,
    },
  },
  mounted() {
   
        selectMenu.init();

        dispatch("requestColors")

        handleEvent("listColors", listOfColors => {
            this.list = listOfColors
            
            this.$store.commit('updateList', listOfColors)

            this.selection.forEach(sel => {
              this.filteredList.find(item => item.id === sel.id).selected = true
            })
            this.selection = new Set(this.filteredList.filter(item => item.selected === true))
            this.storeSelection(this.selection)
        })
  },
  methods: {
    refresh(){
      dispatch("requestColors")
    },
    storeSelection(selection){

      this.$store.commit('updateSelection', selection)

    },
    onRowClick: function (item, index, $event) {


       item.selected = !item.selected

      if ($event.shiftKey && this.lastChecked != null) {


        let start = index;
        let end = this.lastChecked;

        var selectedChecks = this.filteredList.slice(
          Math.min(start, end),
          Math.max(start, end) + 1
        );
        console.log('checks',selectedChecks)
       console.log('selection',this.selection)
        selectedChecks.forEach((el, key) => {
         
          //If the lastChecked is checked
          if (this.selection.has(this.filteredList[this.lastChecked])) {
            //If the checkbox isn't already selected
            if (!this.selection.has(el)) {
              //add it to the selected model
              this.selection.add(el);
              el.selected = true
            }
            //Else the last checked was just unchecked
          } else {
            //If a checkbox within the selection is checked
            if (this.selection.has(el)) {
              //remove it from the model
              this.selection.delete(el);
              el.selected = false
            }
          }
        });

        this.lastChecked = null;
      }

      this.lastChecked = index;
      this.updateCheckAll();
      this.updatePreview();
    },
    updatePreview: function () {
      this.selection = new Set(this.list.filter(el => el.selected === true))
    }
    ,
    updateCheckAll: function (color, index, $event) {
      //Check if the search is empty
      if (this.search !== "") {
        let filterCheck = true;
      //If any aren't selected, it must be unticked
      if(this.filteredList.some((el) => el.selected === false )){
            filterCheck = false
         }
      //Set the check value
        this.isCheckAll = filterCheck;
      }

    },
    checkAll: function () {
      this.lastChecked = null;
      this.isCheckAll = !this.isCheckAll;
      //this.selection = [];

      this.filteredList.forEach((el) => {
        el.selected = false
        this.selection.delete(el)
      });

      if (this.isCheckAll) {
        //Check all
        for (var key in this.filteredList) {
          this.filteredList[key].selected = true
          this.selection.add(this.filteredList[key]);
        }
      }
      this.updateCheckAll()
    },
  },

};
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