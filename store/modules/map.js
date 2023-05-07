import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    mapLoading:false,
};

const mapState = createSlice({
    name:'map',
    initialState,
    reducers:{
        setMapLoading(state,action){
            state.mapLoading = action.payload.mapLoading
        },
    },
});

export const {setMapLoading} = mapState.actions;
export default mapState.reducer;
