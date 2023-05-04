import {configureStore}  from '@reduxjs/toolkit'
import {createWrapper} from "next-redux-wrapper";

import reducer from "@/store/modules";
import searchState from "@/store/modules/search";

export const store =  configureStore({
    reducer : {
        searchState : searchState,
    },
});
