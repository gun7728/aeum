import {useDispatch, useSelector} from "react-redux";
import Image from "next/image";
import styles from "/styles/header.module.scss"
import {useRef, useState} from "react";
import * as dataStateAction from "@/store/modules/data";

export default function DetailHeaderContent(){
    const dataStore = useSelector((state)=>state.dataState)
    const dispatch = useDispatch();

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
        dispatch(dataStateAction.setCurDetail({curDetail:Object.values(e)}))
    }

    return (
        <div className={styles.slider} ref={scrollRef} onMouseDown={onDragStart} onMouseUp={onDragEnd} onMouseMove={e=>setTimeout(onDragMove(e),200)} role={"option"} >
            {
                dataStore.touristData.map((e)=>{
                    return(
                        <div key={e.id} className={styles.detailSection} >
                            <Image className={styles.image} src={e.image} alt={`${e.title}`} width={125} height={170} onClick={()=>{goToDetail(e)}}/>
                            <p>
                                {e.title}
                            </p>
                        </div>
                    )
                })
            }
        </div>
    )
}
