'use client'
import Map from "@/components/Map";
import DetailSection from "@/components/DetailSection";
import {useEffect, useState} from "react";

export default function Home(){
    const [map,setMap]=useState(null);
    const nMap = (x)=>{
        setMap(x);
    }
    const [expandedFlag, setExpandedFlag] = useState(false)

    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)

// the required distance between touchStart and touchEnd to be detected as a swipe
    const minSwipeDistance = 50

    const onTouchStart = (e) => {
        setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
        setTouchStart(e.targetTouches[0].clientY)
    }

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientY)

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const isTopSwipe = distance > minSwipeDistance
        const isBottomSwipe = distance < -minSwipeDistance
        if (isTopSwipe){
            setExpandedFlag(true)
        }else if(isBottomSwipe){
            setExpandedFlag(false)
        }
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
            <div
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}>
                {
                    map?
                    <DetailSection
                        expandedFlag={expandedFlag}
                        map={map}/>
                    :<></>
                }
            </div>
        </main>
    )
}
