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
import useSearchAction from "@/hooks/useSearchAction";
import useSWR from "swr";
import useStores from "@/hooks/useStores";
import useList from "@/hooks/useList";

export default function DetailSection({map}){
    const {setListOpen, setListReOpen} = useList()
    const {setChoseStore} = useStores()
    const { data:open } = useSWR('/list/open');
    const { data:reOpen } = useSWR('/list/reopen');
    const { data:choseStore } = useSWR('/stores/chose')
    const { data:startStore } = useSWR('/stores/start')
    const { data:endStore } = useSWR('/stores/end')
    const { data:searchStart } = useSWR('/search')

    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)
    const searchStore = useSelector((state)=>state.searchState)

    const setExpanded =async ()=>{
        if(open && reOpen){
            setChoseStore(null);
            // await dispatch(dataStateAction.setCurDetail({curDetail:null}))
            setListOpen(true)
            setListReOpen(false);
            return;
        }
        if(!open){
            setListOpen(true)
        }else{
            setListOpen(false)
            setChoseStore(null);
            // dispatch(dataStateAction.setCurDetail({curDetail:null}))
        }
    }

    useEffect(()=>{
        if(choseStore){
            setExpanded()
        }else if(choseStore==null){
            setListOpen(false)
        }
    },[choseStore])

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
            if(open) return
            if(searchStart) return
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
                style={(endStore && startStore)?{transform:'translateY(100%)'}:{}}
                className={`${styles.detailSection} ${(open ? (choseStore? styles.detailExpanded: styles.expanded)  : (searchStore.page?(searchStart?styles.searchResultExpanded:styles.searchStartExpanded):''))} `}
            >
                {
                    (!choseStore&&searchStore.page)?<SearchSection/>
                :
                    <div className={!open ? styles.header:styles.header}>
                        <button
                            className={`${styles.arrowButton} ${open ? styles.expanded : ''}`}
                            onClick={setExpanded}
                            // disabled={!currentStore}
                            aria-label={open ? '매장 정보 접기' : '매장 정보 펼치기'}
                        >
                            {
                                searchStore.page?<div className={styles.goToListBtn}>☰ 목록보기</div>:reOpen?<div className={styles.goToListBtn}>☰ 목록보기</div>:<IoIosArrowUp size={20} color="#666666" />
                            }

                        </button>
                        {
                            choseStore?<DetailContent/>:<DetailHeaderList/>
                        }
                        {/*<DetailContent currentStore={currentStore} expanded={expanded} />*/}
                    </div>
                }
            </div>

        </>
    )
}
