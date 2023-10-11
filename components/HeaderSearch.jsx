'use client'
import styles from "@/styles/header.module.scss";
import {AiOutlineLeft, AiOutlineSearch} from "react-icons/ai";
import {useEffect, useRef, useState} from "react";
import {HiOutlineBackspace, HiOutlineSwitchVertical, HiX} from "react-icons/hi";
import useSWR from "swr";
import useSearchAction from "@/hooks/useSearchAction";
import useList from "@/hooks/useList";
import useStores from "@/hooks/useStores";
import {decode} from "@googlemaps/polyline-codec"
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";
import useMap from "@/hooks/useMap";
import {HiOutlineBackward, IoArrowBack, IoIosArrowBack} from "react-icons/all";


export default function HeaderSearch(){
    const {setListOpen,setListReOpen} = useList();
    const {setSearchStart, setSearchWord, setSearchOpen, setStopOverOpen, setAssistOpen} = useSearchAction();
    const {setChoseStore} = useStores();
    const {setStartStore, setEndStore, setRoute} = useMap();


    const {data:map} = useSWR('/map')

    const {data:searchStart} = useSWR('/search');
    const {data:searchWord} = useSWR('/search/word');
    const {data:searchOpen} = useSWR('/search/open')
    const {data:stopOverOpen} = useSWR('/stopOver/open')
    const {data:assistOpen} = useSWR('/assist/open')
    const {data:startStore} = useSWR('/map/start')
    const {data:sMarker} = useSWR('/map/screen/marker')
    const {data:endStore} = useSWR('/map/end')
    const {data:route} = useSWR('/map/route')

    const [str,setStr] = useState()
    const inputRef = useRef();
    const spRef = useRef();
    const epRef = useRef();
    const [startMarker, setStartMarker] = useState();
    const [endMarker, setEndMarker] = useState();
    const [assistMarker, setAssistMarker] = useState([])
    const [startFlag, setStartFlag] = useState(true);
    const [routeList, setRouteList] = useState();

    const searchWordFunc = (()=>{
        if(str!=''){
            setSearchWord(str);
            setSearchStart(true)
            setChoseStore(null)
        }
    })
    useEffect(()=>{
        if(searchWord !=='' && searchStart){
            inputRef.current.value=searchWord
        }
    },[searchWord,searchStart])

    useEffect(()=>{
        if(str===''&&searchStart){
            setSearchStart(false)
        }
    },[str])

    useEffect(()=>{
        if(startStore){
            setChoseStore(null);
            setSearchStart(false)
            spRef.current.value = startStore.title

            if(!endStore){
                epRef.current.focus();
                setSearchPage(true)
                setSearchOpen(true)
            }
        }else{
            spRef.current.value = null
        }

        if(endStore){
            setChoseStore(null);
            setSearchStart(false)
            epRef.current.value = endStore.title

            if(!startStore) {
                spRef.current.focus();
                setSearchPage(true)
                setSearchOpen(true)
            }
        }else{
            epRef.current.value=null;
        }
        if(startStore && endStore){
            setAssistOpen(true);
            googlePath(map, startStore.mapy, startStore.mapx, endStore.mapy, endStore.mapx)
        }
    },[startStore,endStore])

    const startStr =async  (str) =>{
        setStr(str)
        if(str==''){
            if(startMarker){
                startMarker.setMap(null)
                setStartMarker(null)
            }
            if(route){
                if(route.length>0){
                    route.map((e)=>{
                        e.setMap(null);
                    })
                }
                setStartFlag(true)
            }

            setStartStore(null)
            setListOpen(false)
        }
    }
    const endStr = async (str) =>{
        setStr(str)
        if(str==''){
            if(endMarker){
                endMarker.setMap(null)
                setEndMarker(null)
            }
            if(route){
                if(route.length>0){
                    route.map((e)=>{
                        e.setMap(null);
                    })
                }
                setStartFlag(true)
            }

            setEndStore(null)
            setListOpen(false)
        }
    }
    const resetStartEnd = async () => {
        if(startMarker){
            startMarker.setMap(null)
            setStartMarker(null)
        }
        if(endMarker){
            endMarker.setMap(null)
            setEndMarker(null)
        }

        if(route){
            if(route.length>0){
                route.map((e)=>{
                    e.setMap(null);
                })
            }
            setRoute(null)
            setStartFlag(true)
        }
        if(sMarker){
            sMarker.map((mk)=>{
                mk.setMap(map)
            })
        }

        setStartStore(null)
        setEndStore(null)
        setChoseStore(null)
        setSearchOpen(false)
        setSearchStart(false)
        setListOpen(false)
        setListReOpen(false)
        setSearchPage(false)

        inputRef.current.value=null
    }

    const switchStartEnd = async () =>{
        await startMarker?.setMap(null)
        await endMarker?.setMap(null)

        var sp  = startStore;
        var ep  = endStore;

        setStartStore(ep)
        setEndStore(sp)
    }

    useEffect(()=>{
        if(!startStore) return;

        var icon = new kakao.maps.MarkerImage(
            'https://i1.daumcdn.net/dmaps/apis/n_local_blit_04.png',
            new kakao.maps.Size(31, 35),
            {
                shape: 'poly',
                coords: '16,0,20,2,24,6,26,10,26,16,23,22,17,25,14,35,13,35,9,25,6,24,2,20,0,16,0,10,2,6,6,2,10,0'
            });

        var marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(startStore.mapy,startStore.mapx),
            image: icon
        });


        setStartMarker(marker)
        marker.setMap(map);
    },[startStore])

    useEffect(()=>{
        if(!endStore) return;

        var icon = new kakao.maps.MarkerImage(
            'https://i1.daumcdn.net/dmaps/apis/n_local_blit_04.png',
            new kakao.maps.Size(31, 35),
            {
                shape: 'poly',
                coords: '26,0,20,2,24,6,26,10,26,16,23,22,17,25,14,35,13,35,9,25,6,24,2,20,0,16,0,10,2,6,6,2,10,0'
            });

        var marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(endStore.mapy,endStore.mapx),
        });

        setEndMarker(marker)
        marker.setMap(map);
    },[endStore])

    const setSearchPage = ((bool)=>{
        if(searchStart&&!bool){
            setSearchStart(false)
        }else{
            setSearchOpen(bool)
        }
        if(!bool) {
            inputRef.current.value=null
            setSearchWord(null)
        }
    })
    const setSearchStatus = () => {
        setSearchStart(false);
        setChoseStore(null)
        setListOpen(false)
        setListReOpen(false)
        setSearchPage(true)
    }

    const startPath = () => {
        if(!startFlag) return;

    }

    function decodePolyline(encoded) {
        if (!encoded) {
            return [];
        }
        var poly = [];
        var index = 0, len = encoded.length;
        var lat = 0, lng = 0;

        while (index < len) {
            var b, shift = 0, result = 0;

            do {
                b = encoded.charCodeAt(index++) - 63;
                result = result | ((b & 0x1f) << shift);
                shift += 5;
            } while (b >= 0x20);

            var dlat = (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
            lat += dlat;

            shift = 0;
            result = 0;

            do {
                b = encoded.charCodeAt(index++) - 63;
                result = result | ((b & 0x1f) << shift);
                shift += 5;
            } while (b >= 0x20);

            var dlng = (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
            lng += dlng;

            var p = {
                y: lat / 1e5,
                x: lng / 1e5,
            };
            poly.push(p);
        }
        return poly;
    }

    function tMapRoad(sx, sy, ex, ey){
        return new Promise((resolve, reject)=>{
            var xhr = new XMLHttpRequest();
            var url =  `https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result&startX=${sx}&startY=${sy}&endX=${ex}&endY=${ey}&reqCoordType=WGS84GEO&startName=출발지&endName=도착지&appKey=${process.env.TMAP_KEY}`
            xhr.open("GET", url, true);
            xhr.send()
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var resultJsonData = JSON.parse(xhr.responseText);

                    resolve(resultJsonData);
                }
            }
        })
    }


    function googlePath(map, sy, sx, ey, ex){
        var xhr = new XMLHttpRequest();
        var url = `/googleApi/json?origin=${sy}%2C${sx}&destination=${ey}%2C${ex}&mode=transit&key=${process.env.GOOGLE_KEY}`;
        xhr.open("GET", url, true);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var resultJsonData = JSON.parse(xhr.responseText).routes;

                if(resultJsonData.length===0){
                    alert('해당 경로를 찾을 수 없습니다.')
                    return;
                }
                var route = resultJsonData[0].legs[0];
                var kakaoRouteList = [];

                route.steps.map(async (step) => {
                    var color = '#111111'

                    var lineAr = [];
                    if (step.travel_mode === 'TRANSIT') {
                        color = step.transit_details.line.color


                        var lines = decodePolyline(step.polyline.points)
                        lines.map((line) => {
                            lineAr.push(new kakao.maps.LatLng(line.y, line.x))
                        })

                    } else if (step.travel_mode === 'WALKING') {

                        if(checkInsideKorea({lat:step.start_location.lat,lng:step.start_location.lng})){
                            var roadData =  await tMapRoad(step.start_location.lng, step.start_location.lat, step.end_location.lng, step.end_location.lat)

                            roadData.features.map((feat)=>{
                                if(typeof feat.geometry.coordinates[0] === "number"){
                                    lineAr.push(new kakao.maps.LatLng(feat.geometry.coordinates[1],feat.geometry.coordinates[0]))
                                }else{
                                    feat.geometry.coordinates.map((coor)=>{
                                        lineAr.push(new kakao.maps.LatLng(coor[1],coor[0]))
                                    })
                                }
                            })
                        }else{
                            step.steps.map((st)=>{

                                var lines =  decodePolyline((st.polyline.points).toString())
                                lines.map((line)=>{
                                    lineAr.push(new kakao.maps.LatLng(line.y, line.x))
                                })
                            })
                            var lines =  decodePolyline(step.polyline.points)
                            lines.map((line)=>{
                                lineAr.push(new kakao.maps.LatLng(line.y, line.x))
                            })
                        }
                    }
                    // var kakaoRoute = new kakao.maps.Polyline({
                    //     map: map,
                    //     path: lineAr,
                    //     strokeWeight: 5,
                    //     strokeColor: color
                    // })
                    var kakaoRoute = {
                        map: map,
                        path: lineAr,
                        strokeWeight: 5,
                        strokeColor: color
                    }
                    kakaoRouteList.push(kakaoRoute)
                })

                setRouteList(kakaoRouteList)

                var points = [
                    new kakao.maps.LatLng(sy, sx),
                    new kakao.maps.LatLng(ey, ex)
                ];

                var bounds = new kakao.maps.LatLngBounds();
                var newY = (parseFloat(sy)+parseFloat(ey))/2
                var newX = (parseFloat(ex)+parseFloat(ex))/2

                fetch(`/tourApi/locationBasedList1?serviceKey=${process.env.TOUR_API_ECD_KEY}&numOfRows=20000&pageNo=1&MobileOS=ETC&MobileApp=Aeum&mapX=${newX}&mapY=${newY}&radius=1000&_type=json&listYN=Y&arrange=A&contentTypeId=12`)
                    .then(function(response){
                        return response.json()
                    }).then(async function(data) {

                    var datas = data.response.body.items.item

                    var markerList = [];
                    datas.forEach((dt)=>{

                        var icon = typeIcons(dt.contenttypeid)

                        var marker = new kakao.maps.Marker({
                            position: new kakao.maps.LatLng(dt.mapy,dt.mapx),
                            image: icon
                        });

                        markerList.push(marker);

                    })
                    setAssistMarker(markerList)

                    markerList.forEach((mk)=>{
                        mk.setMap(map)
                    })
                });


                for (var i = 0; i < points.length; i++) {
                    bounds.extend(points[i]);
                }

                map.setBounds(bounds);
            }
        }
    }



    function typeIcons(id){
        var loc = '';
        // 12:관광지(tours), 14:문화시설, 15:축제공연행사, 25:여행코스, 28:레포츠, 32:숙박, 38:쇼핑, 39:음식점
        switch(String(id)){
            case '12':
                loc = '/icons/tours.png'
                break;
            case '14':
                loc = '/icons/astrology.png'
                break;
            case '15':
                loc = '/icons/concerts.png'
                break;
            case '25':
                loc = '/icons/automotive.png'
                break;
            case '28':
                loc = '/icons/sporting-goods.png'
                break;
            case '32':
                loc = '/icons/hotels.png'
                break;
            case '38':
                loc = '/icons/shopping.png'
                break;
            case '39':
                loc = '/icons/food.png'
                break;
        }
        var icon=  new kakao.maps.MarkerImage(
                loc,
            new kakao.maps.Size(31, 35));
        return icon
    }

    function drawLine(){
        var getRouteList = [];
        routeList.forEach((e)=> {
            var getRoute = new kakao.maps.Polyline(e);
            getRouteList.push(getRoute)
        });
        setRoute(getRouteList)
    }

    function checkInsideKorea({ lat, lng }) {
        const coordinateList = [
            {lat:39.105648,lng:129.293848},
            {lat:37.472782,lng:131.597259},
            {lat:34.743466,lng:129.259321},
            {lat:33.810255,lng:128.903499},
            {lat:32.599185,lng:125.157071},
            {lat:34.458362,lng:124.150105},
            {lat:37.65974,lng:124.97210}
        ];
        const size = coordinateList.length;

        if (size < 3) {
            return false;
        }

        let isInner = false;
        let followIndex = size - 1;

        for (let cur = 0; cur < size; cur++) {
            const curPos = coordinateList[cur];
            const prevPos = coordinateList[followIndex];

            if (
                (curPos.lng < lng && prevPos.lng >= lng) ||
                (prevPos.lng < lng && curPos.lng >= lng)
            ) {
                /**
                 * 직선의 방정식: y - y1 = M * (x - x1)
                 * 기울기: M = (y2 - y1) / (x2 - x1)
                 */
                if (curPos.lat + ((lng - curPos.lng) / (prevPos.lng - curPos.lng)) * (prevPos.lat - curPos.lat) < lat) {
                    isInner = !isInner;
                }
            }

            followIndex = cur;
        }
        return isInner;
    };

    function tMapResult(map, sx, sy, ex, ey){
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                appKey: 'SmS45nXtKg6A50z1o8fk4240ewoFBidx9xvUvE3j'
            },
            body: JSON.stringify({
                startX: sx,
                startY: sy,
                endX: ex,
                endY: ey,
                lang: 0,
                format: 'json',
                count: 10,
            })
        };

        fetch('https://apis.openapi.sk.com/transit/routes', options)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err));
    }
    return(
        <>
            {
                assistOpen?
                    <div className={styles.assistActive}>
                        <IoIosArrowBack
                            onClick={()=>switchStartEnd()}
                            className={styles.backBtn}/>
                        <HiX
                            onClick={()=>resetStartEnd()}
                            className={styles.exitBtn}/>
                        <input
                            onClick={setSearchStatus}
                            onKeyDown={(e)=>{
                                if(e.code==='Enter'  || e.code==="NumpadEnter" ||e.keyCode===13 ){
                                    searchWordFunc()
                                }
                            }

                            }
                            onChange={(e)=>{startStr(e.target.value)}}
                            placeholder={'출발지를 선택해 주세요.'}
                            ref={spRef}
                            className={styles.startItem}/>

                        <input
                            onClick={setSearchStatus}
                            onKeyDown={(e)=>{
                                if(e.code==='Enter'  || e.code==="NumpadEnter" ||e.keyCode===13 ){
                                    searchWordFunc()
                                }
                            }

                            }
                            onChange={(e)=>{endStr(e.target.value)}}
                            placeholder={'도착지를 선택해 주세요.'}
                            ref={epRef}
                            className={styles.endItem}/>
                    </div>
                    :
                    <div style={( endStore || startStore ) ? {} :  {display:'none'}} className={`${styles.startEndBox} }`} >
                        <HiOutlineSwitchVertical
                            onClick={()=>switchStartEnd()}
                            className={styles.switchBtn}/>
                        <HiX
                            onClick={()=>resetStartEnd()}
                            className={styles.exitBtn}/>
                        <input
                            onClick={setSearchStatus}
                            onKeyDown={(e)=>{
                                if(e.code==='Enter'  || e.code==="NumpadEnter" ||e.keyCode===13 ){
                                    searchWordFunc()
                                }
                            }

                            }
                            onChange={(e)=>{startStr(e.target.value)}}
                            placeholder={'출발지를 선택해 주세요.'}
                            ref={spRef}
                            className={styles.startItem}/>

                        <input
                            onClick={setSearchStatus}
                            onKeyDown={(e)=>{
                                if(e.code==='Enter'  || e.code==="NumpadEnter" ||e.keyCode===13 ){
                                    searchWordFunc()
                                }
                            }

                            }
                            onChange={(e)=>{endStr(e.target.value)}}
                            placeholder={'도착지를 선택해 주세요.'}
                            ref={epRef}
                            className={styles.endItem}/>
                        <button
                            onClick={()=>{
                                if(startFlag){
                                    drawLine()
                                }
                            }}
                            className={styles.confirmBtn}>
                            확인
                        </button>
                        <button className={styles.confirmBtn} onClick={()=>resetStartEnd()}>
                            취소
                        </button>
                    </div>
                }

                    <div style={( endStore || startStore ) ? {display:'none'}:{}} className={styles.searchBox}>
                <AiOutlineSearch className={styles.searchBtn}  onClick={()=>{searchWordFunc()}}/>
                <AiOutlineLeft style={!searchOpen?{display:'none'}:''} className={styles.flexBtn}
                   onClick={()=>{
                       setSearchPage(false)
                       setChoseStore(null)
                }}/>
                    <input
                        ref={inputRef}
                        className={styles.flexItem}
                            className={!searchOpen?`${styles.flexItem}`: `${styles.flexItemActive}`}
                           onKeyDown={(e)=>{
                               if(e.code==='Enter'  || e.code==="NumpadEnter" ||e.keyCode===13 ){
                                   searchWordFunc()
                               }
                           }

                           }
                           onChange={(e)=>{setStr(e.target.value)}}
                           onClick={()=>{
                               setSearchPage(true),
                               setListOpen(false),
                               setChoseStore(null)
                           }}
                           type={"text"}
                           placeholder={'장소, 주소 검색'}
                    ></input>
                </div>
        </>
    )
}
