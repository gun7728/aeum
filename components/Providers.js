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
                    src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_MAP_KEY}&libraries=services,clusterer&autoload=false`}
                />
            </div>
            {children}
        </Provider>
    )
}
