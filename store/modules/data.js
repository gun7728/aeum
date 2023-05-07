import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    touristData:null,
    curPosition:[],
    curLocation:null,
};

const dataState = createSlice({
    name:'data',
    initialState,
    reducers:{
        setTouristData(state,action){
            state.touristData = action.payload.touristData
        },
        setCurPosition(state,action){
            state.curPosition = action.payload.curPosition
        },
        setCurLocation(state,action){
            state.curLocation = action.payload.curLocation
        }
    },
});

export const {setTouristData,setCurPosition,setCurLocation} = dataState.actions;
export default dataState.reducer;
