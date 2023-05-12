import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import Image from "next/image";
import * as searchStateAction from "@/store/modules/search";
import * as dataStateAction from "@/store/modules/data";
import styles from '@/styles/search.module.scss'
import {CgPhone} from "react-icons/cg";
import {RiShareForward2Fill} from "react-icons/ri";

export default function SearchResult(){
    const dispatch = useDispatch();
    const searchStore = useSelector((state)=>state.searchState)
    const dataStore = useSelector(state => state.dataState)
    const [results, setResults] = useState([]);

    useEffect(()=>{
        if(searchStore.value){
            var resultList = [];
            dataStore.touristData.map((e)=>{
                if(JSON.stringify(e.title + ' ' + e.content + ' ' + e.loc).includes(searchStore.value)){
                    resultList.push(e);
                }
            })
            setResults(resultList)
        }
    },[searchStore.value])

    const goToDetail =(e)=>{
        dispatch(searchStateAction.searchAction({action:true}))
        dispatch(dataStateAction.setCurDetail({curDetail:Object.values(e)}))
    }

    const copyUrl = (id)=>{
        var url = window.location.href

        navigator.clipboard
            .writeText(url+'/share/'+id)
            .then(() => {
                alert("successfully copied");
            })
            .catch(() => {
                alert("something went wrong");
            });
    }

    const setStartPoint = (data)=>{
        dispatch(dataStateAction.setStartPoint({startPoint:Object.values(data)}))
    }

    const setEndPoint = (data)=>{
        dispatch(dataStateAction.setEndPoint({endPoint:Object.values(data)}))
    }

    useEffect(()=>{
        dispatch(searchStateAction.setSearchData({searchData:results}))
    },[results])

    return(
        <div className={styles.searchResultSection}>
            {
                results.length>0?
                    results.map((e)=>{
                        return(
                            <div key={e.id} className={styles.searchListItemSection}>
                                <div className={styles.textSection}>
                                    <span className={styles.title}>
                                        {e.title}
                                    </span>
                                        <span  className={styles.loc}>
                                        {e.loc}
                                    </span>
                                </div>
                                <Image className={styles.searchListItem} src={e.image} alt={`${e.title}`} width={125} height={170} onClick={()=>{goToDetail(e)}}/>
                                <hr style={{marginBottom:'0px', width:'150%',marginLeft:'-20px', opacity:0.3}}/>
                                <div className={styles.detailBtnSection}>
                                    <div style={{float:"left"}}>
                                        <CgPhone className={styles.detailIconBtn}/>
                                        <RiShareForward2Fill className={styles.detailIconBtn} onClick={()=>copyUrl(e.id)}/>
                                    </div>
                                    <div style={{float:"right"}}>
                                        <button className={styles.detailBtn} onClick={()=>setStartPoint(e)}><span style={{color:"gray"}}>출발</span></button>
                                        <button className={styles.detailBtn} onClick={()=>setEndPoint(e)}><span style={{color:"gray"}}>도착</span></button>
                                    </div>
                                </div>
                                <hr style={{marginBottom:'15px', width:'150%',marginLeft:'-20px', opacity:0.3}}/>
                            </div>
                        )
                    })
                    :
                <div>
                    검색 결과가 없습니다.
                </div>
            }
        </div>
    )
}
