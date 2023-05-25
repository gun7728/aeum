import {useCallback} from "react";
import {mutate} from "swr";

export const LIST_OPEN_KEY = '/list/open'
export const LIST_RE_OPEN_KEY = '/list/reopen'

const useList = () => {
    //리스트 열었냐
    const setListOpen = useCallback((open)=>{
        mutate(LIST_OPEN_KEY,open)
    },[])

    //리스트 열어야 다시 하냐
    const setListReOpen = useCallback((reOpen)=>{
        mutate(LIST_RE_OPEN_KEY,reOpen)
    },[])

    return{
        setListOpen,
        setListReOpen
    }
}
export default useList
