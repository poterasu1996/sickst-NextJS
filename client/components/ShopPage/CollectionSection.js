import Link from "next/link";
import cardImg1 from '../../public/img/mystery.jpg'

const CollectionSection = () => {
    return <>
        <div className="container collection-section">
            <div className="title">Sickst collection</div>
            <div className="description">Whether you're on that WFH grind or are dreaming of warmer climes, our curated fragrance collections are here to kick off 2021 on a scent-sational note.</div>
            <div className="row black-cards">
                {/* card */}
                <div className="col-4 card">
                    <div className="card-image">
                        {/* <Image src={cardImg1}/> */}
                        <img src={cardImg1.src}></img>
                    </div>
                    <div className="card-content">
                        <div className="title">Mystery</div>
                        <div className="description">Staying in your comfort zone is so 2021. Boldly go into the new year with these badass scents.</div>
                        {/* <a href="/" className="button-second my-5">Go to sickst.ro</a> */}
                        <Link href="/">
                            <a className="button-second my-5">Browse collection</a>
                        </Link>
                    </div>
                </div>

                <div className="col-4 card">
                    <div className="card-image">
                        {/* <Image src={cardImg1}/> */}
                        <img src={cardImg1.src}></img>
                    </div>
                    <div className="card-content">
                        <div className="title">Season</div>
                        <div className="description">Staying in your comfort zone is so 2021. Boldly go into the new year with these badass scents these badass scents.</div>
                        <Link href="/"><a className="button-second my-5">Browse collection</a></Link>
                    </div>
                </div>
                <div className="col-4 card">
                    <div className="card-image">
                        {/* <Image src={cardImg1}/> */}
                        <img src={cardImg1.src}></img>
                    </div>
                    <div className="card-content">
                        <div className="title">Sickst</div>
                        <div className="description">Staying in your comfort zone is so 2021. Boldly go into the new year with these badass scents.</div>
                        <Link href="/"><a className="button-second my-5">Browse collection</a></Link>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default CollectionSection;