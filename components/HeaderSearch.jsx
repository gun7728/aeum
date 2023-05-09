'use client'
import styles from "@/styles/header.module.scss";
import {AiOutlineLeft, AiOutlineSearch} from "react-icons/ai";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import * as searchStateAction from "@/store/modules/search";
import * as dataStateAction from "@/store/modules/data";

export default function HeaderSearch(){
    const [str,setStr] = useState()
    const inputRef = useRef();
    const dispatch = useDispatch();
    const searchStore = useSelector((state)=>state.searchState)

    const setSearchWord = (()=>{
        if(str!=''){
            dispatch(searchStateAction.setWord({value:str}))
            dispatch(searchStateAction.searchStart({start:true}))
            dispatch(dataStateAction.setCurDetail({curDetail:null}))
        }
    })

    useEffect(()=>{
        if(str===''&&searchStore.start){
            dispatch(searchStateAction.searchStart({start:false}))
        }
    },[str])

    const setSearchAction = ((bool)=>{
        dispatch(searchStateAction.searchAction({action:bool}))
    })
    const setSearchPage = ((bool)=>{
        if(searchStore.start&&!bool){
            dispatch(searchStateAction.searchStart({start:false}))
        }else{
            dispatch(searchStateAction.pageChange({page:bool}))
        }
        if(!bool) {
            inputRef.current.value=null
            dispatch(searchStateAction.setWord({value:null}))
        }
    })
    return(
        <div className={styles.searchBox}>
            <AiOutlineSearch className={styles.searchBtn}  onClick={()=>{setSearchWord()}}/>
            <AiOutlineLeft style={!searchStore.page?{display:'none'}:''} className={styles.flexBtn} onClick={()=>{setSearchPage(false)}}/>
            <input
                ref={inputRef}
                className={styles.flexItem}
                    className={!searchStore.page?`${styles.flexItem}`: `${styles.flexItemActive}`}
                   onKeyDown={(e)=>{
                       if(e.code==='Enter'  || e.code==="NumpadEnter" ||e.keyCode===13 ){
                           setSearchWord()
                       }
                   }

                   }
                   onChange={(e)=>{setStr(e.target.value)}}
                   onClick={()=>{
                       setSearchPage(true),
                       setSearchAction(true)
                   }}
                   type={"text"}
                   placeholder={'장소, 주소 검색'}
            ></input>
        </div>
    )
}
