import Map from "@/components/Map";
import DetailSection from "@/components/DetailSection";

export default function Home(){
  return(
    <main
          style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
          }}
      >

        <Map/>
        <DetailSection/>
    </main>
  )
}
