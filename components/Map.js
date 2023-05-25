import {INITIAL_CENTER, INITIAL_ZOOM} from "@/hooks/useMap";
import {useEffect, useRef} from "react";
import Script from "next/script";

const Map = ({onLoad})=>{
    const mapRef = useRef(null);

    const initializeMap = () => {
        kakao.maps.load(()=>{
            const mapOptions = {
                center: new kakao.maps.LatLng(INITIAL_CENTER[0],INITIAL_CENTER[1]),
                level: 5,
            };

            var container = document.getElementById('map');
            const map = new kakao.maps.Map(container, mapOptions);
            mapRef.current = map;


            if(onLoad){
                onLoad(map);
            };

        })
    };
    return(
        <>
            <Script
                type="text/javascript"
                strategy="afterInteractive"
                src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_MAP_KEY}&libraries=services,clusterer&autoload=false`}
                onReady={initializeMap}
            />
             <div id="map" style={{width:'100%', height:'100%'}}/>
        </>
    )
}
export default Map;
