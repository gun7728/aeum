import {mutate} from "swr";
import {useCallback} from "react";

export const SEARCH_START_KEY = '/search'
export const SEARCH_OPEN_KEY = '/search/open'
export const SEARCH_WORD_KEY = '/search/word'
export const SEARCH_RESULT_OPEN_KEY = '/search/result/list'
export const SEARCH_DATA_KEY ='/search/list'

export const STOP_OVER_OPEN_KEY = '/stopOver/open'


export const ASSIST_OPEN_KEY = '/assist/open'
export const ASSIST_OPTION_KEY = '/assist/option'


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

    const setSearchData = useCallback((searchData)=>{
        mutate(SEARCH_DATA_KEY,searchData)
    })

    const setStopOverOpen = useCallback((stopOver)=>{
        mutate(STOP_OVER_OPEN_KEY,stopOver)
    })

    const setAssistOpen = useCallback((assistOpen)=>{
        mutate(ASSIST_OPEN_KEY,assistOpen)
    })

    const setAssistOption = useCallback((assistOption=[])=>{
        mutate(ASSIST_OPTION_KEY,assistOption)
    })

    return{
        setSearchStart,
        setSearchOpen,
        setSearchWord,
        setSearchResultOpen,
        setSearchData,
        setStopOverOpen,
        setAssistOpen,
        setAssistOption
    }
}
export default useSearchAction;
