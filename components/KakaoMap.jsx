'use client'
import useMap from "@/hooks/useMap";
import Map from "@/components/Map";
import useStores from "@/hooks/useStores";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";
// import axios from "axios";

export default function KakaoMap(){

    const { initializeStores } = useStores();
    const { initializeMap, initializeCurrentPosition,initializeCurrentLocation } = useMap();

    const onLoadMap = async (map) => {
        getPosition(map)
        initializeMap(map);
    };
    const getDistanceFromLatLonInKm = (lat1,lng1,lat2,lng2) => {
        function deg2rad(deg) {
            return deg * (Math.PI/180)
        }

        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lng2-lng1);
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c; // Distance in km
        return d;
    }

    const initData = async (mx,my,map)=>{
        return new Promise((resolve) => {

            fetch(`/tourApi/areaBasedSyncList1?serviceKey=${process.env.TOUR_API_ECD_KEY}&numOfRows=20000&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&showflag=1&listYN=Y&arrange=A&contentTypeId=12`)
                .then(function(response){
                    return response.json()
                }).then(function(data) {
                    var datas = data.response.body.items.item

                    for(var i =0, max=datas.length; i<max; i++){
                        if(!datas[i].firstimage){
                            datas[i].firstimage = '/noimage.png'
                        }
                        if(!datas[i].firstimage2){
                            datas[i].firstimage2 = '/noimage.png'
                        }

                        var mk = new kakao.maps.Marker({
                            position: new kakao.maps.LatLng(datas[i].mapy,datas[i].mapx),
                            map:map
                        });

                    }
                    const nearbyStores = datas.filter((data) => {
                        // 반경 내에 있는지 검사합니다.
                        const distance = getDistanceFromLatLonInKm(my, mx, data.mapy, data.mapx);
                        return distance <= 3;
                    });
                    initializeStores(nearbyStores);
            }).catch(err => console.error(err));
        })
    };

    const initPosition = (position) => {
        initializeCurrentPosition(position)
    }


    const getPosition = (map) =>{
        navigator.geolocation.getCurrentPosition(async (position) => {
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
            await initData(position.coords.longitude, position.coords.latitude,map)

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
