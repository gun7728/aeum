'use client'

import styles from '../styles/detail.module.scss'
import {useEffect, useRef, useState} from "react";
import {IoIosArrowUp} from "react-icons/io";
import DetailHeaderList from "@/components/DetailHeaderList";
import DetailContent from "@/components/DetailContent";
import SearchSection from "@/components/SearchSection";
import useSWR from "swr";
import useStores from "@/hooks/useStores";
import useList from "@/hooks/useList";
import useMap from "@/hooks/useMap";

export default function DetailSection(){
    const {setListOpen, setListReOpen} = useList()
    const {setChoseStore} = useStores()
    const {positionChange} = useMap()
    const { data:open } = useSWR('/list/open');
    const { data:reOpen } = useSWR('/list/reopen');
    const { data:choseStore } = useSWR('/stores/chose')
    const { data:searchStart } = useSWR('/search')
    const { data:searchOpen } = useSWR('/search/open')
    const { data:startStore } = useSWR('/map/start')
    const { data:endStore } = useSWR('/map/end')
    const { data:changedPosition } = useSWR('/map/position/change')

    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)

    const setExpanded =async ()=>{
        if(open && reOpen){
            await setChoseStore(null);
            await setListOpen(true)
            await setListReOpen(false);
            return;
        }
        if(!open){
            await setListOpen(true)
        }else{
            await setListOpen(false)
            await setChoseStore(null);
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
                className={`${styles.detailSection} ${(open ? (choseStore? styles.detailExpanded: styles.expanded)  : (searchOpen?(searchStart?styles.searchResultExpanded:styles.searchStartExpanded):''))} `}
            >
                {
                    (!changedPosition && !open) && <div onClick={positionChange} className={styles.changePosition}>지도 위치로 검색</div>
                }

                {
                    (!choseStore&&searchOpen)?<SearchSection/>
                :
                    <div className={!open ? styles.header:styles.header}>
                        <button
                            className={`${styles.arrowButton} ${open ? styles.expanded : ''}`}
                            onClick={setExpanded}
                            // disabled={!currentStore}
                            aria-label={open ? '매장 정보 접기' : '매장 정보 펼치기'}
                        >
                            {
                                searchOpen?<div className={styles.goToListBtn}>☰ 목록보기</div>:reOpen?<div className={styles.goToListBtn}>☰ 목록보기</div>:<IoIosArrowUp size={20} color="#666666" />
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
