'use client'
import {useSelector} from "react-redux";
import Image from "next/image";
import styles from "@/styles/header.module.scss";
import {useEffect, useState} from "react";
import {CgPhone} from "react-icons/cg";
import {RiShareForward2Fill} from "react-icons/ri";
import {IoEarthOutline, IoLocationOutline} from "react-icons/io5";
import {BsPencil} from "react-icons/bs";

export default function DetailContent({map}){
    const mapStore = useSelector(state => state.mapState)
    const dataStore = useSelector(state => state.dataState)
    const [marker,setMarker] = useState();

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
        var url = window.location.href
        navigator.clipboard.writeText(url+'/share/'+id);
        alert("복사되었습니다.")
    }

    useEffect(()=>{
        if(!dataStore.curDetail && !mapStore.mapLoading) return

        if(map){
            map.setZoom(15,true)
            map.panTo(new naver.maps.LatLng(dataStore.curDetail[4]-0.005,dataStore.curDetail[5]));

            var mk = new naver.maps.Marker({
                position: new naver.maps.LatLng(dataStore.curDetail[4],dataStore.curDetail[5]),
                map:map
            });

            setMarker(mk)

            return  ()=> {
                if(!mk)return
                mk.setMap(null);
            }
        }
    },[dataStore.curDetail,mapStore.mapLoading,map])

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
                                <button className={styles.detailBtn}><span style={{color:"gray"}}>출발</span></button>
                                <button className={styles.detailBtn}><span style={{color:"gray"}}>도착</span></button>
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
                                    <a target="_blank"  rel="noopener noreferrer" href={'https://hangang.seoul.go.kr/archives/46737'} className={styles.detailContent}>
                                        https://hangang.seoul.go.kr/archives/46737
                                    </a>
                                </div>

                                <div className={styles.detailContentSection}>
                                    <BsPencil  className={styles.detailIcon}/>
                                    <div>
                                        <span className={styles.detailContent}>{tooLongText(dataStore.curDetail[2])}</span>
                                    </div>
                                </div>
                            </div>
                            <hr style={{marginBottom:'15px', width:'150%',marginLeft:'-20px', opacity:0.3}}/>
                            <div className={styles.detailImageSection}>
                                <Image className={styles.detailInnerThumb} src={dataStore.curDetail[3]} alt={`${dataStore.curDetail[1]}`} width={50} height={50}/>
                                <Image className={styles.detailInnerThumb} src={dataStore.curDetail[3]} alt={`${dataStore.curDetail[1]}`} width={50} height={50}/>
                                <Image className={styles.detailInnerThumb} src={dataStore.curDetail[3]} alt={`${dataStore.curDetail[1]}`} width={50} height={50}/>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
            }
        </div>
    )
}
