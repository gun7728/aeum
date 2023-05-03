'use client'

import {useEffect, useState} from "react";
import Script from "next/script";

export default function DetailHeader({map}){
    const [curLocation, setCurLocation] = useState(false);

    useEffect(()=>{
        navigator.geolocation.getCurrentPosition((position) => {
            naver.maps.Service.reverseGeocode({
                location: new naver.maps.LatLng(position.coords.latitude, position.coords.longitude),
            }, function(status, response) {
                var result = response.result; // 검색 결과의 컨테이너
                var items = result.items; // 검색 결과의 배열

                map.panTo(new naver.maps.LatLng(position.coords.latitude, position.coords.longitude));
                setCurLocation(items[0].addrdetail.sigugun)
            });

        });
    },[])
    const pm10 = <span style={{color:"blue"}}>좋음</span>
    const pm25 = <span style={{color:"green"}}>보통</span>

    return(
        <>
            <p style={{fontSize:'18px'}}><span style={{fontWeight:"bold"}}>{curLocation}</span>에 오신 것을 환영합니다.</p>
            <p><span style={{fontSize:'12px'}}>미세먼지 {pm10} 초미세먼지 {pm25}</span></p>
        </>
    )
}
