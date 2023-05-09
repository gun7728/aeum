'use client'
import Map from "@/components/Map";
import {useEffect, useState} from "react";
import MainComponents from "@/components/MainComponents";
import {useSelector} from "react-redux";
import SearchSection from "@/components/SearchSection";
import Header from "@/components/Header";
import DetailSection from "@/components/DetailSection";
import Loading from "@/components/loading";

export default function Home(){
    const [map,setMap]=useState(null);
    const searchStore = useSelector((state)=>state.searchState);
    const dataStore = useSelector((state)=>state.dataState)
    const mapStore = useSelector((state)=>state.mapState)

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
            {
                dataStore.curLocation?'':<Loading/>
            }
            {
                searchStore.page?<SearchSection/>:<></>
            }
            <Header/>
            <Map nMap={nMap}/>
            {
                mapStore.mapLoading?
                    <DetailSection map={map}/>
                    :<></>
            }
        </main>
    )
}
