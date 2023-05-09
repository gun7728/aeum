'use client'
import {useSelector} from "react-redux";
import Image from "next/image";
import styles from "@/styles/header.module.scss";
import {useEffect, useState} from "react";

export default function DetailContent({map}){
    const dataStore = useSelector(state => state.dataState)
    const [marker,setMarker] = useState();

    useEffect(()=>{
        if(!dataStore.curDetail)return

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
    },[dataStore.curDetail])

    return(
        <div>
            {
                dataStore.curDetail?
                    <div>
                        <p>{dataStore.curDetail[1]}</p>
                        <Image className={styles.image} src={dataStore.curDetail[3]} alt={`${dataStore.curDetail[1]}`} width={256} height={170}/>

                        <p>{dataStore.curDetail[2]}</p>
                    </div>
                    :
                    <></>
            }
        </div>
    )
}
