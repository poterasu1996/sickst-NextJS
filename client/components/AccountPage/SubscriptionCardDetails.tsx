import Link from "next/link";
import { useState } from "react";
import { Check, Slash } from "react-feather";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { AppUtils } from "../../shared/utils/app.utils";
import image1 from '../../public/img/mystery.jpg';
import ILocalUserInfo from "../../types/account/LocalUserInfo.interface";
import { IGETSubscriptionOrder, SubscriptionStatusEnum } from "../../models/SubscriptionOrder.model";

type Props = {
    userInfo: ILocalUserInfo,
    userSubscription: IGETSubscriptionOrder[],
}
const SubscriptionCardDetails = ({ userInfo, userSubscription }: Props) => {
    const [showCancelPlan, setCancelPlan] = useState<boolean>(false);
    let activeSubscription: IGETSubscriptionOrder | undefined = undefined;
    if(userSubscription) {
        activeSubscription = userSubscription
            .reverse().find((subs: IGETSubscriptionOrder) => subs.attributes.subscription_status === SubscriptionStatusEnum.ACTIVE);
    }

    let nextBillingDate = null;
    if(activeSubscription?.attributes.last_payment_date) {
        const nextBillingMonth = AppUtils.getNextBillingDate(activeSubscription.attributes.last_payment_date);
        nextBillingDate = AppUtils.isoToFormat(nextBillingMonth);
    } else {
        nextBillingDate = ' - ';
    }
    
    const handleCloseModal = () => {
        setCancelPlan(!showCancelPlan);
    }

    const handleCancelSubscription = () => {
        // aici trebuie facuta un POST catre cancelled_subscription, cu id-ul sesiunii
        // si va trebui ca manual sa fac cancel
    }

    return(<>
        <div className="subscriber-banner">
            {activeSubscription ?
                    <>
                        <div className="title">Current Plan</div>
                        <div className="banner-content">
                            <div className="subscription-type">
                                <div className="type">
                                    {AppUtils.capitalize(activeSubscription.attributes.subscription_name)}
                                    <div className="tag">{activeSubscription.attributes.subscription_price} Lei / luna</div>
                                </div>
                                <div className="banner-buttons">
                                    <button className="button-second" onClick={() => setCancelPlan(!showCancelPlan)}>Dezabonare</button>
                                </div>
                            </div>  
                            <div className="status-wrapper">
                                Status
                                <p className="status">
                                    <span className="active"><Check color="white" strokeWidth={4} size={'14px'} /></span>
                                    Active
                                </p>
                            </div>
                            <div className="text">
                                Member since <b>{AppUtils.isoToFormat(activeSubscription.attributes.createdAt)}</b>
                            </div>
                            {(userInfo.subscribed) && <div className="text">
                                Next Billing period on <b>{nextBillingDate}</b>
                            </div>}
                        </div>
                    </>
                : <>
                    <div className="title">Current Plan</div>
                    <div className="banner-content">
                            <div className="subscription-type">
                                <div className="type">
                                    No Plan Selected
                                </div>
                                <div className="banner-buttons">
                                    <Link href='/subscriptions'>
                                        <a className="button-second">Upgrade plan</a>
                                    </Link>
                                </div>
                            </div>  
                            <div className="status-wrapper">
                                Status
                                <p className="status">
                                    <span className="cancelled">
                                        <Slash color="#cc3633" strokeWidth={3} size={'20px'} />
                                    </span>
                                    Cancelled
                                </p>
                            </div>
                            <div className="text">
                                Member since <b>{AppUtils.isoToFormat(userInfo.createdAt)}</b>
                            </div>
                    </div>
                </>
            }
        </div>

        {/* modals */}
        <Modal
            className="subscription-modal"
            centered={true}
            size="xl"
            isOpen={showCancelPlan}
            toggle={() => setCancelPlan(!showCancelPlan)}
        >
            <ModalBody>
                <div className="cancel-modal">
                    <div className="offer-content">
                        <div className="title">Se termina asa brusc?</div>
                        <div className="text">Esti sigur ca vrei sa renunti complet?</div>
                        <div className="text">Sunt numeroase beneficii daca ramai abonat, de la a afla primul cand apare un produs nou pana la mega reduceri de ziua ta!</div>
                        <div className="offer">
                            <div className="offer--card">
                                <div className="img-wrapper">
                                    <img src={image1.src} />
                                </div>
                                <div className="card-title">Ultimele aparitii</div>
                                <div className="card-text">Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
                                Harum voluptatem assumenda molestiae quibusdam enim, porro doloremque, alias esse 
                                accusantium, nemo dignissimos beatae blanditiis maxime sit dolor recusandae placeat! Fugiat, facere.</div>
                            </div>
                            <div className="offer--card">
                                <div className="img-wrapper">
                                    <img src={image1.src} />
                                </div>
                                <div className="card-title">Ultimele aparitii</div>
                                <div className="card-text">Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
                                Harum voluptatem assumenda molestiae quibusdam enim, porro doloremque, alias esse 
                                accusantium, nemo dignissimos beatae blanditiis maxime sit dolor recusandae placeat! Fugiat, facere.</div>
                            </div>
                        </div>
                    </div>
                    <div className="unsubscribe-form">
                        <div className="title">Dezabonare</div>
                        <div className="text">Ne pare rau ca drumurile noastre se despart aici! Feedback-ul tau ne ajuta sa ne imbunatatim serviciile!</div>
                        <div className="text">Daca vrei sa renunti si la newsletter, bifeaza casuta de mai jos</div>
                        <div className="button-wrapper">
                            <button className="button-second" onClick={handleCloseModal}>Cancel</button>
                            <button className="button-primary" onClick={handleCancelSubscription}>Dezabonare</button>
                            {/* de trecut linkul in .env */}
                            {/* <Link href={'https://billing.stripe.com/p/login/test_eVa5kJ5yo4S82nC288'} >
                                <a className="button-primary">Dezabonare</a>
                            </Link> */}
                        </div>
                    </div>
                </div>
            </ModalBody>
        </Modal>

    </>)
}

export default SubscriptionCardDetails;
