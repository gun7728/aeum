'use client'

import styles from '../styles/detail.module.scss'
import {useEffect, useRef, useState} from "react";
import {IoIosArrowUp} from "react-icons/io";
import DetailHeaderList from "@/components/DetailHeaderList";
import {useDispatch, useSelector} from "react-redux";
import * as searchStateAction from "@/store/modules/search";
import * as dataStateAction from "@/store/modules/data";
import DetailHeaderContent from "@/components/DetailHeaderContent";
import DetailContent from "@/components/DetailContent";
import SearchSection from "@/components/SearchSection";

export default function DetailSection({map}){
    const openBtn = useRef();
    const dispatch = useDispatch();
    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)
    const searchStore = useSelector((state)=>state.searchState)
    const dataStore = useSelector(state => state.dataState)

    const setExpanded =async ()=>{
        if(searchStore.listOpen && searchStore.listReOpen){
            await dispatch(dataStateAction.setCurDetail({curDetail:null}))
            dispatch(searchStateAction.listOpen({listOpen:true}))
            dispatch(searchStateAction.listReOpen({listReOpen:false}))
            return;
        }
        if(!searchStore.listOpen){
            dispatch(searchStateAction.listOpen({listOpen:true}))
        }else{
            dispatch(searchStateAction.listOpen({listOpen:false}))
            dispatch(dataStateAction.setCurDetail({curDetail:null}))
        }
    }

    useEffect(()=>{
        if(dataStore.curDetail){
            setExpanded()
        }else if(dataStore.curDetail==null){
            dispatch(searchStateAction.listOpen({listOpen:false}))
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
            if(searchStore.listOpen) return
            if(searchStore.start) return
            setExpanded()
        }else if(isBottomSwipe){
            // if(searchStore.action) return
            // setExpanded()
        }
    }
    return(
        <>
            {/*{*/}
            {/*    */}
            {/*}*/}
            <div
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                style={(dataStore.endPoint && dataStore.startPoint)?{transform:'translateY(100%)'}:{}}
                className={`${styles.detailSection} ${(searchStore.listOpen ? (dataStore.curDetail? styles.detailExpanded: styles.expanded)  : (searchStore.page?(searchStore.start?styles.searchResultExpanded:styles.searchStartExpanded):''))} `}
            >
                {
                    (!dataStore.curDetail&&searchStore.page)?<SearchSection/>
                :
                    <div className={!searchStore.listOpen ? styles.header:styles.header}>
                        <button
                            ref={openBtn}
                            className={`${styles.arrowButton} ${searchStore.listOpen ? styles.expanded : ''}`}
                            onClick={setExpanded}
                            // disabled={!currentStore}
                            aria-label={searchStore.listOpen ? '매장 정보 접기' : '매장 정보 펼치기'}
                        >
                            {
                                searchStore.page?<div className={styles.goToListBtn}>☰ 목록보기</div>:searchStore.listReOpen?<div className={styles.goToListBtn}>☰ 목록보기</div>:<IoIosArrowUp size={20} color="#666666" />
                            }

                        </button>
                        {
                            dataStore.curDetail?<DetailContent map={map}/>:<DetailHeaderList/>
                        }
                        {/*<DetailContent currentStore={currentStore} expanded={expanded} />*/}
                    </div>
                }
            </div>

        </>
    )
}
