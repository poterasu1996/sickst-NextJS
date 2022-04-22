import Head from 'next/head'
import Banner from '../components/HomePage/Banner'
import BannerBottom from '../components/HomePage/BannerBottom'
import Brands from '../components/HomePage/Brands'
import ProductSection from '../components/HomePage/ProductSection'
import Subscriptions from '../components/HomePage/Subscriptions'
import SubsInfo from '../components/HomePage/SubsInfo'

export default function Home() {
  return (
    <div className='main-content'>
      <Head>
        <title>Sickst - Bucharest</title>
        <meta name="keywords" content='Parfumme E-commerce'/>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous"></link>
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet"></link>
      </Head>
      
      <Banner />
      <div className='main-body'>
        <SubsInfo />
        <Brands />
        <Subscriptions />
        <ProductSection />
        <BannerBottom />
      </div>
    </div>
  )
}
