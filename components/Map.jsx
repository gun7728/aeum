'use client'

import Script from 'next/script'
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as dataStateAction from "@/store/modules/data"
import * as mapStateAction from "@/store/modules/map"

export default function Map({nMap}){
    const dispatch = useDispatch();
    const mapStore = useSelector((state)=>state.mapState)
    const [map,setMap] = useState();
    const initMap = ()=>{
        var naverMap = new naver.maps.Map('map',{
            center : new naver.maps.LatLng(37.71344096516783, 126.8666797982575),
            zoom:15,
            zoomControl:false,
            mapDataControl:false,
            logoControlOptions:{
                position:naver.maps.Position.BOTTOM_LEFT
            },
        })
        setMap(naverMap);
    }
    useEffect(()=>{
        if(!map) return
        dispatch(mapStateAction.setMapLoading({mapLoading:true}))
    },[map])

    useEffect(()=>{
        if(mapStore.mapLoading)
        navigator.geolocation.getCurrentPosition((position) => {
            naver.maps.Service.reverseGeocode({
                location: new naver.maps.LatLng(position.coords.latitude, position.coords.longitude),
            }, function(status, response) {
                var result = response.result; // 검색 결과의 컨테이너
                var items = result.items; // 검색 결과의 배열

                map.panTo(new naver.maps.LatLng(position.coords.latitude-0.005, position.coords.longitude));
                dispatch(dataStateAction.setCurLocation({curLocation:items[0].addrdetail.sigugun}));

                var marker = new naver.maps.Marker({
                    position: new naver.maps.LatLng(position.coords.latitude, position.coords.longitude),
                    map: map
                });

            });

        });
        nMap(map);
        initData();
    },[mapStore.mapLoading])

    const initData = ()=>{
        const datas = require('/public/data/data.json')
        dispatch(dataStateAction.setTouristData({touristData:datas}))
    }

    useEffect(()=>{
        initMap()
    },[])

    return(
        <>
            <Script
                type={'text/javascript'}
                strategy={"beforeInteractive"}
                src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_MAP_KEY}&submodules=geocoder`}
            />

            <div id="map"  style={{width:'100%', height:'100%'}}></div>
        </>
    )
}
