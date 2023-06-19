'use client'
import useMap from "@/hooks/useMap";
import Map from "@/components/Map";
import useStores from "@/hooks/useStores";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";
import useSWR from "swr";
import {useEffect} from "react";
// import axios from "axios";

export default function KakaoMap(){

    const { initializeStores, nearStores } = useStores();
    const { initializeMap, initializeCurrentPosition,initializeCurrentLocation, allStoresMarker,screenMarker } = useMap();

    const { data:stores } = useSWR('/stores');
    const { data:map } = useSWR('/map');
    const { data:allMarker } = useSWR('/map/all/marker');
    const { data:bound } = useSWR('/map/bound');
    const { data:sMarker } = useSWR('/map/screen/marker')

    const onLoadMap = async (map) => {
        getPosition(map)
        initializeMap(map);
    };

    const initData = async (mx,my,map)=>{
        return new Promise((resolve) => {

            fetch(`/tourApi/areaBasedSyncList1?serviceKey=${process.env.TOUR_API_ECD_KEY}&numOfRows=20000&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&showflag=1&listYN=Y&arrange=A&contentTypeId=12`)
                .then(function(response){
                    return response.json()
                }).then(function(data) {
                    var datas = data.response.body.items.item

                    let markerList = [];
                    for(var i =0, max=datas.length; i<max; i++){
                        if(!datas[i].firstimage){
                            datas[i].firstimage = '/noimage.png'
                        }
                        if(!datas[i].firstimage2){
                            datas[i].firstimage2 = '/noimage.png'
                        }

                        const marker = new kakao.maps.Marker({
                            title: i,
                            position: new kakao.maps.LatLng(datas[i].mapy,datas[i].mapx),
                        });

                        markerList.push(marker);
                    }


                    allStoresMarker(markerList);
                    initializeStores(datas);
                    nearbyStores();
                    resolve()
            }).catch(err => console.error(err));
        })
    };

    const initPosition = (position) => {
        initializeCurrentPosition(position)
    }

    useEffect(()=>{
        if(!bound || !allMarker || !stores || !map)
            return


        if(sMarker){
            sMarker.map((mk)=>{
                mk.setMap(null)
            })
        }

        let boundsChange = [];

        allMarker.map((marker)=>{
            if (bound.contain(marker.getPosition()) == true) {
                boundsChange.push(stores[`${marker.getTitle()}`])
            }
        })

        let markers = [];
        boundsChange.map((data)=>{
            var mk = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(data.mapy,data.mapx),
                map:map
            });

            markers.push(mk);
        })

        screenMarker(markers);
        nearStores(boundsChange)


        //
        // 마커를 생성합니다
        // for(let i = 0 ; i < boundMarker.length ; i++) {
        //     const marker = new kakao.maps.Marker({
        //         title: boundMarker[i].factory_name,
        //         position: new kakao.maps.LatLng(boundMarker[i].y, boundMarker[i].x), // 마커의 위치
        //     });
        //
        //     //영역에 포함되는 마커들만 출력
        //     if (bounds.contain(marker.getPosition()) == true) {
        //         boundsChange.push({'title':marker.getTitle(), 'lat':marker.getPosition().Ga, 'lng':marker.getPosition().Ha, 'cntr_pwr': boundMarker[i].cntr_pwr})
        //     }
        // }
    },[bound,allMarker,stores,map])


    const nearbyStores = () => {
        if(!stores)
            return

        var nearStore = stores.filter((data) => {
            const getDistanceFromLatLonInKm = (lat1, lng1, lat2, lng2) => {
                function deg2rad(deg) {
                    return deg * (Math.PI / 180)
                }

                var R = 6371; // Radius of the earth in km
                var dLat = deg2rad(lat2 - lat1);  // deg2rad below
                var dLon = deg2rad(lng2 - lng1);
                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c; // Distance in km
                return d;
            }

            // 반경 내에 있는지 검사합니다.
            const distance = getDistanceFromLatLonInKm(my, mx, data.mapy, data.mapx);
            return distance <= 3;
        })

        console.log(nearStore)
    };


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
