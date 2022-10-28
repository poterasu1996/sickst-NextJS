import React from 'react'
import Link from 'next/link'
import cardImg1 from '../../public/img/mystery.jpg'

function Subscriptions() {
  return (
    <div className='subscription-page container'>
        <div className='subscription-page--description'>
            <div className='title'>Ce vei primi...</div>
            <div className='info'>
                Un abonament catre Sickst. Se plateste lunar, se reinoieste automat, iar produsele se livreaza bilunar, la mijlocul si la sfarsitul fiecarei luni.
            </div>
        </div>
        <div className='row black-cards'>
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
    </div>
  )
}

export default Subscriptions