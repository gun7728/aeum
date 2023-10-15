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
import {calculateDistance} from "@/components/commom";
import {BiBus, BiCableCar, BiWalk, BsThreeDots, BsThreeDotsVertical} from "react-icons/all";
import useMenu from "@/hooks/useMenu";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";
import useLoading from "@/hooks/useLoading";

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

    const {data:routeDetail} = useSWR('/route/detail')
    const {data:routeTotalTime} = useSWR('/route/time')

    const {data:assistAddStore} = useSWR('/stores/assist/add')

    const {setLoading} = useLoading()
    const {setBottomMenuStatus} = useMenu()
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
        setLoading(true);
        // fetch(`/tourApi/areaBasedSyncList1?serviceKey=${process.env.TOUR_API_ECD_KEY}&numOfRows=20000&pageNo=1&MobileOS=ETC&MobileApp=Aeum&_type=json&showflag=1&listYN=Y&arrange=A&contentTypeId=12`)
        fetch(`/tourApi/detailCommon1?serviceKey=${process.env.TOUR_API_ECD_KEY}&MobileOS=ETC&MobileApp=Aeum&_type=json&contentId=${e.contentid}&defaultYN=Y&firstImageYN=Y&areacodeYN=Y&catcodeYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&numOfRows=10&pageNo=1`)
            .then(function(response){
                return response.json()
            }).then(function(data) {
            var datas = data.response.body.items.item[0]

            setChoseStore(datas)
            setBottomMenuStatus('detail')
        });
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
                bottomMenuStatus==='assistRoute'?
                    <div style={{height:"220px"}}>
                        <span>{parseInt(routeTotalTime/60)}분</span>
                        <br/>
                        <div style={{width:'100%'}}>
                            {
                                routeDetail?.map((route,index)=>{
                                    return (<div style={{display:"inline-flex",width:`${route.percent}%`,height:'6px', backgroundColor:`${route.color?route.color:'gray'}`}} key={index}></div>)
                                })
                            }
                        </div>
                        <div style={{height:'90%', overflowX:"scroll"}}>
                            <table>
                                <tbody>

                                    {
                                        routeDetail?.map((route,index)=>{
                                            return (
                                                <>
                                                    <tr key={Math.random()}>
                                                        <th  key={Math.random()} >
                                                            <div   key={Math.random()} style={{width: '30px',height: '30px',backgroundColor: `${route.color?route.color:'gray'}`,borderRadius: '25px'}}>
                                                                {
                                                                    route.type==='WALKING'?
                                                                        <BiWalk style={{ color: 'white',width:'30px',aspectRatio:'auto',height: '30px',padding: '2px'}}/>
                                                                    :route.type==='BUS'?
                                                                        <BiBus style={{ color: 'white',width:'30px',aspectRatio:'auto',height: '30px',padding: '2px'}}/>
                                                                    :route.type==='TRANSIT'?
                                                                        <BiCableCar style={{ color: 'white',width:'30px',aspectRatio:'auto',height: '30px',padding: '2px'}}/>
                                                                    :
                                                                    <></>
                                                                }
                                                            </div>
                                                        </th>
                                                        <td  key={Math.random()} >
                                                            <span   key={Math.random()} style={{position: 'relative',top: '-9px',left: '10px', fontWeight: 'bold'}}>{route.type==='WALKING'?((index===routeDetail.length-1)?'도착':route.name):route.name+'출발 - ' + route.arrival + '도착'}</span>
                                                        </td>
                                                    </tr>
                                                    <tr key={Math.random()}>
                                                        <th key={Math.random()} >
                                                            <BsThreeDotsVertical style={{width:'30px',aspectRatio:'auto',height: '30px',padding: '2px'}}/>
                                                        </th>
                                                        <td key={Math.random()} >
                                                            {
                                                                route.type==='WALKING'?
                                                                    <BiWalk style={{color:`${route.color?route.color:'gray'}`,width:'20px',aspectRatio:'auto',height: '20px', marginBottom:'5px'}}/>
                                                                :route.type==='BUS'?
                                                                    <BiBus style={{color:`${route.color?route.color:'gray'}`,width:'20px',aspectRatio:'auto',height: '20px', marginBottom:'5px'}}/>
                                                                :route.type==='TRANSIT'?
                                                                    <BiCableCar style={{color:`${route.color?route.color:'gray'}`,width:'20px',aspectRatio:'auto',height: '20px', marginBottom:'5px'}}/>
                                                                    :
                                                                <></>
                                                            }
                                                            <span key={Math.random()}  style={{position: 'relative',top: '-9px', fontWeight: 'bold'}}>{route.shortName} </span>
                                                            <span key={Math.random()}  style={{position: 'relative',top: '-9px', }}>{parseInt(route.time/60)}분</span>
                                                        </td>
                                                    </tr>
                                                </>
                                            )

                                        })
                                    }


                                </tbody>
                            </table>
                        </div>

                    </div>
                    :
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
                                                    <span>출발지로 부터 {parseInt(calculateDistance(parseFloat(startStore?.mapy), parseFloat(startStore?.mapx), parseFloat(e?.mapy), parseFloat(e?.mapx)))}km</span>
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
