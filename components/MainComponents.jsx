import Header from "@/components/Header";

export default function MainComponents({searchAction,searchWord}){
    return(
        <>
            <Header
                searchAction={searchAction}
                searchWord={searchWord}
            />
        </>
    )
}