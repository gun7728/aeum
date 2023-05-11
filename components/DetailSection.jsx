'use client'

import styles from '../styles/detail.module.scss'
import {useEffect, useState} from "react";
import {IoIosArrowUp} from "react-icons/io";
import DetailHeaderList from "@/components/DetailHeaderList";
import {useDispatch, useSelector} from "react-redux";
import * as searchStateAction from "@/store/modules/search";
import * as dataStateAction from "@/store/modules/data";
import DetailHeaderContent from "@/components/DetailHeaderContent";
import DetailContent from "@/components/DetailContent";
import SearchSection from "@/components/SearchSection";

export default function DetailSection({map}){
    const dispatch = useDispatch();
    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)
    const searchStore = useSelector((state)=>state.searchState)
    const dataStore = useSelector(state => state.dataState)

    const setExpanded =()=>{
        if(searchStore.action){
            dispatch(searchStateAction.searchAction({action:false}))
        }else{
            dispatch(searchStateAction.searchAction({action:true}))
            dispatch(dataStateAction.setCurDetail({curDetail:null}))
        }

    }

    useEffect(()=>{
        if(dataStore.curDetail){
            setExpanded()
        }else if(dataStore.curDetail==null){
            dispatch(searchStateAction.searchAction({action:true}))
        }
    },[dataStore.curDetail])

// the required distance between touchStart and touchEnd to be detected as a swipe
    const minSwipeDistance = 50

    const onTouchStart = (e) => {
        setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
        setTouchStart(e.targetTouches[0].clientY)
    }

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientY)

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const isTopSwipe = distance > minSwipeDistance
        const isBottomSwipe = distance < -minSwipeDistance
        if (isTopSwipe){
            if(!searchStore.action) return
            setExpanded()
        }else if(isBottomSwipe){
            // if(searchStore.action) return
            // setExpanded()
        }
    }

    return(
        <div
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className={`${styles.detailSection} ${(!searchStore.action ? (dataStore.curDetail? styles.detailExpanded: styles.expanded)  : (searchStore.page?(searchStore.searchData?styles.searchResultExpanded:styles.searchStartExpanded):''))} `}
        >

            {
                searchStore.page?<SearchSection/>

            :
                <div className={searchStore.action ? styles.header:styles.header}>
                    <button
                        className={`${styles.arrowButton} ${!searchStore.action ? styles.expanded : ''}`}
                        onClick={setExpanded}
                        // disabled={!currentStore}
                        aria-label={!searchStore.action ? '매장 정보 접기' : '매장 정보 펼치기'}
                    >
                        <IoIosArrowUp size={20} color="#666666" />
                    </button>
                    {
                        dataStore.curDetail?<DetailContent map={map}/>:<DetailHeaderList/>
                    }
                    {/*<DetailContent currentStore={currentStore} expanded={expanded} />*/}
                </div>
            }
        </div>
    )
}
