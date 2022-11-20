import Banner from '../components/HomePage/Banner'
import BannerBottom from '../components/HomePage/BannerBottom'
import Brands from '../components/HomePage/Brands'
import ProductSection from '../components/HomePage/ProductSection'
import Subscriptions from '../components/HomePage/Subscriptions'
import SubsInfo from '../components/HomePage/SubsInfo'

export default function Home() {
  return (
    <div className='main-content'>
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
