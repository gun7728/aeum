'use client'

import Script from 'next/script'
import {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as dataStateAction from "@/store/modules/data"
import * as mapStateAction from "@/store/modules/map"
import {useRouter} from "next/navigation";
import useMap, { INITIAL_CENTER, INITIAL_ZOOM } from "@/hooks/useMap";
import Map from "@/components/Map";
import useStores from "@/hooks/useStores";
import useSWR from "swr";

export default function KakaoMap(){
    const dispatch = useDispatch();

    const { initializeStores } = useStores();
    const { initializeMap, initializeCurrentPosition } = useMap();

    const onLoadMap = async (map) => {
        await initData()
        getPosition(map)
        initializeMap(map);
    };

    const initData = async ()=>{
        initializeStores(await require('/public/data/data.json'));
    };

    const initPosition = (position) => {
        initializeCurrentPosition(position)
    }


    const getPosition = (map) =>{
        navigator.geolocation.getCurrentPosition((position) => {
            map.panTo(new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude))
            dispatch(mapStateAction.setMapLoading({mapLoading:true}))

            initPosition([position.coords.latitude, position.coords.longitude])
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
    //




    return(
        <>
            <Map
                onLoad={onLoadMap}
            />
        </>
    )
}
