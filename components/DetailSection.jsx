'use client'

import styles from '../styles/detail.module.scss'
import {useEffect, useState} from "react";
import {IoIosArrowUp} from "react-icons/io";
import DetailHeader from "@/components/DetailHeader";

export default function DetailSection({map, expandedFlag}){
    const [expanded, setExpanded] = useState(false)

    const onClickArrow = ()=>{
        setExpanded(!expanded)
    }

    useEffect(()=>{
        setExpanded(expandedFlag)
    },[expandedFlag])

    return(
        <div
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
