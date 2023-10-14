import { useCallback } from 'react';
import { mutate } from 'swr';

export const STORE_KEY = '/stores';
export const STORE_ASSIST_KEY = '/stores/assist';
export const STORE_ASSIST_ADD_KEY = '/stores/assist/add';
export const STORE_ASSIST_FILTERED_KEY = '/stores/assist/filtered';
export const STORE_NEAR_KEY = '/stores/near';
export const STORE_CHOSE_KEY = '/stores/chose';

const useStores = () => {
    const initializeStores = useCallback((stores) => {
        mutate(STORE_KEY, stores);
    }, []);

    const nearStores = useCallback((stores) => {
        mutate(STORE_NEAR_KEY, stores);
    }, []);

    const setChoseStore = useCallback((choseStore)=>{
        mutate(STORE_CHOSE_KEY,choseStore)
    })

    const setAssistStore = useCallback((assistStore)=>{
        mutate(STORE_ASSIST_KEY,assistStore)
    })

    const setAssistFilteredStoreMarker = useCallback((assistFilteredStore)=>{
        mutate(STORE_ASSIST_FILTERED_KEY,assistFilteredStore)
    })

    const setAssistAddStore = useCallback((assistAddStore)=>{
        mutate(STORE_ASSIST_ADD_KEY,assistAddStore)
    })

    return {
        initializeStores,
        nearStores,
        setChoseStore,
        setAssistStore,
        setAssistAddStore,
        setAssistFilteredStoreMarker

    };
};
export default useStores;
