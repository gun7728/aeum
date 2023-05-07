import {configureStore}  from '@reduxjs/toolkit'


import searchState from "@/store/modules/search";
import dataState from "@/store/modules/data"
import mapState from "@/store/modules/map"

export const store =  configureStore({
    reducer : {
        searchState : searchState,
        dataState : dataState,
        mapState : mapState,
    },
});
