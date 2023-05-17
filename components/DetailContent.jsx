'use client'
import {useDispatch, useSelector} from "react-redux";
import Image from "next/image";
import styles from "@/styles/header.module.scss";
import {useEffect} from "react";
import {CgPhone} from "react-icons/cg";
import {RiShareForward2Fill} from "react-icons/ri";
import {IoEarthOutline, IoLocationOutline} from "react-icons/io5";
import {BsPencil} from "react-icons/bs";
import * as dataStateAction from "@/store/modules/data";
import * as alertStateAction from "@/store/modules/alert"

export default function DetailContent({map}){
    const dispatch = useDispatch();
    const mapStore = useSelector(state => state.mapState)
    const dataStore = useSelector(state => state.dataState)

    const tooLongText =(text)=>{
        var newText;
        if(text.length>50){
            newText = String(text).substring(0,50) + '...';
        }else{
            newText =text;
        }

        return newText;
    }
    const copyUrl = (id)=>{
        dispatch(alertStateAction.setAlert({alert:true}))
        dispatch(alertStateAction.setMsg({msg:'URL이 복사되었습니다.'}))
        var url = window.location.href

        navigator.clipboard
            .writeText(url+'share/'+id)
            .then(() => {
                setTimeout(()=>{
                    dispatch(alertStateAction.setAlert({alert:false}))
                    dispatch(alertStateAction.setMsg({msg:null}))
                },1500)
            })
            .catch(() => {
                alert("something went wrong");
            });
    }





    useEffect(()=>{
        if(!dataStore.curDetail && !mapStore.mapLoading) return

        if(map){
            map.setLevel(3,true)
            map.panTo(new kakao.maps.LatLng(dataStore.curDetail[4]-0.002,dataStore.curDetail[5]));

            var mk = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(dataStore.curDetail[4],dataStore.curDetail[5]),
                map:map
            });

            return  ()=> {
                if(mk){
                    mk.setMap(null);
                }

            }
        }
    },[dataStore.curDetail,mapStore.mapLoading,map])

    const setStartPoint = (data)=>{
        dispatch(dataStateAction.setStartPoint({startPoint:data}))
    }

    const setEndPoint = (data)=>{
        dispatch(dataStateAction.setEndPoint({endPoint:data}))
    }
    const clickImg = () =>{
        console.log('??')
    }


    return(
        <div>
            {
                dataStore.curDetail?
                    <div>
                        <div className={styles.detailTitleSection}>
                            <h1 className={styles.detailTitle} >
                                {dataStore.curDetail[1]}
                            </h1>
                            <h4 style={{opacity:0.5}}>{dataStore.curDetail[6]}</h4>
                        </div>
                        <div className={styles.detailBtnSection}>
                            <div style={{float:"left"}}>
                                <CgPhone className={styles.detailIconBtn}/>
                                <RiShareForward2Fill className={styles.detailIconBtn} onClick={()=>copyUrl(dataStore.curDetail[0])}/>
                            </div>
                            <div style={{float:"right"}}>
                                <button className={styles.detailBtn} onClick={()=>setStartPoint(dataStore.curDetail)}><span style={{color:"gray"}}>출발</span></button>
                                <button className={styles.detailBtn} onClick={()=>setEndPoint(dataStore.curDetail)}><span style={{color:"gray"}}>도착</span></button>
                            </div>
                        </div>
                        <hr style={{marginBottom:'15px', width:'150%',marginLeft:'-20px', opacity:0.3}}/>


                        <div className={styles.detailContentScrollSection}>
                            <div style={{height:'150px'}}>
                                <div className={styles.detailContentSection}>
                                    <IoLocationOutline className={styles.detailIcon}/>
                                    <div>
                                        <span className={styles.detailContent}>서울 특별시 마포구 마포나루길 467 (우)04005</span>
                                        <br/>
                                        <span className={styles.detailContent}>지번 : 망원동 205-4</span>
                                    </div>
                                </div>

                                <div className={styles.detailContentSection}>
                                    <IoEarthOutline  className={styles.detailIcon}/>
                                    <a target="_blank"  rel="noopener noreferrer" href={'https://hangang.seoul.go.kr/archives/46737'} className={styles.detailUrl}>
                                        https://hangang.seoul.go.kr/archives/46737
                                    </a>
                                </div>

                                <div className={styles.detailContentSection}>
                                    <BsPencil  className={styles.detailIcon}/>
                                    <span className={styles.detailContent}>{tooLongText(dataStore.curDetail[2])}</span>
                                </div>
                            </div>
                            <hr style={{marginBottom:'15px', width:'150%',marginLeft:'-20px', opacity:0.3}}/>
                            <div className={styles.detailImageSection}>
                                <Image className={styles.detailInnerThumb} src={dataStore.curDetail[3]} alt={`${dataStore.curDetail[1]}`} width={50} height={50} onClick={()=>{clickImg()}}/>
                                <Image className={styles.detailInnerThumb} src={dataStore.curDetail[3]} alt={`${dataStore.curDetail[1]}`} width={50} height={50} onClick={()=>{clickImg()}}/>
                                <Image className={styles.detailInnerThumb} src={dataStore.curDetail[3]} alt={`${dataStore.curDetail[1]}`} width={50} height={50} onClick={()=>{clickImg()}}/>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
            }
        </div>
    )
}
