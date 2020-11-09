import { createStore } from "vuex"

export default createStore({

    state() {
        return {
            selection: new Set(),
            list: [],
        }
    },
    mutations: {
        updateSelection(state: any,newSelection: Set<Object>) {

            state.selection = newSelection

        },
        updateList(state: any, newList: Array<Object>){

            state.list = newList
        }
    }


})