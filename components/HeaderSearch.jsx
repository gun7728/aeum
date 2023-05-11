'use client'
import styles from "@/styles/header.module.scss";
import {AiOutlineLeft, AiOutlineSearch} from "react-icons/ai";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import * as searchStateAction from "@/store/modules/search";
import * as dataStateAction from "@/store/modules/data";
import {HiOutlineSwitchVertical, HiX} from "react-icons/hi";

export default function HeaderSearch(){
    const [str,setStr] = useState()
    const inputRef = useRef();
    const spRef = useRef();
    const epRef = useRef();
    const dispatch = useDispatch();
    const searchStore = useSelector((state)=>state.searchState)
    const dataStore = useSelector(state => state.dataState);

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

    useEffect(()=>{
        if(dataStore.startPoint){
            spRef.current.value = dataStore.startPoint[1]
        }else{
            spRef.current.value = null
        }

        if(dataStore.endPoint){
            epRef.current.value = dataStore.endPoint[1]
        }else{
            epRef.current.value=null;
        }

    },[dataStore.startPoint,dataStore.endPoint])

    const resetStartEnd = () => {
        dispatch(dataStateAction.setStartPoint({startPoint:null}))
        dispatch(dataStateAction.setEndPoint({endPoint:null}))
        dispatch(dataStateAction.setCurDetail({curDetail:null}))
        dispatch(searchStateAction.setWord({value:null}))
        dispatch(searchStateAction.pageChange({page:false}))
        setSearchPage(false)

        inputRef.current.value=null
    }

    const switchStartEnd = () =>{
        var sp  = dataStore.startPoint;
        var ep  = dataStore.endPoint;
        dispatch(dataStateAction.setStartPoint({startPoint:ep}))
        dispatch(dataStateAction.setEndPoint({endPoint:sp}))
    }

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
        <>
            <div style={( dataStore.startPoint || dataStore.endPoint ) ? {} :  {display:'none'}} className={styles.startEndBox}>
                <HiOutlineSwitchVertical
                    onClick={()=>switchStartEnd()}
                    className={styles.switchBtn}/>
                <HiX
                    onClick={()=>resetStartEnd()}
                    className={styles.exitBtn}/>
                <input
                    onClick={()=>{
                        setSearchPage(true),
                        setSearchAction(true)
                    }}
                    onKeyDown={(e)=>{
                        if(e.code==='Enter'  || e.code==="NumpadEnter" ||e.keyCode===13 ){
                            setSearchWord()
                        }
                    }

                    }
                    onChange={(e)=>{setStr(e.target.value)}}

                    ref={spRef}
                    className={styles.startItem}/>
                <input
                    onClick={()=>{
                        setSearchPage(true),
                        setSearchAction(true)
                    }}

                    onKeyDown={(e)=>{
                        if(e.code==='Enter'  || e.code==="NumpadEnter" ||e.keyCode===13 ){
                            setSearchWord()
                        }
                    }

                    }
                    onChange={(e)=>{setStr(e.target.value)}}

                    ref={epRef}
                    className={styles.endItem}/>
            </div>

            <div style={( dataStore.startPoint || dataStore.endPoint ) ? {display:'none'}:{}} className={styles.searchBox}>
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
        </>
    )
}
