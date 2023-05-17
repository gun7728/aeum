import styles from '../styles/header.module.scss'
import HeaderSearch from "@/components/HeaderSearch";

export default function Header({map}){
    return(
        <header className={styles.header}>
            <HeaderSearch map={map}/>
            {/*<div className={styles.flexItem}>버튼</div>*/}
        </header>
    )
}
