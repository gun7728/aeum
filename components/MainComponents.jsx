import Header from "@/components/Header";

export default function MainComponents({searchAction}){
    return(
        <>
            <Header
                searchAction={searchAction}
            />
        </>
    )
}
