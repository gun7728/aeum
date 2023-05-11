import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import Image from "next/image";
import * as searchStateAction from "@/store/modules/search";
import * as dataStateAction from "@/store/modules/data";
import styles from '@/styles/search.module.scss'

export default function SearchResult(){
    const dispatch = useDispatch();
    const searchStore = useSelector((state)=>state.searchState)
    const dataStore = useSelector(state => state.dataState)
    const [results, setResults] = useState([]);

    useEffect(()=>{
        if(searchStore.value){
            var resultList = [];
            dataStore.touristData.map((e)=>{
                if(JSON.stringify(e.title + ' ' + e.content).includes(searchStore.value)){
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

    useEffect(()=>{
        dispatch(searchStateAction.setSearchData({searchData:results}))
    },[results])

    return(
        <div className={styles.searchResultSection}>
            {
                results.length>0?
                    results.map((e)=>{
                        return(
                            <div key={e.id}>
                                <p>
                                    {e.title}
                                </p>
                                <Image className={styles.searchListItem} src={e.image} alt={`${e.title}`} width={125} height={170} onClick={()=>{goToDetail(e)}}/>
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
