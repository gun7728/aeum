'use client'

import styles from '../styles/detail.module.scss'
import {useEffect, useState} from "react";
import {IoIosArrowUp} from "react-icons/io";
import DetailHeader from "@/components/DetailHeader";

export default function DetailSection({map}){
    const [expanded, setExpanded] = useState(false)
    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)
    const [expandedFlag, setExpandedFlag] = useState(false)

    const onClickArrow = ()=>{
        setExpanded(!expanded)
    }

    useEffect(()=>{
        setExpanded(expandedFlag)
    },[expandedFlag])


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
            setExpandedFlag(true)
        }else if(isBottomSwipe){
            setExpandedFlag(false)
        }
    }

    return(
        <div
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className={`${styles.detailSection} ${expanded ? styles.expanded : ''} `}
        >
            <div className={styles.header}>
                <button
                    className={`${styles.arrowButton} ${expanded ? styles.expanded : ''}`}
                    onClick={onClickArrow}
                    // disabled={!currentStore}
                    aria-label={expanded ? '매장 정보 접기' : '매장 정보 펼치기'}
                >
                    <IoIosArrowUp size={20} color="#666666" />
                </button>
                <DetailHeader
                    map={map}
                    // currentStore={currentStore}
                    expanded={expanded}
                    onClickArrow={() => setExpanded(!expanded)}
                />
                <br/>
                {/*<DetailContent currentStore={currentStore} expanded={expanded} />*/}
            </div>
        </div>
    )
}
