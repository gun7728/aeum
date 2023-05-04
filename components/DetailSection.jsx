'use client'

import styles from '../styles/detail.module.scss'
import {useEffect, useState} from "react";
import {IoIosArrowUp} from "react-icons/io";
import DetailHeader from "@/components/DetailHeader";
import {useDispatch, useSelector} from "react-redux";
import * as searchStateAction from "@/store/modules/search";

export default function DetailSection({map}){
    const dispatch = useDispatch();
    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)
    const searchStore = useSelector((state)=>state.searchState)

    const expanded=()=>{
        dispatch(searchStateAction.searchAction({action:false}))
    }

    const unExpanded=()=>{
        dispatch(searchStateAction.searchAction({action:true}))
    }

    const setExpanded =()=>{
        searchStore.action
            ? dispatch(searchStateAction.searchAction({action:false}))
            : dispatch(searchStateAction.searchAction({action:true}))

    }


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
            expanded()
        }else if(isBottomSwipe){
            unExpanded()
        }
    }

    return(
        <div
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className={`${styles.detailSection} ${!searchStore.action ? styles.expanded : ''} `}
        >
            <div className={styles.header}>
                <button
                    className={`${styles.arrowButton} ${!searchStore.action ? styles.expanded : ''}`}
                    onClick={setExpanded}
                    // disabled={!currentStore}
                    aria-label={!searchStore.action ? '매장 정보 접기' : '매장 정보 펼치기'}
                >
                    <IoIosArrowUp size={20} color="#666666" />
                </button>
                <DetailHeader
                    map={map}
                />
                <br/>
                {/*<DetailContent currentStore={currentStore} expanded={expanded} />*/}
            </div>
        </div>
    )
}
