import Image from "next/image";
import styles from "/styles/header.module.scss"
import {useRef, useState} from "react";
import useSWR from "swr";
import useSearchAction from "@/hooks/useSearchAction";
import useStores from "@/hooks/useStores";
import useList from "@/hooks/useList";


export default function DetailHeaderContent(){
    const {setListOpen, setListReOpen} = useList()
    const {setChoseStore} = useStores()

    const { data:stores } = useSWR('/stores');
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
        if(open){
            setListReOpen(true)
        }

        setListOpen(false);
        setChoseStore(e)
    }

    return (
        <div className={!open?styles.slideridle:styles.slideractive} ref={scrollRef} onMouseDown={onDragStart} onMouseUp={onDragEnd} onMouseMove={e=>setTimeout(onDragMove(e),200)} role={"option"} >
            {
                stores.map((e)=>{
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
