import {mutate} from "swr";
import {useCallback} from "react";

export const SEARCH_START_KEY = '/search'
export const SEARCH_OPEN_KEY = '/search/list'
export const SEARCH_WORD_KEY = '/search/word'
export const SEARCH_RESULT_OPEN_KEY = '/search/result/list'

const useSearchAction = () => {
    const setSearchStart = useCallback((searchStart)=>{
        mutate(SEARCH_START_KEY,searchStart)
    })

    const setSearchOpen = useCallback((searchOpen)=>{
        mutate(SEARCH_OPEN_KEY,searchOpen)
    })

    const setSearchWord = useCallback((searchWord)=>{
        mutate(SEARCH_WORD_KEY,searchWord)
    })

    const setSearchResultOpen = useCallback((searchResultOpen)=>{
        mutate(SEARCH_RESULT_OPEN_KEY,searchResultOpen)
    })

    return{
        setSearchStart,
        setSearchOpen,
        setSearchWord,
        setSearchResultOpen
    }
}
export default useSearchAction;
