import styles from '../../styles/header.module.scss'
import TopSearchMenu from "@/components/Top/search/TopSearchMenu";

export default function TopMenu({map}){
    return(
        <header className={styles.header}>
            <TopSearchMenu map={map}/>
            {/*<div className={styles.flexItem}>버튼</div>*/}
        </header>
    )
}
