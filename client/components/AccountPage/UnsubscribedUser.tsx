import React from 'react'
import subscriptionBanner from '../../public/img/subscribe-banner.jpg';
import Link from "next/link";
import { Check, PieChart } from 'react-feather';

const UnsubscribedUser = () => {
  return (<>
    <div className='unsubscriber'>
        <div className="unsubscriber--banner card">
            {/* <img src={subscriptionBanner.src} /> */}
            <div className='header'>Join over 10.000 fragrance fanatics.</div>
            <div className="title">Discover a new scent next month, and the month after that, and the month after that</div>
            <div className="text">Over 600 fragrances (and counting) are waiting for you.</div>
            <div className="text">Check the subscription plans and see what suits you best!</div>
            <Link href="/subscriptions">
                <a className="button-second">Check subscription plans</a>
            </Link>
            <div className='axe'>
                <div className='benefit'>Fast <br/>Shipping <i className='pi pi-stopwatch' style={{'fontSize': '2.2rem', 'color': '#cc3633'}} /></div>
                <div className='benefit'>Cancel <br/>anytime <i className='pi pi-calendar-times' style={{'fontSize': '2.2rem', 'color': '#cc3633'}} /></div>
                <div className='benefit'>Flexible <br/>plans <i className='pi pi-sliders-h' style={{'fontSize': '2.2rem', 'color': '#cc3633'}} /></div>
                <div className='benefit'>Top <br/>fragrances <i className='pi pi-verified' style={{'fontSize': '2.2rem', 'color': '#cc3633'}} /></div>
            </div>
        </div>
        <div className="benefits">
            <div className="title">Your benefits:</div>
            <ul>
                <li><Check stroke={"#cc3633"}/> Over <span className="brand-color">600 fragrances</span> to choose from, straight from the source</li>
                <li><Check stroke={"#cc3633"}/> Get personal recommendations based on scents you love</li>
                <li><Check stroke={"#cc3633"}/> <span className="brand-color">Flexible membership plans</span> that cater to your lifestyle</li>
            </ul>
        </div>
    </div>
  </>
  )
}

export default UnsubscribedUser;