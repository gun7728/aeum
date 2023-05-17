import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    touristData:null,
    curPosition:[],
    curLocation:null,
    curDetail: null,
    startPoint:null,
    startPointMarker:{},
    endPoint:null,
    endPointMarker:{}
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
        },
        setCurDetail(state,action){
            state.curDetail = action.payload.curDetail
        },
        setStartPoint(state,action){
            state.startPoint = action.payload.startPoint
        },
        setEndPoint(state,action){
            state.endPoint = action.payload.endPoint
        },
        setStartPointMarker(state,action){
            state.startPointMarker = action.payload.startPointMarker
        },
        setEndPointMarker(state,action){
            state.endPointMarker = action.payload.endPointMarker
        }
    },
});

export const {setTouristData,setCurPosition,setCurLocation,setCurDetail,setStartPoint,setEndPoint,setStartPointMarker,setEndPointMarker} = dataState.actions;
export default dataState.reducer;
