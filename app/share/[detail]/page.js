'use client'

import {useEffect} from "react";
import Loading from "@/components/loading";
import {useRouter} from "next/navigation";
import * as dataStateAction from "@/store/modules/data";
import {useDispatch} from "react-redux";

export default function Page(props){
    const router = useRouter();
    const dispatch = useDispatch();

    const initData = ()=>{
        const datas = require('/public/data/data.json')
        datas.map((e)=>{
            if(e.id==props.params.detail){
                dispatch(dataStateAction.setCurDetail({curDetail:Object.values(e)}))
            }
        })
        router.push('/')
    }
    useEffect(()=>{
        initData();
    },[])

    return(
        <div>
            <Loading/>
        </div>
    )
}
