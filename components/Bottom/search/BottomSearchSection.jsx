'use client'
import styles from '../../../styles/search.module.scss'
import {Fragment, useEffect, useState} from "react";
import {AiOutlineClose} from "react-icons/ai";
import {FaSearchLocation} from "react-icons/fa";
import BottomSearchList from "@/components/Bottom/search/BottomSearchList";
import useSWR from "swr";
import useSearchAction from "@/hooks/useSearchAction";
import useMenu from "@/hooks/useMenu";
import {IoIosArrowUp} from "react-icons/io";

export default function BottomSearchSection() {

    //하단 바텀 메뉴 상태 관리
    const {setBottomMenuStatus} = useMenu()
    const {data:bottomMenuStatus} = useSWR('/bottom/status')

    const {setSearchWord, setAssistOption} = useSearchAction()

    const {data:startStore} = useSWR('/map/start')
    const {data:endStore} = useSWR('/map/end')

    const {data:searchStart} = useSWR('/search')
    const {data:searchWord} = useSWR('/search/word')
    const {data:assistOption} = useSWR('/assist/option')

    const [keywords, setKeywords] = useState([])
    const [keywordsFlag,setKeywordsFlag ] = useState(false);
    const [openToggle, setOpenToggle] = useState(false);


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
        setBottomMenuStatus('searchResult')
    }

    const setActiveOption = (id) => {
        var assistOptionList = [];

        if(assistOption?.length>0){
            assistOptionList = [...assistOption]
            if(assistOption.includes(id)){
                assistOptionList = assistOptionList.filter((option) => option !== id);
            }else{
                assistOptionList.push(id);
            }
        }else{
            assistOptionList.push(id);
        }

        setAssistOption(assistOptionList)
    }

    return(
        <div style={( startStore || endStore ) ?(String(bottomMenuStatus).includes('search')?{}:( bottomMenuStatus==='assist'?{}:{top:'40px'})):{}}
            className={`${bottomMenuStatus==='assist'? styles.assistSection : styles.searchSection}`}>
            {
                (bottomMenuStatus!=='searchResult' &&  bottomMenuStatus!=='assist' && bottomMenuStatus!=='assistRoute')
                ?
                <div className={styles.searchHeader}>
                    <span>최근 검색</span><span className={styles.allDeleteBtn} onClick={handleClearKeywords}>전체삭제</span>
                </div>
                :
                    bottomMenuStatus==='assist'?
                    <div className={styles.assistHeader}>
                        <div className={styles.assistToggleBtn} onClick={()=>{setOpenToggle(!openToggle)}}><span style={{color:"white"}}>관광지 종류 {openToggle?'▼':'▲'}</span></div>
                        <ul className={`${openToggle?styles.assistBtnList:styles.assistBtnListOpen}`}>
                            {/*12:관광지(tours), 14:문화시설, 15:축제공연행사, 25:여행코스, 28:레포츠, 32:숙박, 38:쇼핑, 39:음식점*/}
                            <li className={`${assistOption?.includes(12)?styles.assistBtnActive:styles.assistBtn}`} onClick={()=>{setActiveOption(12)}}><span>관광지</span></li>
                            <li className={`${assistOption?.includes(14)?styles.assistBtnActive:styles.assistBtn}`} onClick={()=>{setActiveOption(14)}}><span>문화시설</span></li>
                            <li className={`${assistOption?.includes(15)?styles.assistBtnActive:styles.assistBtn}`} onClick={()=>{setActiveOption(15)}}><span>축제공연행사</span></li>
                            <li className={`${assistOption?.includes(25)?styles.assistBtnActive:styles.assistBtn}`} onClick={()=>{setActiveOption(25)}}><span>여행코스</span></li>
                            <li className={`${assistOption?.includes(28)?styles.assistBtnActive:styles.assistBtn}`} onClick={()=>{setActiveOption(28)}}><span>레포츠</span></li>
                            <li className={`${assistOption?.includes(32)?styles.assistBtnActive:styles.assistBtn}`} onClick={()=>{setActiveOption(32)}}><span>숙박</span></li>
                            <li className={`${assistOption?.includes(38)?styles.assistBtnActive:styles.assistBtn}`} onClick={()=>{setActiveOption(38)}}><span>쇼핑</span></li>
                            <li className={`${assistOption?.includes(39)?styles.assistBtnActive:styles.assistBtn}`} onClick={()=>{setActiveOption(39)}}><span>음식점</span></li>
                        </ul>
                    </div>
                        :
                        <></>
            }
            <br/>
            {
                (bottomMenuStatus==='searchResult' || bottomMenuStatus==='assist' || bottomMenuStatus==='assistRoute')
                    ?
                    <BottomSearchList/>
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
