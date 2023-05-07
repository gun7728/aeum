import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    value:null,
    action:true,
    page:false,
    start:false,
};

const searchState = createSlice({
    name:'search',
    initialState,
    reducers:{
       setWord(state,action){
           state.value = action.payload.value
       },
        searchAction(state,action){
           state.action=action.payload.action
        },
        pageChange(state,action){
           state.page=action.payload.page
        },
        searchStart(state,action){
           state.start=action.payload.start
        }
    },
});

export const {setWord,searchAction,pageChange,searchStart} = searchState.actions;
export default searchState.reducer;