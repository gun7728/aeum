import { useCallback } from 'react';
import { mutate } from 'swr';

export const ALERT_KEY = '/alert';
export const ALERT_MSG_KEY = '/alert/msg';

const useAlert = () => {
    const setAlertStart = useCallback((alertStart) => {
        mutate(ALERT_KEY, alertStart);
    }, []);

    const setAlertMsg = useCallback((alertMsg)=>{
        mutate(ALERT_MSG_KEY,alertMsg)
    })

    return {
        setAlertStart,
        setAlertMsg
    };
};
export default useAlert;
