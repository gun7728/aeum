import { useCallback } from 'react';
import { mutate } from 'swr';
import {STORE_KEY} from "@/hooks/useStores";

export const INITIAL_CENTER = [37.71344096516783, 126.8666797982575];
export const INITIAL_ZOOM = 5;

export const MAP_KEY = '/map';
export const MAP_POSITION_CHANGE_KEY = '/map/position/change';
export const MAP_CUR_POS_KEY = '/map/curPos';
export const MAP_CUR_LOC_KEY = '/map/curLoc';
export const STORE_START_KEY = '/map/start';
export const STORE_END_KEY = '/map/end';
export const ROUTE_KEY = '/map/route';
export const CENTER_KEY = '/map/center';
export const BOUND_KEY = '/map/bound';
export const ZOOM_KEY = '/map/zoom';
export const ALL_MARKER_KEY = '/map/all/marker';
export const SCREEN_MARKER_KEY = '/map/screen/marker';

const useMap = () => {
    const initializeMap = useCallback((map) => {
        mutate(MAP_KEY, map);
    }, []);

    const initializeCurrentPosition = useCallback((position) => {
        mutate(MAP_CUR_POS_KEY, position);
    }, []);

    const initializeCurrentLocation = useCallback((location) => {
        mutate(MAP_CUR_LOC_KEY, location);
    }, []);


    const setStartStore = useCallback((startStore)=>{
        mutate(STORE_START_KEY, startStore)
    })

    const setEndStore = useCallback((endStore)=>{
        mutate(STORE_END_KEY, endStore)
    })

    const setRoute = useCallback((route)=>{
        mutate(ROUTE_KEY, route)
    })

    const changeCenter = useCallback((center)=>{
        mutate(CENTER_KEY, center)
    })

    const changeBound = useCallback((bound)=>{
        mutate(BOUND_KEY, bound)
    })

    const changeZoom = useCallback((zoom)=>{
        mutate(ZOOM_KEY, zoom)
    })

    const allStoresMarker = useCallback((allMarker) => {
        mutate(ALL_MARKER_KEY, allMarker);
    });

    const screenMarker = useCallback((screenMarker) => {
        mutate(SCREEN_MARKER_KEY, screenMarker);
    });

    const positionChange = useCallback((positionChange) => {
        mutate(MAP_POSITION_CHANGE_KEY, positionChange);
    });


    return {
        initializeMap,
        initializeCurrentPosition,
        initializeCurrentLocation,
        setStartStore,
        setEndStore,
        setRoute,
        changeBound,
        changeZoom,
        allStoresMarker,
        screenMarker,
        changeCenter,
        positionChange
    };
};
export default useMap;
