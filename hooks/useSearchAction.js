import {mutate} from "swr";
import {useCallback} from "react";

export const SEARCH_START_KEY = '/search'
export const SEARCH_WORD_KEY = '/search/word'

const useSearchAction = () => {
    const setSearchStart = useCallback((searchOpen)=>{
        mutate(SEARCH_START_KEY,searchOpen)
    })

    const setSearchWord = useCallback((searchWord)=>{
        mutate(SEARCH_WORD_KEY,searchWord)
    })

    return{
        setSearchStart,
        setSearchWord
    }
}
export default useSearchAction;
