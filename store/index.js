import {configureStore}  from '@reduxjs/toolkit'
import {createWrapper} from "next-redux-wrapper";

import reducer from "@/store/modules";
import searchWord from "@/store/modules/searchWord";

export const store =  configureStore({
    reducer : {
        searchWord : searchWord,
    },
});
