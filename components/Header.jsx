'use client'
import styles from '../styles/header.module.scss'
import {AiOutlineSearch} from "react-icons/ai";
import {useState} from "react";
import {useDispatch} from "react-redux";
import * as searchWordAction from '../store/modules/searchWord'

export default function Header({searchAction}){
    const dispatch = useDispatch();

    const [str,setStr] = useState();

    const search=()=>{
        searchAction(str)
    }

    const setSearchWord = ((val)=>{
        dispatch(searchWordAction.set({value:val}))
    })

    return(
        <header className={styles.header}>
            <div className={styles.searchBox}>
                <AiOutlineSearch className={styles.searchBtn}  onClick={()=>{search()}}/>
                <input className={styles.flexItem}
                       onKeyPress={(e)=>{
                    if(e.code==='Enter'  || e.code==="NumpadEnter"){
                        search()
                    }}
                }
                       onChange={(e)=>{setSearchWord(e.target.value)}}
                       type={"text"}
                       placeholder={'장소, 주소 검색'}
                ></input>
            </div>
            {/*<div className={styles.flexItem}>버튼</div>*/}
        </header>
    )
}
