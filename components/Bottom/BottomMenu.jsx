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


    const setExpanded =async ()=>{
        if(bottomMenuStatus==='open'){
            setBottomMenuStatus('default')
        }else if(bottomMenuStatus==='detail'){
            setBottomMenuStatus('default')
        }else{
            setBottomMenuStatus('open')
        }
    }

    return(
        <>
            <div
                className={`${styles.detailSection} 
                    ${(bottomMenuStatus==='open' ? styles.expanded : '' )} 
                    ${(bottomMenuStatus==='detail' ? styles.detailExpanded : '')} 
                    ${(bottomMenuStatus==='search' ? styles.searchStartExpanded : '')} 
                    ${(bottomMenuStatus==='searchResult' ? styles.searchResultExpanded : '')} 
                    ${(bottomMenuStatus==='assist' ? styles.assistExpanded : '')} 
                `}
            >
                 {
                    ((bottomMenuStatus==='default') && !changedPosition) &&
                    <div onClick={()=>{positionChange(true)}} className={styles.changePosition}>지도 위치로 검색</div>
                }

                {
                    (bottomMenuStatus==='search' || bottomMenuStatus==='searchResult' || bottomMenuStatus==='assist' || bottomMenuStatus==='assistRoute')?
                        <BottomSearchSection/>
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
