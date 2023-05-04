import {createSlice} from "@reduxjs/toolkit";

const initialState = {value:null};

const searchWordState = createSlice({
    name:'searchWord',
    initialState,
    reducers:{
       set(state,action){
           state.value = action.payload.value
       }
    },
});

export const {set} = searchWordState.actions;
export default searchWordState.reducer;
