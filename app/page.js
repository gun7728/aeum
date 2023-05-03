'use client'
import Map from "@/components/Map";
import DetailSection from "@/components/DetailSection";
import {useEffect, useState} from "react";

export default function Home(){
    const [map,setMap]=useState(null);
    const nMap = (x)=>{
        setMap(x);
    }
    return(
        <main
              style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
              }}
          >

            <Map nMap={nMap}/>
            {map?<DetailSection map={map}/>:<></>}
        </main>
    )
}
