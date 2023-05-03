'use client'
import Map from "@/components/Map";
import DetailSection from "@/components/DetailSection";
import {useEffect, useState} from "react";
import MainComponents from "@/components/MainComponents";

export default function Home(){
    const [map,setMap]=useState(null);
    const [str, setStr] = useState();
    const [searchFlag, setSearchFlag] = useState(false);

    const nMap = (x)=>{
        setMap(x);
    }

    const searchWord = (x)=>{
        if(x){
            setStr(x)
            setSearchFlag(false)
        }
    }
    const searchFlagFun = (x)=>{
        setSearchFlag(x)
    }

    const searchAction = (x)=>{
        alert('Go Search')
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
            <MainComponents searchAction={searchAction} searchWord={searchWord}/>
            <Map nMap={nMap}/>
                {
                    map?
                    <DetailSection
                        map={map}
                        searchFlag={searchFlag}
                        searchFlagFun={searchFlagFun}/>
                    :<></>
                }
        </main>
    )
}
