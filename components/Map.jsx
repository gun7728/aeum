'use client'

import Script from 'next/script'
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as dataStateAction from "@/store/modules/data"
import * as mapStateAction from "@/store/modules/map"
import {useRouter} from "next/navigation";

export default function Map({nMap}){
    const router = useRouter()
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
    },[map])

    useEffect(()=>{
        if(map){
            navigator.geolocation.getCurrentPosition((position) => {
                naver.maps.Service.reverseGeocode({
                    location: new naver.maps.LatLng(position.coords.latitude, position.coords.longitude),
                }, function(status, response) {
                    var result = response.result; // 검색 결과의 컨테이너
                    var items = result.items; // 검색 결과의 배열

                    map.panTo(new naver.maps.LatLng(position.coords.latitude-0.005, position.coords.longitude));

                    dispatch(dataStateAction.setCurPosition({curPosition:[position.coords.latitude, position.coords.longitude]}))
                    dispatch(dataStateAction.setCurLocation({curLocation:items[0].addrdetail.sigugun}));

                    var marker = new naver.maps.Marker({
                        position: new naver.maps.LatLng(position.coords.latitude, position.coords.longitude),
                        map: map
                    });

                    dispatch(mapStateAction.setMapLoading({mapLoading:true}))


                    nMap(map);
                    initData();
                });

            },()=>{
               alert('위치 정보 허용을 해주세요.')
            });

        }
    },[map])

    const initData = ()=>{
        const datas = require('/public/data/data.json')
        dispatch(dataStateAction.setTouristData({touristData:datas}))
    }

    useEffect(()=>{
        initMap()
    },[])

    return(
        <>
            <div id="map"  style={{width:'100%', height:'100%'}}></div>
        </>
    )
}
