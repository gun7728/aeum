import styles from '@/styles/alert.module.scss'
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import useSWR from "swr";
export default function FadeAlert(){
    const {data:alertStart} = useSWR('/alert')
    const {data:alertMsg} = useSWR('/alert/msg')

    const [alertOpacity, setAlertOpacity] = useState(0);
    const [alertZIndex, setAlertZIndex] = useState(0);

    useEffect(()=>{
        if(alertStart){
            setAlertOpacity(80)
            setAlertZIndex(999)
            opaCont()
        }else{
            setAlertZIndex(0);
        }
    },[alertStart])

    useEffect(()=>{
        opaCont()
    },[opaCont])
    function opaCont (){
        if (alertOpacity > 76) { // 초기부터 바로 사라지는게 시작되면 메시지 전달할 시간이 부족할듯하여 초반에는 투명도를 1씩 천천히 변화 시켰다.
            setTimeout(() => {
                setAlertOpacity(alertOpacity - 1);
            }, 80);
        } else if (alertOpacity > 5) // 초기 약 0.4초후에는 부드럽게 사라지도록 구현했다.
            setTimeout(() => {
                setAlertOpacity(alertOpacity - 8);
            }, 100); // 시간이 짧으수록 부드럽지만 리소스 소모가커지기 때문에 설정할때 고민이 필요한 부분이다.
    }

    return (
        <>
            {
                alertMsg?
                    <>
                        <div className={styles.fadeAlert}
                             style={{opacity:`${alertOpacity}%`, zIndex:alertZIndex}}>

                        </div>
                        <div  className={styles.fadeAlertMsg} >
                            <div style={{height:'100%', display:"table", width:'100%'}}>
                                <span style={{display:"table-cell",verticalAlign:"middle",width:'100%'}}>
                                  {alertMsg}
                                </span>
                            </div>
                        </div>
                    </>
                    :
                <></>
            }
        </>

    )
}
