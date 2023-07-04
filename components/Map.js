import useMap, {INITIAL_CENTER, INITIAL_ZOOM} from "@/hooks/useMap";
import {useEffect, useRef} from "react";
import Script from "next/script";

const Map = ({onLoad})=>{
    const { changeBound,changeZoom,changeCenter,positionChange } = useMap()
    const mapRef = useRef(null);

    const initializeMap = () => {
        positionChange(true);
        kakao.maps.load(()=>{
            const mapOptions = {
                center: new kakao.maps.LatLng(INITIAL_CENTER[0],INITIAL_CENTER[1]),
                level: 5,
            };

            var container = document.getElementById('map');
            const map = new kakao.maps.Map(container, mapOptions);


            kakao.maps.event.addListener(map, 'idle', function() {
                const timer = setTimeout(function () {
                    console.log("지도 위치가 변경 될 때마다 API요청");
                }, 1000);

                if (timer) {
                    clearTimeout(timer);
                    const bounds = map.getBounds(); // 지도 영역 반환
                    const zoom = map.getLevel(); // 지도 영역 반환
                    const center = map.getCenter();
                    changeBound(bounds)
                    changeZoom(zoom)
                    changeCenter(center);
                }

            });

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
