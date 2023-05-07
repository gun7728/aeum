import {useSelector} from "react-redux";
import Image from "next/image";
import styles from "/styles/header.module.scss"
export default function DetailHeaderContent(){
    const dataStore = useSelector((state)=>state.dataState)


    return (
        <div  style={{width:'1000%'}}>
            {
                dataStore.touristData.map((e)=>{
                    return(
                        <div key={e.id} className={styles.detailSection}>
                            <Image className={styles.image} src={e.image} alt={`${e.title}`} width={125} height={170}/>
                            <p>
                                {e.title}
                            </p>
                        </div>
                    )
                })
            }
        </div>
    )
}