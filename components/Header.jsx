import styles from '../styles/header.module.scss'
import HeaderSearch from "@/components/HeaderSearch";

export default function Header(){
    return(
        <header className={styles.header}>
            <HeaderSearch/>
            {/*<div className={styles.flexItem}>버튼</div>*/}
        </header>
    )
}
