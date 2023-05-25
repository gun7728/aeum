'use client'
import Image from "next/image";
import styles from "@/styles/header.module.scss";
import {useEffect} from "react";
import {CgPhone} from "react-icons/cg";
import {RiShareForward2Fill} from "react-icons/ri";
import {IoEarthOutline, IoLocationOutline} from "react-icons/io5";
import {BsPencil} from "react-icons/bs";
import useSWR from "swr";
import useAlert from "@/hooks/useAlert";
import useStores from "@/hooks/useStores";

export default function DetailContent(){
    const {setAlertStart,setAlertMsg} = useAlert()
    const {setStartStore,setEndStore} = useStores()

    const {data:map} = useSWR('/map')
    const {data:choseStore} = useSWR('/stores/chose')

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
        setAlertStart(true)
        // dispatch(alertStateAction.setAlert({alert:true}))
        setAlertMsg('URL이 복사되었습니다.')
        // dispatch(alertStateAction.setMsg({msg:}))
        var url = window.location.href

        navigator.clipboard
            .writeText(url+'share/'+id)
            .then(() => {
                setTimeout(()=>{
                    setAlertStart(false)
                    setAlertMsg(null)
                    // dispatch(alertStateAction.setAlert({alert:false}))
                    // dispatch(alertStateAction.setMsg({msg:null}))
                },1500)
            })
            .catch(() => {
                alert("something went wrong");
            });
    }

    useEffect(()=>{
        if(!choseStore && !map) return

        if(map){
            map.setLevel(3,true)
            map.panTo(new kakao.maps.LatLng(choseStore[4]-0.002,choseStore[5]));

            var mk = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(choseStore[4],choseStore[5]),
                map:map
            });

            return  ()=> {
                if(mk){
                    mk.setMap(null);
                }

            }
        }
    },[choseStore,map])

    const setStartPoint = (data)=>{
        setStartStore(data)
    }

    const setEndPoint = (data)=>{
        setEndStore(data)
    }
    const clickImg = () =>{
        console.log('??')
    }


    return(
        <div>
            {
                choseStore?
                    <div>
                        <div className={styles.detailTitleSection}>
                            <h1 className={styles.detailTitle} >
                                {choseStore[1]}
                            </h1>
                            <h4 style={{opacity:0.5}}>{choseStore[6]}</h4>
                        </div>
                        <div className={styles.detailBtnSection}>
                            <div style={{float:"left"}}>
                                <CgPhone className={styles.detailIconBtn}/>
                                <RiShareForward2Fill className={styles.detailIconBtn} onClick={()=>copyUrl(choseStore[0])}/>
                            </div>
                            <div style={{float:"right"}}>
                                <button className={styles.detailBtn} onClick={()=>setStartPoint(choseStore)}><span style={{color:"gray"}}>출발</span></button>
                                <button className={styles.detailBtn} onClick={()=>setEndPoint(choseStore)}><span style={{color:"gray"}}>도착</span></button>
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
                                    <span className={styles.detailContent}>{tooLongText(choseStore[2])}</span>
                                </div>
                            </div>
                            <hr style={{marginBottom:'15px', width:'150%',marginLeft:'-20px', opacity:0.3}}/>
                            <div className={styles.detailImageSection}>
                                <Image className={styles.detailInnerThumb} src={choseStore[3]} alt={`${choseStore[1]}`} width={50} height={50} onClick={()=>{clickImg()}}/>
                                <Image className={styles.detailInnerThumb} src={choseStore[3]} alt={`${choseStore[1]}`} width={50} height={50} onClick={()=>{clickImg()}}/>
                                <Image className={styles.detailInnerThumb} src={choseStore[3]} alt={`${choseStore[1]}`} width={50} height={50} onClick={()=>{clickImg()}}/>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
            }
        </div>
    )
}
