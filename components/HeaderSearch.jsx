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
        if(searchStore.value !=='' && searchStore.start){
            inputRef.current.value=searchStore.value
        }
    },[searchStore.value,searchStore.start])

    useEffect(()=>{
        if(str===''&&searchStore.start){
            dispatch(searchStateAction.searchStart({start:false}))
        }
    },[str])

    useEffect(()=>{
        if(dataStore.startPoint){
            spRef.current.value = dataStore.startPoint[1]

            if(!dataStore.endPoint){
                epRef.current.focus();
                dispatch(searchStateAction.searchStart({start:false}))
                setSearchPage(true)
                setSearchAction(true)
            }
        }else{
            spRef.current.value = null
        }

        if(dataStore.endPoint){
            epRef.current.value = dataStore.endPoint[1]

            if(!dataStore.startPoint) {
                spRef.current.focus();
                dispatch(searchStateAction.searchStart({start: false}))
                setSearchPage(true)
                setSearchAction(true)
            }
        }else{
            epRef.current.value=null;
        }

        if(dataStore.endPoint && dataStore.startPoint){
            // console.log('??')
        }
    },[dataStore.startPoint,dataStore.endPoint])

    const startStr = (str) =>{
        setStr(str)
        if(str==''){
            dispatch(dataStateAction.setStartPoint({startPoint:null}))
        }
    }
    const endStr = (str) =>{
        setStr(str)
        if(str==''){
            dispatch(dataStateAction.setEndPoint({endPoint:null}))
        }
    }
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
                        dispatch(searchStateAction.searchStart({start:false}))
                        setSearchPage(true),
                        setSearchAction(true)
                    }}
                    onKeyDown={(e)=>{
                        if(e.code==='Enter'  || e.code==="NumpadEnter" ||e.keyCode===13 ){
                            setSearchWord()
                        }
                    }

                    }
                    onChange={(e)=>{startStr(e.target.value)}}
                    placeholder={'출발지를 선택해 주세요.'}
                    ref={spRef}
                    className={styles.startItem}/>
                <input
                    onClick={()=>{
                        dispatch(searchStateAction.searchStart({start:false}))
                        setSearchPage(true),
                        setSearchAction(true)
                    }}

                    onKeyDown={(e)=>{
                        if(e.code==='Enter'  || e.code==="NumpadEnter" ||e.keyCode===13 ){
                            setSearchWord()
                        }
                    }

                    }
                    onChange={(e)=>{endStr(e.target.value)}}
                    placeholder={'도착지를 선택해 주세요.'}
                    ref={epRef}
                    className={styles.endItem}/>
                <button className={styles.confirmBtn}>
                    확인
                </button>
                <button className={styles.confirmBtn}>
                    취소
                </button>
            </div>

            <div style={( dataStore.startPoint || dataStore.endPoint ) ? {display:'none'}:{}} className={styles.searchBox}>
                <AiOutlineSearch className={styles.searchBtn}  onClick={()=>{setSearchWord()}}/>
                <AiOutlineLeft style={!searchStore.page?{display:'none'}:''} className={styles.flexBtn}
                   onClick={()=>{
                       setSearchPage(false)
                       dispatch(dataStateAction.setCurDetail({curDetail:null}))
                }}/>
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
                               setSearchAction(true),
                               dispatch(dataStateAction.setCurDetail({curDetail:null}))
                           }}
                           type={"text"}
                           placeholder={'장소, 주소 검색'}
                    ></input>
                </div>
        </>
    )
}
