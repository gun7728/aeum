'use client'

import styles from '../styles/detail.module.scss'
import {useState} from "react";
import {IoIosArrowUp} from "react-icons/all";

export default function DetailSection(){
    const [expanded, setExpanded] = useState(false)

    const onClickArrow = ()=>{
        setExpanded(!expanded)
    }

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
                {/*<DetailHeader*/}
                {/*    currentStore={currentStore}*/}
                {/*    expanded={expanded}*/}
                {/*    onClickArrow={() => setExpanded(!expanded)}*/}
                {/*/>*/}
                {/*<DetailContent currentStore={currentStore} expanded={expanded} />*/}
            </div>
        </div>
    )
}
