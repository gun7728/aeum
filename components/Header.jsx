import styles from '../styles/header.module.scss'
import Link from "next/link";
import {AiOutlineSearch} from "react-icons/ai";
import {useEffect, useState} from "react";

export default function Header({searchWord}){
    const [str,setStr] = useState();

    useEffect(()=>{
        searchWord(str)
    },[str])

    const search=()=>{
        console.log(str)
    }
    return(
        <header className={styles.header}>
            <div className={styles.searchBox}>
                <AiOutlineSearch className={styles.searchBtn}  onClick={()=>{search()}}/>
                <input className={styles.flexItem} onKeyPress={(e)=>{
                    if(e.code==='Enter'  || e.code==="NumpadEnter"){
                        search()
                    }}
                } onChange={(e)=>{setStr(e.target.value)}} type={"text"} placeholder={'장소, 주소 검색'}></input>
            </div>
            {/*<div className={styles.flexItem}>버튼</div>*/}
        </header>
    )
}
