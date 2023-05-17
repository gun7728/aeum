'use client'
import styles from "@/styles/header.module.scss";
import {AiOutlineLeft, AiOutlineSearch} from "react-icons/ai";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import * as searchStateAction from "@/store/modules/search";
import * as dataStateAction from "@/store/modules/data";
import {HiOutlineSwitchVertical, HiX} from "react-icons/hi";


export default function HeaderSearch({map}){
    const [str,setStr] = useState()
    const inputRef = useRef();
    const spRef = useRef();
    const epRef = useRef();
    const dispatch = useDispatch();
    const searchStore = useSelector((state)=>state.searchState)
    const dataStore = useSelector(state => state.dataState);
    const mapStore = useSelector(state => state.mapState)
    const [startMarker, setStartMarker] = useState();
    const [endMarker, setEndMarker] = useState();
    const [polyline, setPolyline] = useState(null);
    const [startFlag, setStartFlag] = useState(true);

    const setSearchWord = (()=>{
        if(str!=''){
            dispatch(searchStateAction.setWord({value:str}))
            dispatch(searchStateAction.searchStart({start:true}))
            dispatch(dataStateAction.setCurDetail({curDetail:null}))
        }
    })
    useEffect(()=>{
        if(searchStore.value !=='' && searchStore.start){
            inputRef.current.value=searchStore.value
        }
    },[searchStore.value,searchStore.start])

    useEffect(()=>{
        if(str===''&&searchStore.start){
            dispatch(searchStateAction.searchStart({start:false}))
        }
    },[str])

    useEffect(()=>{
        if(dataStore.startPoint){
            dispatch(dataStateAction.setCurDetail({curDetail:null}))
            dispatch(searchStateAction.searchStart({start:false}))
            spRef.current.value = dataStore.startPoint[1]

            if(!dataStore.endPoint){
                epRef.current.focus();
                setSearchPage(true)
                setSearchOpen(true)
            }
        }else{
            spRef.current.value = null
        }

        if(dataStore.endPoint){
            dispatch(dataStateAction.setCurDetail({curDetail:null}))
            dispatch(searchStateAction.searchStart({start:false}))
            epRef.current.value = dataStore.endPoint[1]

            if(!dataStore.startPoint) {
                spRef.current.focus();
                setSearchPage(true)
                setSearchOpen(true)
            }
        }else{
            epRef.current.value=null;
        }
    },[dataStore.startPoint,dataStore.endPoint])

    const startStr =async  (str) =>{
        setStr(str)
        if(str==''){
            if(startMarker){
                startMarker.setMap(null)
                setStartMarker(null)
            }
            if(polyline){
                if(polyline.length>0){
                    polyline.map((e)=>{
                        e.setMap(null);
                    })
                }
                setStartFlag(true)
            }

            await dispatch(dataStateAction.setStartPoint({startPoint:null}))
            await dispatch(searchStateAction.listOpen({listOpen:false}))
        }
    }
    const endStr = async (str) =>{
        setStr(str)
        if(str==''){
            if(endMarker){
                endMarker.setMap(null)
                setEndMarker(null)
            }
            if(polyline){
                if(polyline.length>0){
                    polyline.map((e)=>{
                        e.setMap(null);
                    })
                }
                setStartFlag(true)
            }

            await dispatch(dataStateAction.setEndPoint({endPoint:null}))
            await dispatch(searchStateAction.listOpen({listOpen:false}))
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

        if(polyline){
            if(polyline.length>0){
                polyline.map((e)=>{
                    e.setMap(null);
                })
            }
            setStartFlag(true)
        }
        setPolyline(null);

        await dispatch(dataStateAction.setStartPoint({startPoint:null}))
        await dispatch(dataStateAction.setEndPoint({endPoint:null}))
        await dispatch(dataStateAction.setCurDetail({curDetail:null}))
        await dispatch(searchStateAction.pageChange({page:false}))
        await dispatch(searchStateAction.searchStart({start:false}))
        await dispatch(searchStateAction.listOpen({listOpen:false}))
        await dispatch(searchStateAction.listReOpen({listReOpen:false}))

        setSearchOpen(false)

        setSearchPage(false)

        inputRef.current.value=null
    }

    const switchStartEnd = () =>{
        var sp  = dataStore.startPoint;
        var ep  = dataStore.endPoint;

        dispatch(dataStateAction.setStartPoint({startPoint:ep}))
        dispatch(dataStateAction.setEndPoint({endPoint:sp}))
    }

    useEffect(()=>{
        if(!dataStore.startPoint) return;

        var icon = new kakao.maps.MarkerImage(
            'https://i1.daumcdn.net/dmaps/apis/n_local_blit_04.png',
            new kakao.maps.Size(31, 35),
            {
                shape: 'poly',
                coords: '16,0,20,2,24,6,26,10,26,16,23,22,17,25,14,35,13,35,9,25,6,24,2,20,0,16,0,10,2,6,6,2,10,0'
            });

        var marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(dataStore.startPoint[4],dataStore.startPoint[5]),
            image: icon
        });


        setStartMarker(marker)
        marker.setMap(map);
    },[dataStore.startPoint])

    useEffect(()=>{
        if(!dataStore.endPoint) return;

        var icon = new kakao.maps.MarkerImage(
            'https://i1.daumcdn.net/dmaps/apis/n_local_blit_04.png',
            new kakao.maps.Size(31, 35),
            {
                shape: 'poly',
                coords: '26,0,20,2,24,6,26,10,26,16,23,22,17,25,14,35,13,35,9,25,6,24,2,20,0,16,0,10,2,6,6,2,10,0'
            });

        var marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(dataStore.endPoint[4],dataStore.endPoint[5]),
        });

        setEndMarker(marker)
        marker.setMap(map);
    },[dataStore.endPoint])

    const setSearchOpen = ((bool)=>{
        dispatch(searchStateAction.listOpen({listOpen:bool}))
    })

    const setSearchPage = ((bool)=>{
        if(searchStore.start&&!bool){
            dispatch(searchStateAction.searchStart({start:false}))
        }else{
            dispatch(searchStateAction.pageChange({page:bool}))
        }
        if(!bool) {
            inputRef.current.value=null
            dispatch(searchStateAction.setWord({value:null}))
        }
    })
    const setSearchStatus = () => {
        dispatch(searchStateAction.searchStart({start:false}))
        dispatch(dataStateAction.setCurDetail({curDetail:null}))
        dispatch(searchStateAction.listOpen({listOpen:false}))
        dispatch(searchStateAction.listReOpen({listReOpen:false}))
        setSearchPage(true)
        setSearchOpen(false)
    }

    const startPath = () => {
        if(!startFlag) return;
        getPath(map, dataStore.startPoint[5], dataStore.startPoint[4], dataStore.endPoint[5], dataStore.endPoint[4]);
    }

    function getPath(map, sx, sy, ex, ey) {
        if (sx, sy, ex, ey) {
            setStartFlag(false);
            var xhr = new XMLHttpRequest();
            //ODsay apiKey 입력
            var url = `https://api.odsay.com/v1/api/searchPubTransPathT?SX=${sx}&SY=${sy}&EX=${ex}&EY=${ey}&apiKey=${process.env.ODSAY_KEY}`;
            xhr.open("GET", url, true);
            xhr.send();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    //노선그래픽 데이터 호출
                    if (xhr.responseText.includes('error')) {
                        alert('출, 도착지가 700m 이내입니다.')
                        return;
                    }

                    //ODsay apiKey 입력
                    var url = `https://api.odsay.com/v1/api/loadLane?mapObject=0:0@${(JSON.parse(xhr.responseText))["result"]["path"][0].info.mapObj}&apiKey=${process.env.ODSAY_KEY}`;
                    xhr.open("GET", url, true);
                    xhr.send();
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4 && xhr.status == 200) {
                            var resultJsonData = JSON.parse(xhr.responseText);

                            drawKakaoPolyLine(map, resultJsonData);		// 노선그래픽데이터 지도위 표시
                            // boundary 데이터가 있을경우, 해당 boundary로 지도이동
                            if (resultJsonData.result.boundary) {
                                var boundary = new kakao.maps.LatLngBounds(
                                    new kakao.maps.LatLng(resultJsonData.result.boundary.top, resultJsonData.result.boundary.left),
                                    new kakao.maps.LatLng(resultJsonData.result.boundary.bottom, resultJsonData.result.boundary.right)
                                );

                                // var rectangleBoundary = new kakao.maps.LatLngBounds(
                                //     new kakao.maps.LatLng(resultJsonData.result.boundary.top, resultJsonData.result.boundary.left),
                                //     new kakao.maps.LatLng(resultJsonData.result.boundary.bottom, resultJsonData.result.boundary.right)
                                // );
                                // var rectangle = new kakao.maps.Rectangle({
                                //     bounds: rectangleBoundary, // 그려질 사각형의 영역정보입니다
                                //     strokeWeight: 4, // 선의 두께입니다
                                //     strokeColor: '#FF3DE5', // 선의 색깔입니다
                                //     strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                                //     strokeStyle: 'shortdashdot', // 선의 스타일입니다
                                //     fillColor: '#FF8AEF', // 채우기 색깔입니다
                                //     fillOpacity: 0.8 // 채우기 불투명도 입니다
                                // });
                                //
                                //
                                // rectangle.setMap(map);
                                map.panTo(boundary);
                            }
                        }
                    }
                }
            }
        }
    }

    function drawKakaoPolyLine(map, data) {
        var lineArray;

        var lineList = [];
        for (var i = 0; i < data.result.lane.length; i++) {
            for (var j = 0; j < data.result.lane[i].section.length; j++) {
                lineArray = null;
                lineArray = new Array();
                for (var k = 0; k < data.result.lane[i].section[j].graphPos.length; k++) {
                    lineArray.push(new kakao.maps.LatLng(data.result.lane[i].section[j].graphPos[k].y, data.result.lane[i].section[j].graphPos[k].x));
                }

                //지하철결과의 경우 노선에 따른 라인색상 지정하는 부분 (1,2호선의 경우만 예로 들음)
                var pl;
                if (data.result.lane[i].type == 1) {
                    pl = new kakao.maps.Polyline({
                        map: map,
                        path: lineArray,
                        strokeWeight: 3,
                        strokeColor: '#003499'
                    });
                } else if (data.result.lane[i].type == 2) {
                    pl = new kakao.maps.Polyline({
                        map: map,
                        path: lineArray,
                        strokeWeight: 3,
                        strokeColor: '#37b42d'
                    });
                } else {
                    pl = new kakao.maps.Polyline({
                        map: map,
                        path: lineArray,
                        strokeWeight: 3
                    });
                }
                lineList.push(pl)
            }
        }
        setPolyline(lineList);
    }

    return(
        <>
            <div style={( dataStore.startPoint || dataStore.endPoint ) ? {} :  {display:'none'}} className={styles.startEndBox}>
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
                            setSearchWord()
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
                            setSearchWord()
                        }
                    }

                    }
                    onChange={(e)=>{endStr(e.target.value)}}
                    placeholder={'도착지를 선택해 주세요.'}
                    ref={epRef}
                    className={styles.endItem}/>
                <button
                    onClick={()=>{if(startFlag){startPath()}}}
                    className={styles.confirmBtn}>
                    확인
                </button>
                <button className={styles.confirmBtn}>
                    취소
                </button>
            </div>

            <div style={( dataStore.startPoint || dataStore.endPoint ) ? {display:'none'}:{}} className={styles.searchBox}>
                <AiOutlineSearch className={styles.searchBtn}  onClick={()=>{setSearchWord()}}/>
                <AiOutlineLeft style={!searchStore.page?{display:'none'}:''} className={styles.flexBtn}
                   onClick={()=>{
                       setSearchPage(false)
                       dispatch(dataStateAction.setCurDetail({curDetail:null}))
                }}/>
                    <input
                        ref={inputRef}
                        className={styles.flexItem}
                            className={!searchStore.page?`${styles.flexItem}`: `${styles.flexItemActive}`}
                           onKeyDown={(e)=>{
                               if(e.code==='Enter'  || e.code==="NumpadEnter" ||e.keyCode===13 ){
                                   setSearchWord()
                               }
                           }

                           }
                           onChange={(e)=>{setStr(e.target.value)}}
                           onClick={()=>{
                               setSearchPage(true),
                               setSearchOpen(false),
                               dispatch(dataStateAction.setCurDetail({curDetail:null}))
                           }}
                           type={"text"}
                           placeholder={'장소, 주소 검색'}
                    ></input>
                </div>
        </>
    )
}
