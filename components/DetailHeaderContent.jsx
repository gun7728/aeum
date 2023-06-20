import Image from "next/image";
import styles from "/styles/header.module.scss"
import {useRef, useState} from "react";
import useSWR from "swr";
import useSearchAction from "@/hooks/useSearchAction";
import useStores from "@/hooks/useStores";
import useList from "@/hooks/useList";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";
import useLoading from "@/hooks/useLoading";


export default function DetailHeaderContent(){
    const {setListOpen, setListReOpen} = useList()
    const {setChoseStore} = useStores()
    const {setLoading} = useLoading();

    const { data:nearStores } = useSWR('/stores/near');
    const { data:open } = useSWR('/list/open');

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
        if(open){
            setListReOpen(true)
        }

            // fetch(`/tourApi/areaBasedSyncList1?serviceKey=${process.env.TOUR_API_ECD_KEY}&numOfRows=20000&pageNo=1&MobileOS=ETC&MobileApp=Aeum&_type=json&showflag=1&listYN=Y&arrange=A&contentTypeId=12`)
        fetch(`/tourApi/detailCommon1?serviceKey=${process.env.TOUR_API_ECD_KEY}&MobileOS=ETC&MobileApp=Aeum&_type=json&contentId=${e.contentid}&contentTypeId=12&defaultYN=Y&firstImageYN=Y&areacodeYN=Y&catcodeYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&numOfRows=10&pageNo=1`)
        .then(function(response){
            return response.json()
        }).then(function(data) {
            var datas = data.response.body.items.item[0]

            setListOpen(false);
            setChoseStore(datas)
        });

    }
    return (
        <div className={!open?styles.slideridle:styles.slideractive} ref={scrollRef} onMouseDown={onDragStart} onMouseUp={onDragEnd} onMouseMove={e=>setTimeout(onDragMove(e),200)} role={"option"} >
            {
                nearStores.length===0?
                    <div>주변에 관광지가 없습니다.</div>
                    :
                nearStores.map((e)=>{
                    return(
                        !open?
                            <div key={e.contentid} className={styles.detailHeaderSection} >
                                <Image className={styles.image} src={e.firstimage} alt={`${e.title}`} width={125} height={170} onClick={()=>{goToDetail(e)}}/>
                                <p>
                                    {e.title}
                                </p>
                            </div>
                            :
                            <div key={e.id} className={styles.detailHeaderList}>
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
    )
}
