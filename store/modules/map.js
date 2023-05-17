import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    mapLoading:false,
    routePolyline:[],
};

const mapState = createSlice({
    name:'map',
    initialState,
    reducers:{
        setMapLoading(state,action){
            state.mapLoading = action.payload.mapLoading
        },
        setRoutePolyline(state, action){
            state.routePolyline = action.payload.routePolyline
        }
    },
});

export const {setMapLoading, setRoutePolyline} = mapState.actions;
export default mapState.reducer;
