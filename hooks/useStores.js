import { useCallback } from 'react';
import { mutate } from 'swr';

export const STORE_KEY = '/stores';
export const STORE_CHOSE_KEY = '/stores/chose';
export const STORE_START_KEY = '/stores/start';
export const STORE_END_KEY = '/stores/end';

const useStores = () => {
    const initializeStores = useCallback((stores) => {
        mutate(STORE_KEY, stores);
    }, []);

    const setChoseStore = useCallback((choseStore)=>{
        mutate(STORE_CHOSE_KEY,choseStore)
    })

    const setStartStore = useCallback((startStore)=>{
        mutate(STORE_START_KEY, startStore)
    })

    const setEndStore = useCallback((endStore)=>{
        mutate(STORE_END_KEY, endStore)
    })


    return {
        initializeStores,
        setChoseStore,
        setStartStore,
        setEndStore

    };
};
export default useStores;
