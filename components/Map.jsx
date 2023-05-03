'use client'

import Script from 'next/script'
import {Fragment, useEffect} from "react";

export default function Map(){
    const initMap = ()=>{
        var map = new naver.maps.Map('map',{
            center : new naver.maps.LatLng(37.71344096516783, 126.8666797982575),
            zoom:15,
            zoomControl:false,
            mapDataControl:false,
            logoControlOptions:{
                position:naver.maps.Position.BOTTOM_LEFT
            },
        })
    }

    useEffect(()=>{
        initMap()
    },[])

    return(
        <>
            <Script
                type={'text/javascript'}
                strategy={"beforeInteractive"}
                src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_MAP_KEY}`}
            />
            <div id="map"  style={{width:'100%', height:'100%'}}></div>
        </>
    )
}
