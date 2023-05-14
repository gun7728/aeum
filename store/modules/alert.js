import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    alert:false,
    msg:null,
};

const alertState = createSlice({
    name:'alert',
    initialState,
    reducers:{
        setAlert(state,action){
            state.alert = action.payload.alert
        },
        setMsg(state,action){
            state.msg = action.payload.msg
        }
    },
});

export const {setAlert,setMsg} = alertState.actions;
export default alertState.reducer;
