'use client'

import Script from 'next/script'
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as dataStateAction from "@/store/modules/data"
import * as mapStateAction from "@/store/modules/map"
import {useRouter} from "next/navigation";
import {Map} from 'react-kakao-maps-sdk'

export default function KakaoMap({nMap}){
    // const router = useRouter()
    const dispatch = useDispatch();
    const [map,setMap] = useState();

    useEffect(()=>{
        if(!map) return
        nMap(map);
    },[map])

    useEffect(()=>{
        if(map){
            navigator.geolocation.getCurrentPosition((position) => {

                map.panTo(new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude))
                dispatch(mapStateAction.setMapLoading({mapLoading:true}))

                dispatch(dataStateAction.setCurPosition({curPosition:[position.coords.latitude, position.coords.longitude]}))

                var marker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude)
                });

                new kakao.maps.services.Geocoder().coord2Address(position.coords.longitude,position.coords.latitude,
                    (res,status)=>{
                    if (status === kakao.maps.services.Status.OK) {
                        dispatch(dataStateAction.setCurLocation({curLocation:res[0].address.region_2depth_name}));
                    }
                });

                marker.setMap(map);

            },()=>{
                alert('위치 정보 허용을 해주세요.')
            });

        }
    },[map])
    //
    const initData = ()=>{
        const datas = require('/public/data/data.json')
        dispatch(dataStateAction.setTouristData({touristData:datas}))
    }
    useEffect(()=>{
        // initMap()
        kakao.maps.load(() => {
            var container = document.getElementById('map'),
                options = {
                    center: new kakao.maps.LatLng(37.71344096516783, 126.8666797982575),
                    level: 5
                };

            var map = new kakao.maps.Map(container, options);

            setMap(map)
            initData();
        });
    },[])

    return(
        <>
            <div id="map"  style={{width:'100%', height:'100%'}}></div>
        </>
    )
}
