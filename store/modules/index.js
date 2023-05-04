import {combineReducers} from "@reduxjs/toolkit";
import { HYDRATE } from 'next-redux-wrapper'
import search from "@/store/modules/searchWord";

const reducer = (state, action)=>{
    switch(action.type) {
        case HYDRATE:
            return {
                ...state,
                ...action.payload
            };
    }
    return combineReducers({
        search,
    })(state,action);
}
export default reducer
