import { useCallback } from 'react';
import { mutate } from 'swr';

export const LOADING_KEY = '/loading';

const useLoading = () => {
    const setLoading = useCallback((alertStart) => {
        mutate(LOADING_KEY, alertStart);
    }, []);

    return {
        setLoading,
    };
};
export default useLoading;
