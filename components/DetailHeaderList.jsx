'use client'
import DetailHeaderContent from "@/components/DetailHeaderContent";
import useSWR from "swr";

export default function DetailHeaderList(){
    const {data:location} = useSWR('/map/curLoc')

    const pm10 = <span style={{color:"blue"}}>좋음</span>
    const pm25 = <span style={{color:"green"}}>보통</span>

    return(
        <>
            <div style={{paddingTop:'5px', paddingBottom:'5px'}}>
                <p style={{fontSize:'18px'}}><span style={{fontWeight:"bold"}}>{location}</span>에 오신 것을 환영합니다.</p>
                <p><span style={{fontSize:'12px'}}>미세먼지 {pm10} 초미세먼지 {pm25}</span></p>
            </div>
            <hr style={{marginBottom:'3px', width:'150%',marginLeft:'-20px', opacity:0.3}}/>
            <div>
                <DetailHeaderContent />
            </div>
        </>
    )
}
