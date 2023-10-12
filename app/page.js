'use client'
import {useSelector} from "react-redux";
import TopMenu from "@/components/Top/TopMenu";
import BottomMenu from "@/components/Bottom/BottomMenu";
import Loading from "@/components/loading";
import KakaoMap from "@/components/KakaoMap";
import FadeAlert from "@/components/FadeAlert";
import useSWR from "swr";
import useStores from "@/hooks/useStores";
import {useEffect} from "react";
import useMap from "@/hooks/useMap";

export default function Home(){
    const { data:map } = useSWR('/map');
    const { data:nearStores } = useSWR('/stores/near');
    const { data:position } = useSWR('/map/curPos');
    const { data:loading } = useSWR('/loading')


    return(
        <div
            style={{height:'100%'}}>
            <main
                  style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      overflow: 'hidden',
                  }}
              >
                {
                    (position && nearStores)?(loading?<Loading/>:''):<Loading/>
                }
                <FadeAlert/>
                <TopMenu/>
                <KakaoMap/>
                {
                    (map && nearStores)?
                        <BottomMenu />
                        :<></>
                }
            </main>
        </div>
    )
}
