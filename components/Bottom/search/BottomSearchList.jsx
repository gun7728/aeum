import {useEffect, useState} from "react";
import Image from "next/image";
import styles from '@/styles/search.module.scss'
import {CgPhone} from "react-icons/cg";
import {RiShareForward2Fill} from "react-icons/ri";
import useSWR from "swr";
import useStores from "@/hooks/useStores";
import useSearchAction from "@/hooks/useSearchAction";
import useList from "@/hooks/useList";
import useAlert from "@/hooks/useAlert";
import useMap from "@/hooks/useMap";

export default function BottomSearchList(){
    const {data:stores} = useSWR('/stores')
    const {data:assistStore} = useSWR('/stores/assist')

    const {data:searchWord} = useSWR('/search/word')
    const {data:map} = useSWR('/map')
    const {data:startStore} = useSWR('/map/start')
    const {data:endStore} = useSWR('/map/end')
    const { data:sMarker } = useSWR('/map/screen/marker')
    const { data:sMarkerName } = useSWR('/map/screen/marker/name')
    const {data:bottomMenuStatus} = useSWR('/bottom/status')
    const {data:assistOption} = useSWR('/assist/option')

    const {data:assistAddStore} = useSWR('/stores/assist/add')

    const { setChoseStore,setAssistFilteredStoreMarker, setAssistAddStore } = useStores()
    const {setStartStore, setEndStore } = useMap()
    const {setListOpen} = useList()
    const {setAlertStart, setAlertMsg} = useAlert()
    const {setSearchStart, setSearchOpen, setSearchData} = useSearchAction()

    const [results, setResults] = useState([]);
    const [customPoint, setCustomPoint] = useState();

    // const [assistList, setAssistList] = useState([]);

    useEffect(()=>{
        if(bottomMenuStatus==='assist'){
            if(assistStore){
                var tempList = [];
                tempList = [...assistStore]
                if(assistOption){
                    tempList = tempList.filter((stor)=>{
                        return assistOption.includes(parseInt(stor.contenttypeid))
                    })
                }

                setAssistFilteredStoreMarker(tempList)
                setResults(tempList)
            }
        }else {
            if(searchWord){
                var resultList = [];
                stores.map((e)=>{
                    if(JSON.stringify(e.title + ' ' + e.content + ' ' + e.loc).includes(searchWord)){
                        resultList.push(e);
                    }
                })
                setResults(resultList)
            }
        }

    },[searchWord,assistOption,assistStore])

    const goToDetail =(e)=>{
        setListOpen(false)
        setChoseStore(e)
    }

    const copyUrl = (id)=>{
        setAlertStart(true)
        setAlertMsg('URL이 복사되었습니다.')
        var url = window.location.href

        navigator.clipboard
            .writeText(url+'share/'+id)
            .then(() => {
                setTimeout(()=>{
                    setAlertStart(false)
                    setAlertMsg(null)
                },1500)
            })
            .catch(() => {
                alert("something went wrong");
            });
    }
    const toRadians = (degrees) => {
        return degrees * (Math.PI / 180);
    }

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // 지구의 반지름 (단위: 킬로미터)
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c; // 두 지점 간의 직선거리 (단위: 킬로미터)
        return distance;
    }


    const setAssist = (spot) => {
        let tempList = []
        tempList = [...assistAddStore];
        var flag = false;
        tempList.forEach((data)=>{
            if(data.contentid === spot.contentid){
                flag=true;
            }
        });
        if(!flag){
            if(assistAddStore.length>4){
                alert('경유지는 4개를 초과할 수 없습니다.')
                return;
            }
            tempList.push(spot);
        }else{
            tempList = tempList.filter(function(data) {
                return data.contentid !== spot.contentid;
            });
        }
        setAssistAddStore([...tempList])
    }

    const setPoint = async (key, data)=>{
        if(startStore){
            var dis = calculateDistance(parseFloat(startStore.mapy), parseFloat(startStore.mapx), parseFloat(data.mapy), parseFloat(data.mapx))
            if(data.title == startStore.title){
                alert('출발지와 목적지를 동일하게 설정하실 수 없습니다.')
                return;
            }
            if(dis>20){
                alert('출발지와 목적지의 직선 거리는 20Km를 초과할 수 없습니다.')
                return;
            }
        }

        if(endStore){
            var dis = calculateDistance(parseFloat(endStore.mapy), parseFloat(endStore.mapx), parseFloat(data.mapy), parseFloat(data.mapx))
            if(data.title == endStore.title){
                alert('출발지와 목적지를 동일하게 설정하실 수 없습니다.')
                return;
            }
            if(dis>20){
                alert('출발지와 목적지의 직선 거리는 20Km를 초과할 수 없습니다.')
                return;
            }
        }

        if(sMarker){
            sMarker.map((mk)=>{
                mk.setMap(null)
            })
        }
        if(sMarkerName){
            sMarkerName.map((mn)=>{
                mn.setMap(null)
            })
        }

        await setSearchStart(true)
        await setSearchOpen(false)

        switch (key){
            case "start":
                await setStartStore(data)
                break;
            case "end":
                await setEndStore(data)
                break;
            case "custom_start":
                await setStartStore(customPoint)
                break;
            case "custom_end":
                await setEndStore(customPoint)
                break;
        }

        map.panTo(new kakao.maps.LatLng(data.mapy,data.mapx))
        await setListOpen(false)
    }




    useEffect(()=>{
        setSearchData(results)
        if(results.length<=0){
            new kakao.maps.services.Geocoder().addressSearch(searchWord,
                (res,status)=>{
                    if (status === kakao.maps.services.Status.OK) {
                        var customPoint = {
                            id:Math.floor(Math.random())+1,
                            title:searchWord,
                            content:searchWord,
                            image:"custom",
                            x:parseFloat(res[0].y),
                            y:parseFloat(res[0].x),
                            category:"custom",
                            loc:"custom",
                        }
                        setCustomPoint(customPoint)
                    }else{
                        setCustomPoint(null);
                    }
                });
        }
    },[results])

    return(
        <div className={bottomMenuStatus==='assist'?styles.assistResultSection:styles.searchResultSection} >
            {
                results.length>0?
                    results.map((e)=>{
                        return(
                            <div key={e.contentid} className={styles.searchListItemSection}>
                                <div className={styles.textSection}>
                                    <span className={styles.title}>
                                        {e.title}
                                    </span>
                                        <span  className={styles.loc}>
                                        {e.addr1}
                                    </span>
                                </div>
                                <Image className={styles.searchListItem} src={e.firstimage} alt={`${e.title}`} width={125} height={170} onClick={()=>{goToDetail(e)}}/>
                                <hr style={{marginBottom:'0px', width:'150%',marginLeft:'-20px', opacity:0.3}}/>
                                <div className={styles.detailBtnSection}>
                                    <div style={{float:"left"}}>
                                        <CgPhone className={styles.detailIconBtn}/>
                                        <RiShareForward2Fill className={styles.detailIconBtn} onClick={()=>copyUrl(e.contentid)}/>
                                    </div>
                                    <div style={{float:"right"}}>
                                        {
                                            bottomMenuStatus==='assist'?
                                                <div>
                                                    <button className={styles.detailBtn} onClick={()=>setAssist(e)}><span style={{color:"gray"}}>경유</span></button>
                                                </div>
                                                :
                                                <div>
                                                    <button className={styles.detailBtn} onClick={()=>setPoint("start",e)}><span style={{color:"gray"}}>출발</span></button>
                                                    <button className={styles.detailBtn} onClick={()=>setPoint("end",e)}><span style={{color:"gray"}}>도착</span></button>
                                                </div>
                                        }
                                    </div>
                                </div>
                                <hr style={{marginBottom:'15px', width:'150%',marginLeft:'-20px', opacity:0.3}}/>
                            </div>
                        )
                    })
                    :
                <div className={styles.searchListItemSection}>
                    <div>
                        검색 결과가 없습니다.
                    </div>
                    <br/>
                        {
                            bottomMenuStatus==='assist'?<></>
                                :
                            customPoint?
                                <div>
                                    해당 위치를
                                    <button className={styles.detailBtn} onClick={()=>setPoint("custom_start",customPoint)}><span style={{color:"gray"}}>출발</span></button>
                                    <button className={styles.detailBtn} onClick={()=>setPoint("custom_end",customPoint)}><span style={{color:"gray"}}>도착</span></button>
                                    로 지정하시겠습니까?
                                </div>
                            :
                                <div>
                                    잘못된 주소입니다.
                                </div>
                        }
                </div>
            }
        </div>
    )
}
