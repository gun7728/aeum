'use client'
import Map from "@/components/Map";
import DetailSection from "@/components/DetailSection";
import {useEffect, useState} from "react";
import MainComponents from "@/components/MainComponents";
import {useSelector} from "react-redux";
import searchWord from "@/store/modules/searchWord";

export default function Home(){
    const [map,setMap]=useState(null);
    const [str, setStr] = useState();
    const [searchFlag, setSearchFlag] = useState(false);
    const searchWord = useSelector((state)=>state.searchWord)

    const nMap = (x)=>{
        setMap(x);
    }

    useEffect(()=>{
        setSearchFlag(false)
        setStr(searchWord.value)
    },[searchWord.value])


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
            <MainComponents searchAction={searchAction}/>
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
