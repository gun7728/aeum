'use client'

import styles from '../../styles/detail.module.scss'
import {useEffect, useRef, useState} from "react";
import {IoIosArrowUp} from "react-icons/io";
import BottomSpotList from "@/components/Bottom/list/BottomSpotList";
import BottomSpotDetail from "@/components/Bottom/detail/BottomSpotDetail";
import BottomSearchSection from "@/components/Bottom/search/BottomSearchSection";
import useSWR from "swr";
import useStores from "@/hooks/useStores";
import useList from "@/hooks/useList";
import useMap from "@/hooks/useMap";
import useMenu from "@/hooks/useMenu";

export default function BottomMenu(){
    
    //하단 바텀 메뉴 상태 관리
    const {setBottomMenuStatus} = useMenu();
    const {data:bottomMenuStatus} = useSWR('/bottom/status')

    const {positionChange} = useMap()
    const { data:changedPosition } = useSWR('/map/position/change')

    const { data:startStore } = useSWR('/map/start')
    const { data:endStore } = useSWR('/map/end')

    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)

    const setExpanded =async ()=>{
        if(bottomMenuStatus==='open'){
            setBottomMenuStatus('default')
        }else if(bottomMenuStatus==='detail'){
            setBottomMenuStatus('default')
        }else{
            setBottomMenuStatus('open')
        }
    }

    const onTouchStart = (e) => {
        setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
        setTouchStart(e.targetTouches[0].clientY)
    }

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientY)

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const isTopSwipe = distance > 50
        if (isTopSwipe){
            if(bottomMenuStatus==='open') return
            setExpanded()
        }
    }
    return(
        <>
            <div
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                style={(endStore && startStore)?{transform:'translateY(100%)'}:{}}
                className={`${styles.detailSection} 
                    ${(bottomMenuStatus==='open' && styles.expanded )} 
                    ${(bottomMenuStatus==='detail' && styles.detailExpanded)} 
                    ${(bottomMenuStatus==='search' && styles.searchStartExpanded)} 
                    ${(bottomMenuStatus==='searchResult' && styles.searchResultExpanded)} 
                `}
            >
                {/*<span>{bottomMenuStatus}</span>*/}
                 {
                    ((bottomMenuStatus==='default') && !changedPosition) &&
                    <div onClick={()=>{positionChange(true)}} className={styles.changePosition}>지도 위치로 검색</div>
                }

                {
                    (bottomMenuStatus==='search' || bottomMenuStatus==='searchResult')?<BottomSearchSection/>
                :
                    <div className={styles.header}>
                        <button
                            className={`${styles.arrowButton} 
                                ${(bottomMenuStatus==='open' || bottomMenuStatus==='detail' )&& styles.expanded}
                            `}
                            onClick={setExpanded}
                            // disabled={!currentStore}
                            aria-label={
                                bottomMenuStatus==='open'
                                    ? '매장 정보 접기' : '매장 정보 펼치기'
                            }
                        >
                            {
                                bottomMenuStatus==='search'?<div className={styles.goToListBtn}>☰ 목록보기</div>
                                    :bottomMenuStatus==='detail'?<div className={styles.goToListBtn}>☰ 목록보기</div>
                                        :<IoIosArrowUp size={20} color="#666666" />
                            }

                        </button>
                        {
                            bottomMenuStatus==='detail'?<BottomSpotDetail/>:<BottomSpotList/>
                        }
                    </div>
                }
            </div>

        </>
    )
}
