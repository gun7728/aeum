import { useCallback } from 'react';
import { mutate } from 'swr';

export const BOTTOM_MENU = '/bottom/status';
const useMenu = () => {

    const setBottomMenuStatus = useCallback((bottomMenuStatus='default')=>{
        mutate(BOTTOM_MENU,bottomMenuStatus)
    })

    return {
        setBottomMenuStatus
    };
};
export default useMenu;
