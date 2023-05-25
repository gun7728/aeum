import { useCallback } from 'react';
import { mutate } from 'swr';

export const STORE_KEY = '/stores';
export const STORE_CHOSE_KEY = '/stores/chose';

const useStores = () => {
    const initializeStores = useCallback((stores) => {
        mutate(STORE_KEY, stores);
    }, []);

    const setChoseStores = useCallback((choseStore)=>{
        mutate(STORE_CHOSE_KEY,choseStore)
    })

    return {
        initializeStores,
        setChoseStores
    };
};
export default useStores;
