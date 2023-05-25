import { useCallback } from 'react';
import { mutate } from 'swr';

export const INITIAL_CENTER = [37.71344096516783, 126.8666797982575];
export const INITIAL_ZOOM = 5;

export const MAP_KEY = '/map';
export const MAP_CUR_POS_KEY = '/map/curPos';
export const MAP_CUR_LOC_KEY = '/map/curLoc';

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

    return {
        initializeMap,
        initializeCurrentPosition,
        initializeCurrentLocation
    };
};
export default useMap;
