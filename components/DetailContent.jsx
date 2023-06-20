'use client'
import Image from "next/image";
import styles from "@/styles/header.module.scss";
import {useEffect, useState} from "react";
import {CgPhone} from "react-icons/cg";
import {RiShareForward2Fill} from "react-icons/ri";
import {IoEarthOutline, IoLocationOutline} from "react-icons/io5";
import {BsPencil} from "react-icons/bs";
import useSWR from "swr";
import useAlert from "@/hooks/useAlert";
import useStores from "@/hooks/useStores";
import useMap from "@/hooks/useMap";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";
import useLoading from "@/hooks/useLoading";

export default function DetailContent(){
    const {setAlertStart,setAlertMsg} = useAlert()
    const {setStartStore,setEndStore} = useMap()
    const {setLoading} = useLoading()

    const {data:map} = useSWR('/map')
    const {data:choseStore} = useSWR('/stores/chose')

    const [getImg, setGetImg] = useState([]);

    const tooLongText =(text)=>{
        if(!text)
            return

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

    useEffect(()=>{
        if(!choseStore && !map) return

        new Promise((resolve => {
            fetch(`/tourApi/detailImage1?serviceKey=${process.env.TOUR_API_ECD_KEY}&MobileOS=ETC&MobileApp=Aeum&_type=json&contentId=${choseStore.contentid}&imageYN=Y&subImageYN=Y&numOfRows=10&pageNo=1`)
            .then(function(response){
                return response.json()
            }).then(function(data) {
                var datas = data.response.body.items.item
                const imgList = [];

                if(datas){
                    datas.map((info)=>{
                        imgList.push(info.smallimageurl);
                    })
                }

                setGetImg(imgList);
                setLoading(false)

                if(map){
                    map.setLevel(3,true)
                    map.panTo(new kakao.maps.LatLng(choseStore.mapy-0.002,choseStore.mapx));

                    var mk = new kakao.maps.Marker({
                        position: new kakao.maps.LatLng(choseStore.mapy,choseStore.mapx),
                        map:map
                    });

                    return  ()=> {
                        if(mk){
                            mk.setMap(null);
                        }

                    }
                }

            });
            resolve()
        }))

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
                            <h2 className={styles.detailTitle} >
                                {choseStore.title}
                            </h2>
                            {/*<h4 style={{opacity:0.5}}>{choseStore[13]}</h4>*/}
                        </div>
                        <div className={styles.detailBtnSection}>
                            <div style={{float:"left"}}>
                                <CgPhone className={styles.detailIconBtn}/>
                                <RiShareForward2Fill className={styles.detailIconBtn} onClick={()=>copyUrl(choseStore.contentid)}/>
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
                                        <span className={styles.detailContent}>{choseStore.addr1}</span>
                                        <br/>
                                        <span className={styles.detailContent}>{choseStore.zipcode}</span>
                                    </div>
                                </div>

                                <div className={styles.detailContentSection}>
                                    <IoEarthOutline  className={styles.detailIcon}/>
                                    <div dangerouslySetInnerHTML={{__html: choseStore.homepage}} className={styles.detailUrl}/>
                                </div>

                                <div className={styles.detailContentSection}>
                                    <BsPencil  className={styles.detailIcon}/>
                                    <span className={styles.detailContent}>{tooLongText(choseStore.overview)}</span>
                                </div>
                            </div>
                            <hr style={{marginBottom:'15px', width:'150%',marginLeft:'-20px', opacity:0.3}}/>
                            <div style={{alignItems: 'center', justifyContent: 'flex-start',overflowX: 'scroll',display:'flex'}} >
                                {
                                    getImg.length>0?
                                    getImg.map((img,idx)=>{
                                        return <img key={idx} alt={choseStore.title} className={styles.detailInnerThumb} src={img} width={150} height={150} onClick={()=>{clickImg()}}/>
                                    })
                                        :
                                        <div>이미지가 없습니다.</div>
                                }
                            </div>
                        </div>
                    </div>
                    :
                    <></>
            }
        </div>
    )
}
