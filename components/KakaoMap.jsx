'use client'
import useMap from "@/hooks/useMap";
import Map from "@/components/Map";
import useStores from "@/hooks/useStores";

export default function KakaoMap(){

    const { initializeStores } = useStores();
    const { initializeMap, initializeCurrentPosition,initializeCurrentLocation } = useMap();

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

            initPosition([position.coords.latitude, position.coords.longitude])
            var marker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude)
            });

            new kakao.maps.services.Geocoder().coord2Address(position.coords.longitude,position.coords.latitude,
                (res,status)=>{
                if (status === kakao.maps.services.Status.OK) {
                    initializeCurrentLocation(res[0].address.region_2depth_name)
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
