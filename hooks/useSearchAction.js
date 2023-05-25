import {mutate} from "swr";
import {useCallback} from "react";

export const LIST_OPEN = false;
export const LIST_RE_OPEN = false;

export const LIST_OPEN_KEY = '/list/open'
export const LIST_RE_OPEN_KEY = '/list/reopen'
export const SEARCH_START_KEY = '/search'
export const SEARCH_WORD_KEY = '/search/word'

const useSearchAction = () => {
    //리스트 열었냐
    const setListOpen = useCallback((open)=>{
        mutate(LIST_OPEN_KEY,open)
    },[])

    //리스트 열어야 다시 하냐
    const setListReOpen = useCallback((reOpen)=>{
        mutate(LIST_RE_OPEN_KEY,reOpen)
    },[])

    const setSearchStart = useCallback((searchOpen)=>{
        mutate(SEARCH_START_KEY,searchOpen)
    })

    const setSearchWord = useCallback((searchWord)=>{
        mutate(SEARCH_WORD_KEY,searchWord)
    })

    return{
        setListOpen,
        setListReOpen,
        setSearchStart,
        setSearchWord
    }
}
export default useSearchAction;
