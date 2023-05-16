import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    value:null,
    listOpen:false,
    listReOpen:false,
    page:false,
    start:false,
    searchData:null,
};

const searchState = createSlice({
    name:'search',
    initialState,
    reducers:{
       setWord(state,action){
           state.value = action.payload.value
       },
        listOpen(state,action){
           state.listOpen=action.payload.listOpen
        },
        listReOpen(state,action){
            state.listReOpen=action.payload.listReOpen
        },
        pageChange(state,action){
           state.page=action.payload.page
        },
        searchStart(state,action){
           state.start=action.payload.start
        },
        setSearchData(state,action){
           state.searchData = action.payload.searchData;
        },
    },
});

export const {setWord,listOpen,listReOpen,pageChange,searchStart,setSearchData} = searchState.actions;
export default searchState.reducer;
