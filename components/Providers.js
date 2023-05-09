'use client';

import {Provider} from "react-redux";
import {store} from "@/store";
import Script from "next/script";

export function Providers ({children}){
    return(
        <Provider store={store}>
            <div>
                <Script
                    type={'text/javascript'}
                    strategy={"beforeInteractive"}
                    src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_MAP_KEY}&submodules=geocoder`}
                />
            </div>
            {children}
        </Provider>
    )
}
