'use client'
import {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import Header from "@/components/Header";
import DetailSection from "@/components/DetailSection";
import Loading from "@/components/loading";
import KakaoMap from "@/components/KakaoMap";
import FadeAlert from "@/components/FadeAlert";

export default function Home(){
    const [map,setMap]=useState(null);
    const dataStore = useSelector((state)=>state.dataState)
    const mapStore = useSelector((state)=>state.mapState)

    const nMap = (x)=>{
        setMap(x);
    }


    const scrollInto = useRef(null)

    useEffect(() => {
        if (typeof window !== "undefined") {
            if(mapStore.mapLoading){
                setTimeout(()=>{
                    window.scrollTo({top:3000, behavior:"smooth"})
                },1000)
            }
        }
    })

    return(
        <div
            ref={scrollInto}
            style={{height:'100vh'}}>
            <main
                  style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      overflow: 'hidden',
                  }}
              >
                {
                    dataStore.curLocation?'':<Loading/>
                }
                <FadeAlert/>
                <Header/>
                <KakaoMap nMap={nMap}/>
                {
                    mapStore.mapLoading?
                        <DetailSection map={map}/>
                        :<></>
                }
            </main>
        </div>
    )
}
