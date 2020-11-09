<template>
<div class="wrapper">
    <div class=colorList>
            <div>
                <input type='checkbox' @click='checkAll()' v-model='isCheckAll'>
                Check all
            </div>
               <div
               class="styleRow"
               
               v-for="(color,index) in colors"
               v-bind:class="selected.indexOf(color.id) > -1 && 'selected-row' "
               :key="color.id"
              
            >
 <!-- @click='onRowClick(color,index, $event)' -->
                    <input 
                    type="checkbox"
                    v-bind:id="color.id"
                    v-bind:value="color"
                    v-bind:name="color.name"
                    v-model="selected"
                    :checked="selected"
                    @change='updateCheckAll(color, index, $event)'
                    />
                   <Swatch
                    :layers="color.style"
                    :alpha="color.alpha"
                    />
                    <div class="row_contents">
                        <span class="styles--name  type--pos-small-normal">
                            {{color.name}}
                        </span>
                    </div>
    
            </div>

    </div>
    <div>
        <p>Selection</p>
        <ul>
            <li v-for="(sel,index) in selected" :key="index">{{sel}}</li>
        </ul>
        </div>
        </div>
</template>
<script>

// import styles from '../../node_modules/figma-plugin-ds/dist/figma-plugin-ds.css'

import { dispatch, handleEvent } from "../uiMessageHandler";
import Swatch from "./swatch.vue"

export default {
    components: {
        Swatch
    },
    data() {
        return {
            isCheckAll: false,
            colors: [],
            selected: [],
            selectedColors: '',
            lastChecked: null
        }
    },
    mounted() {

        dispatch("requestColors")

        handleEvent("listColors", listOfColors => {
            console.log(listOfColors)
            this.list = listOfColors
        })
    },
    methods: {
        onRowClick: function(color, index, $event){
            if(this.selected.includes(color.id)){
                this.selected.splice(this.selected.indexOf(color.id), 1)
            } else {
                this.selected.push(color.id)
            }
            // console.log($event, index, this.lastChecked)

            if($event.shiftKey && this.lastChecked != null){

                console.log("Shift Keying")
     
                let start = index
                let end = this.lastChecked

                var selectedChecks = this.colors.slice(Math.min(start, end), Math.max(start, end) + 1)
                console.log({'start':start, 'end':end})
                selectedChecks.forEach( (el,key) => {
                    if(this.selected.indexOf(this.colors[this.lastChecked].id) > -1){
                        console.log('checking',selectedChecks[key])
                        this.selected.push(el.id)
                    } else {
                        let selIdx = this.selected.indexOf(selectedChecks[key].id)
                         if(selIdx > -1){
                        console.log('unchecking',selectedChecks[key])
                                               
                        this.selected.splice(selIdx,1)
                        }
                    }
                })

                // for(var key = start; key < end; key++){
                //    console.log(start,end)
                //     if(this.selected.includes(color.id)){
                //         this.selected.push(this.colors[key].id)
                //     } else {
                //         this.selected.splice(this.selected.indexOf(this.colors[key].id),1)
                //     }
                // }
            }

            this.lastChecked = index

            this.updateCheckAll(color,index,$event);
        
        },
        checkAll: function(){
            this.isCheckAll = !this.isCheckAll;
            this.selected = []
            if(this.isCheckAll){ //Check all
                for (var key in this.colors){
                    this.selected.push(this.colors[key].id)
                }
            }
        },
        updateCheckAll: function(color,index,$event){
            if(this.colors.length == this.selected.length){
                this.isCheckAll = true
            } else {
                this.isCheckAll = false
            }
  
        },
        printValues: function(){
            this.selectedColor = ""
            //read the checked
            for (var key in this.selected){
                this.selectedColor += this.selected[key]+", ";
            }
        }
    }
}
</script>



<style lang="scss">

.wrapper{
    display:flex;
    flex-direction: row;
}

.colorList{
    max-width: 240px;
}

.selected-row{
    background: var(--selection-a)
}

.styleRow{
    user-select: none;
     .style_icon{
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


        display: grid;
        grid-template-columns: repeat(28,var(--size-xxsmall));
        padding-left: var(--size-xxsmall);
        padding-right: var(--size-xxsmall);
        grid-template-rows: var(--size-medium);

        align-items: center;
        position: relative;

        width: 100%;
        color: var(--black-8);

        .row_contents{
            grid-column-end: span 20;
            display: flex;
            align-items: center;

            .styles--name{
                flex-grow: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 0;
                white-space: nowrap;
            }

        }

        // input[type=checkbox] {
        //     visibility: hidden;
        //     display: none;
        // }

    
}

</style>