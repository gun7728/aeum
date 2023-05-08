import {useSelector} from "react-redux";
import Image from "next/image";
import styles from "@/styles/header.module.scss";

export default function DetailContent(){
    const dataStore = useSelector(state => state.dataState)

    return(
        <div>
            {
                dataStore.curDetail?
                    <div>
                        <Image className={styles.image} src={dataStore.curDetail[3]} alt={`${dataStore.curDetail[1]}`} width={256} height={170}/>
                        <p>{dataStore.curDetail[1]}</p>
                        <p>{dataStore.curDetail[2]}</p>
                    </div>
                    :
                    <></>
            }
        </div>
    )
}
