import { useCallback } from 'react';
import { mutate } from 'swr';

export const STORE_KEY = '/stores';
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

    return {
        initializeStores,
        nearStores,
        setChoseStore,

    };
};
export default useStores;
