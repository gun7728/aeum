import styles from '../styles/header.module.scss'
import Link from "next/link";
import {AiOutlineSearch} from "react-icons/ai";

export default function Header(){

    return(
        <header className={styles.header}>
            <div className={styles.searchBox}>
                <input className={styles.flexItem} type={"text"} placeholder={'장소, 주소 검색'}></input>
                <button className={styles.searchBtn}>
                    <AiOutlineSearch />
                </button>
            </div>
            {/*<div className={styles.flexItem}>버튼</div>*/}
        </header>
    )
}
