'use client'
import Map from "@/components/Map";
import DetailSection from "@/components/DetailSection";
import {useEffect, useState} from "react";
import MainComponents from "@/components/MainComponents";
import {useSelector} from "react-redux";
import SearchSection from "@/components/SearchSection";
import Header from "@/components/Header";

export default function Home(){
    const [map,setMap]=useState(null);
    const searchStore = useSelector((state)=>state.searchState)
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
                searchStore.page?<SearchSection/>:<></>
            }
            <Header/>
            <Map nMap={nMap}/>
            {
                mapStore.mapLoading?
                    <DetailSection/>
                    :<></>
            }
        </main>
    )
}
