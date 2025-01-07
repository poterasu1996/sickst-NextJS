import { TabPanel, TabView } from "primereact/tabview";
import { useContext, useEffect, useState } from "react";
import { AppUtils } from "../../shared/utils/app.utils";
import AccountContext from "../../store/account-context";
import Chip from "../global/Chip";
import { useRouter } from "next/router";
import { TxnStatusEnum } from "../../shared/enums/txn.enum";
import { IGETOrderHistory } from "../../models/OrderHistory.model";
import { IGETSubscriptionOrder, SubscriptionStatusEnum } from "../../models/SubscriptionOrder.model";
import orderService from "../../shared/services/orderService";
import subscriptionService from "../../shared/services/subscriptionService";

const OrderHistory = () => {
    const accountManager = useContext(AccountContext);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [orderHistory, setOrderHistory] = useState<IGETOrderHistory[] | null>(null);
    const [subscriptionHistory, setSubscriptionHistory] = useState<IGETSubscriptionOrder[] | null>(null);
    const [tableContent, setTableContent] = useState<(IGETOrderHistory | IGETSubscriptionOrder)[] | null>(null);
    const router = useRouter();

    async function fetchOrderHistory(userId: number) {
        return await orderService.getOrderHistory(userId);
    }

    async function fetchSubscriptionOrderHistory(userId: number) {
        return await subscriptionService.getSubscriptionHistory(userId);
    }
    // we no longer have payment and subscription in same table
    // we have payment / collection AND subscription separate
    useEffect(() => {
        if(accountManager!.currentUser) {
            const userId = accountManager!.currentUser.id;
            fetchOrderHistory(userId).then((resp: IGETOrderHistory[]) => {
                if(resp.length > 0) {
                    setOrderHistory([...resp])
                } 
            });
            
            fetchSubscriptionOrderHistory(userId).then((resp: IGETSubscriptionOrder[]) => {
                if(resp.length > 0) {
                    setSubscriptionHistory(resp.reverse())
                } 
            })
        }
    }, [accountManager!.currentUser])

    useEffect(() => {}, [accountManager!.refresh])

    useEffect(() => {
        if(orderHistory && subscriptionHistory) {
            setTableContent([...orderHistory, ...subscriptionHistory])
        } else if(orderHistory) {
            setTableContent(orderHistory);
        } else {
            setTableContent(subscriptionHistory);
        } 
    }, [orderHistory, subscriptionHistory])

    function isSubscription(data: IGETSubscriptionOrder | IGETOrderHistory): data is IGETSubscriptionOrder {
        return (data as IGETSubscriptionOrder).attributes.subscription_name !== undefined;
    }

    function allOrders() {
        if(orderHistory && subscriptionHistory) {
            setTableContent([...orderHistory, ...subscriptionHistory])
        } else if(orderHistory) {
            setTableContent(orderHistory);
        } else {
            setTableContent(subscriptionHistory);
        } 
    }

    function filterSubscriptions() {
        if(subscriptionHistory) {
            setTableContent(subscriptionHistory);
        } else {
            setTableContent(null);
        }
    }

    function filterOrders() {
        if(orderHistory) {
            setTableContent(orderHistory);
        } else {
            setTableContent(null);
        }
    }

    return (
        <>
            <div className="order-history">
                <div className="title">Order history</div> 
                <div className="table-content">
                    <TabView className="filtertabs" activeIndex={activeIndex} onTabChange={(e) => {
                        setActiveIndex(e.index);
                        e.index === 1 
                            ? filterSubscriptions() 
                            : e.index === 2
                                ? filterOrders()
                                : allOrders()
                    }}>
                        <TabPanel header="All Orders">
                            {tableContent ? (
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Date</th>
                                            <th>Payment</th>
                                            <th>Status</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {tableContent.map(el => (
                                        // check if subscription
                                        isSubscription(el) 
                                        ? <tr key={el.id}>
                                            <td>#{el.id}</td>
                                            <td>{AppUtils.isoToFormat(el.attributes.createdAt)}</td>
                                            <td>Abonament - {AppUtils.capitalize(el.attributes.subscription_name)}</td>
                                            <td>{el.attributes.subscription_status === SubscriptionStatusEnum.ACTIVE
                                                ? <Chip status="success" label="Activa"/>
                                                : el.attributes.subscription_status === SubscriptionStatusEnum.PAUSED
                                                    ? <Chip status="pending" label="Paused"/>
                                                    : <Chip status="cancel" label="Cancelled"/>}
                                            </td>
                                            <td>{el.attributes.subscription_price} RON</td>
                                        </tr>
                                        : <tr key={el.id}>
                                            <td>#{el.id}</td>
                                            <td>{AppUtils.isoToFormat(el.attributes.createdAt)}</td>
                                            <td>{AppUtils.capitalize(el.attributes.order_type)}</td>
                                            <td>{el.attributes.txn_status === TxnStatusEnum.SUCCESS 
                                                ? <Chip status="success" label="Success"/>
                                                : el.attributes.txn_status === TxnStatusEnum.PENDING
                                                    ? <Chip status="pending" label="Pending"/>
                                                    : el.attributes.txn_status === TxnStatusEnum.FAILED
                                                        ? <Chip status="failed" label="Failed"/>
                                                        : <Chip status="cancel" label="Cancelled"/>}
                                            </td>
                                            <td>{el.attributes.total} RON</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="no-orders">
                                    <div className="title">No order history yet!</div>
                                    <div className="text">Activate your subscription and add to queue -- you'll be able to see past orders here</div>
                                </div>
                            )}
                        </TabPanel>
                        <TabPanel header="Subscriptions" >
                            {tableContent ? (
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Date</th>
                                            <th>Payment</th>
                                            <th>Status</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {tableContent.map(el => (
                                        isSubscription(el) && <tr key={el.id}>
                                            <td>#{el.id}</td>
                                            <td>{AppUtils.isoToFormat(el.attributes.createdAt)}</td>
                                            <td>{AppUtils.capitalize(el.attributes.subscription_name)}</td>
                                            <td>{el.attributes.subscription_status === SubscriptionStatusEnum.ACTIVE
                                                ? <Chip status="success" label="Activa"/>
                                                : el.attributes.subscription_status === SubscriptionStatusEnum.PAUSED
                                                    ? <Chip status="pending" label="Paused"/>
                                                    : <Chip status="cancel" label="Cancelled"/>}
                                            </td>
                                            <td>{el.attributes.subscription_price} RON</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="no-orders">
                                    <div className="title">No order history yet!</div>
                                    <div className="text">Activate your subscription and add to queue -- you'll be able to see past orders here</div>
                                </div>
                            )}
                        </TabPanel>
                        <TabPanel header="Orders">
                            {(tableContent && tableContent.length > 0) ? (
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Date</th>
                                            <th>Payment</th>
                                            <th>Status plata</th>
                                            <th>Status comanda</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {tableContent.map(el => (
                                        !isSubscription(el) && <tr key={el.id} onClick={() => router.push(`/account/order/${el.id}`)}>
                                            <td>#{el.id}</td>
                                            <td>{AppUtils.isoToFormat(el.attributes.createdAt)}</td>
                                            <td>{AppUtils.capitalize(el.attributes.order_type)}</td>
                                            <td>{el.attributes.txn_status === TxnStatusEnum.SUCCESS 
                                                ? <Chip status="success" label="Success"/>
                                                : el.attributes.txn_status === TxnStatusEnum.PENDING
                                                    ? <Chip status="pending" label="Pending"/>
                                                    : el.attributes.txn_status === TxnStatusEnum.FAILED
                                                        ? <Chip status="failed" label="Failed"/>
                                                        : <Chip status="cancel" label="Cancelled"/>}
                                            </td>
                                            <td>{el.attributes.is_cancelled
                                                ? <Chip status="cancel" label="Anulata"/>    
                                                : <Chip status="success" label="Activa"/>
                                            }</td>
                                            <td>{el.attributes.total} RON</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="no-orders">
                                    <div className="title">No order history yet!</div>
                                    <div className="text">Activate your subscription and add to queue -- you'll be able to see past orders here</div>
                                </div>
                            )}
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </>
    );
}

export default OrderHistory;