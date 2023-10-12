import Image from "next/image";
import styles from "/styles/header.module.scss"
import {useRef, useState} from "react";
import useSWR from "swr";
import useSearchAction from "@/hooks/useSearchAction";
import useStores from "@/hooks/useStores";
import useList from "@/hooks/useList";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";
import useLoading from "@/hooks/useLoading";
import useMenu from "@/hooks/useMenu";


export default function BottomSpotList(){
    const {setChoseStore} = useStores()
    const {setLoading} = useLoading();

    //하단 바텀 메뉴 상태 관리
    const {setBottomMenuStatus} = useMenu();
    const {data:bottomMenuStatus} = useSWR('/bottom/status')

    const {data:location} = useSWR('/map/curLoc')

    const pm10 = <span style={{color:"blue"}}>좋음</span>
    const pm25 = <span style={{color:"green"}}>보통</span>

    const { data:nearStores } = useSWR('/stores/near');

    const scrollRef = useRef();
    const [isDrag, setIsDrag] = useState(false)
    const [startX, setStartX] = useState(0)

    const onDragStart =e =>{
        e.preventDefault();
        setIsDrag(true)
        setStartX(e.pageX + scrollRef.current.scrollLeft);
    }

    const onDragEnd = ()=>{
        setIsDrag(false);
    }

    const onDragMove = e =>{
        if(isDrag){
            scrollRef.current.scrollLeft = startX - e.pageX;
        }
    }

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

    const subTitle = (text)=>{
        if(text.length>6) {
            return String(text).substring(0,6) + '...';
        }else{
            return text;
        }
    }
    return (
        <div>
        <div style={{paddingTop:'5px', paddingBottom:'5px'}}>
            <p style={{fontSize:'18px'}}><span style={{fontWeight:"bold"}}>{location}</span>관광지 리스트 입니다.</p>
            <p><span style={{fontSize:'12px'}}>미세먼지 {pm10} 초미세먼지 {pm25}</span></p>
        </div>
        <hr style={{marginBottom:'3px', width:'150%',marginLeft:'-20px', opacity:0.3}}/>
        <div>
            <div className={
                bottomMenuStatus!=='open'?styles.slideridle:styles.slideractive }
                 ref={scrollRef} onMouseDown={onDragStart} onMouseUp={onDragEnd}
                 onMouseMove={e=>setTimeout(onDragMove(e),200)} role={"option"}
            >
                {
                    nearStores.length===0?
                        <div style={{top:'20%',left:'25%',position:"fixed"}}><h3>주변에 관광지가 없습니다.</h3></div>
                        :
                    nearStores.map((e)=>{
                        return(
                            bottomMenuStatus!=='open'?
                                <div key={e.contentid} className={styles.detailHeaderSection} >
                                    <Image className={styles.image} src={e.firstimage} alt={`${e.title}`} width={125} height={170}
                                           onClick={()=>{goToDetail(e)}}/>
                                    <p>
                                        {subTitle(e.title)}
                                    </p>
                                </div>
                                :
                                <div key={e.contentid} className={styles.detailHeaderList}>
                                    <div>
                                        <p className={styles.detailHeaderTitle} >
                                            {e.title}
                                        </p>
                                        <span className={styles.detailHeaderContent}>{e.addr1}</span>
                                        <Image className={styles.detailHeaderThumb}
                                               src={e.firstimage}
                                               alt={`${e.title}`}
                                               width={0}
                                               height={0}
                                               sizes="100vw"
                                               onClick={()=>{goToDetail(e)}}/>
                                    </div>
                                </div>
                        )
                    })
                }
            </div>
        </div>
    </div>
    )
}
