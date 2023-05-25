'use client'
import styles from '../styles/search.module.scss'
import {Fragment, useEffect, useState} from "react";
import {AiOutlineClose} from "react-icons/ai";
import {FaSearchLocation} from "react-icons/fa";
import SearchResult from "@/components/SearchResult";
import useSWR from "swr";
import useSearchAction from "@/hooks/useSearchAction";

export default function SearchSection() {

    const {setSearchWord, setSearchStart} = useSearchAction()

    const {data:startStore} = useSWR('/stores/start')
    const {data:endStore} = useSWR('/stores/end')
    const {data:searchStart} = useSWR('/search')
    const {data:searchWord} = useSWR('/search/word')
    const [keywords, setKeywords] = useState([])
    const [keywordsFlag,setKeywordsFlag ] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const result = localStorage.getItem('keywords') || '[]'
            setKeywords(JSON.parse(result).splice(0,4))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('keywords', JSON.stringify(keywords))
        setKeywordsFlag(true);
    }, [keywords])

    useEffect(()=>{
        if(keywordsFlag){
            handleAddKeyword(searchWord)
        }
    },[searchWord])


    const handleAddKeyword = (text) => {
        if(text==null) return
        const newKeyword = {
            id: Date.now(),
            text: text,
        }
        setKeywords([newKeyword, ...keywords.splice(0,3)])
    }

    //검색어 전체 삭제
    const handleClearKeywords = () => {
        setKeywords([])
    }

    //검색어 개별
    const handleRemoveKeyword = (id) => {
        const nextKeyword = keywords.filter((keyword) => {
            return keyword.id != id
        })
        setKeywords(nextKeyword)
    }

    const clickKeyword = (keyword) => {
        setSearchWord(keyword)
        setSearchStart(true)
    }

    return(
        <div style={( startStore || endStore ) ?(searchStart?{}:{top:'40px'}):{}}
            className={`${styles.searchSection}`}>
            {
                searchStart
                    ?
                    <></>
                    :
                <div className={styles.searchHeader}>
                    <span>최근 검색</span><span className={styles.allDeleteBtn} onClick={handleClearKeywords}>전체삭제</span>
                </div>
            }
            <br/>
            {
                searchStart
                    ?
                    <SearchResult/>
                    :
                    keywords.length>0?
                    keywords.map((e)=>
                        <div  key={e.id} className={styles.searchList}>
                            <FaSearchLocation style={{zoom:1.1}}/>
                            <p className={styles.title} onClick={()=>{clickKeyword(e.text)}}>{e.text}</p>
                            <AiOutlineClose className={styles.deleteBtn} onClick={() => handleRemoveKeyword(e.id)}/>
                        </div>
                    ):''
            }
        </div>
    )
}
