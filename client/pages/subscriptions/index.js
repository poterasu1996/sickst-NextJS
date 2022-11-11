import React from 'react'
import Link from 'next/link'
import cardImg1 from '../../public/img/mystery.jpg'
import shield from '../../public/img/svg/shield.svg'
import stripe1 from '../../public/img/svg/Stripe-Badge-Logo.svg'
import stripe2 from '../../public/img/svg/Stripe-Outline-Logo.svg'

function Subscriptions() {
  return (
    <div className='subscription-page'>
        <div className='container subscription-page--description'>
            <div className='title'>Ce vei primi...</div>
            <div className='info'>
                Un abonament catre Sickst. Se plateste lunar, se reinoieste automat, iar produsele se livreaza bilunar, la mijlocul si la sfarsitul fiecarei luni.
            </div>
        </div>
        <div className='container black-cards'>
            <div className='col-4 card'>
                <div className='card-image'>
                    <img src={cardImg1.src} />
                </div>
                <div className='card-content'>
                    <div className='title'>Mystery</div>
                    <div className='description'>
                        <ul>
                            <li>lunar vrei primi un model nou de parfum</li>
                        </ul>
                    </div>
                    <Link href="#">
                        <a className='button-second my-5'>Subscribe for 55 RON</a>
                    </Link>
                </div>
            </div>
            <div className='col-4 card'>
                <div className='card-image'>
                    <img src={cardImg1.src} />
                </div>
                <div className='card-content'>
                    <div className='title'>Basic</div>
                    <div className='description'>
                        <ul>
                            <li>poti alege dintr-o lista larga de produse</li>
                            <li>poti alege pana la maxim 6 produse, planificand in prealabil pentru lunile viitoare</li>
                        </ul>
                    </div>
                    <Link href="#">
                        <a className='button-second my-5'>Subscribe for 65 RON</a>
                    </Link>
                </div>
            </div>
            <div className='col-4 card'>
                <div className='card-image'>
                    <img src={cardImg1.src} />
                </div>
                <div className='card-content'>
                    <div className='title'>Premium</div>
                    <div className='description'>
                        <ul>
                            <li>BASIC +</li>
                            <li>livrare gratuita</li>
                            <li>ai acces la intreg catalogul de produse</li>
                        </ul>
                    </div>
                    <Link href="#">
                        <a className='button-second my-5'>Subscribe for 100 RON</a>
                    </Link>
                </div>
            </div>
        </div>
        <div className='container security-info'>
            <div className='safe-checkout'>
                <div className='title'>Guaranteed Safe Checkout</div>
                <div className='d-inline-flex justify-content-center'>
                    <img style={{width: '150px', height: '10rem'}} src={stripe1.src} />
                    <img style={{margin: '0 1rem'}} src={shield.src} />
                    <img style={{width: '150px', height: '10rem'}} src={stripe2.src} />
                </div>
            </div>
            <div className='disclaimer'>
                *By clicking “Pay”, you agree that your subscription will automatically renew every month until you cancel. 
                After your initial one month charge of $8.47, your subscription will automatically renew every month at $16.95. 
                The amount of each subsequent charge may change. Before any such charge is changed, you will be provided notice. 
                If you want to cancel your subscription, you may do so by sending an e-mail to <b>office@sickst.com</b>. 
                Before each renewal, we will send a reminder with the term and rate then in effect. If you do nothing,
                we will charge the payment method you selected.
            </div>
        </div>
    </div>
  )
}

export default Subscriptions