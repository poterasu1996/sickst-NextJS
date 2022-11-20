import Image from "next/image";
import step1 from '../../public/img/man_perfume.jpg'
import step2 from '../../public/img/clive-christian-hedonistic-jump-up-and-kiss-me.jpg'
import step3 from '../../public/img/fougere-fragrance-family-Clive-Christian-Perfumes-1555x1100.jpg'

const SubsInfo = () => {
    return <div className="container subs-info">
        <div className="row title">
            <span>Cum functioneaza:</span>
        </div>
        <div className="row subs-cards">
            {/* card */}
            <div className="col-12 col-md-4">
                <div className="card">
                    <div className="card-info">
                        <div className="card-img">
                            <img src={step1.src}></img>
                        </div>
                        <div className="title">1. Alege parfumul</div>
                        <div className="subtitle">Alege parfumul preferat de la producatori de top - vei avea acces la intregul catalog.</div>
                    </div>
                </div>
            </div>
            <div className="col-12 col-md-4">
                <div className="card">
                    <div className="card-info">
                        <div className="card-img">
                            <img src={step2.src}></img>
                        </div>
                        <div className="title">2. Alege subscriptia</div>
                        <div className="subtitle">Cu un design atragator si subtil, sticlutele de 8ml sunt concepute sa-ti ajunga toata luna, pana la urmatoarea comanda.</div>
                    </div>
                </div>
            </div>
            <div className="col-12 col-md-4">
                <div className="card">
                    <div className="card-info">
                        <div className="card-img">
                            <img src={step3.src}></img>
                        </div>
                        <div className="title">3. Livram parfumul</div>
                        <div className="subtitle">Lunar ver primi acasa o noua sticluta de 8ml. Poti anula abonamentul oricand.</div>
                    </div>
                </div>
            </div>

        </div>
    </div>
}

export default SubsInfo;