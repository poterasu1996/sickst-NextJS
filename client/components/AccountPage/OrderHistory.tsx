import { TabPanel, TabView } from "primereact/tabview";
import { useContext, useEffect, useState } from "react";
import AccountContext from "../../store/account-context";

import IOrderHystoryList from "../../types/OrderHystory.interface";

const OrderHistory = () => {
    const accountManager = useContext(AccountContext);
    const [orderHistory, setOrderHistory] = useState<IOrderHystoryList[] | null>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [tableContent, setTableContent] = useState<IOrderHystoryList[] | null>(null);

    useEffect(() => {
        if(accountManager!.currentUser) {
            accountManager!.fetchOrderHistory()
                .then(resp => {
                    resp.length > 0 
                        ? setOrderHistory([...resp])
                        :  setOrderHistory(null)
                })
                .catch(error => console.log("order history error: ", error));
        }
    }, [accountManager!.currentUser])

    const filterSubscriptions = () => {
        if(orderHistory) {
            const subList = orderHistory.filter(el => el.attributes.order_type === 'subscription');
            if(subList.length > 0) {
                setTableContent([...subList]);
            } else {
                setTableContent(null);
            }
        }
    }

    const filterOrders = () => {
        if(orderHistory) {
            const subList = orderHistory.filter(el => el.attributes.order_type === 'payment');
            if(subList.length > 0) {
                setTableContent([...subList]);
            } else {
                setTableContent(null);
            }
        }
    }

    

    return (
        <>
            <div className="order-history">
                <div className="title">Order history</div> 
                <div className="table-content">
                    <TabView className="filtertabs" activeIndex={activeIndex} onTabChange={(e) => {
                        setActiveIndex(e.index);
                        e.index === 1 ? filterSubscriptions() : filterOrders()
                    }}>
                        <TabPanel header="All Orders">
                            {orderHistory ? (
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
                                    {orderHistory.map(el => (
                                        <tr key={el.id}>
                                            <td>#{el.id}</td>
                                            <td>{el.attributes.createdAt}</td>
                                            <td>{el.attributes.order_type}</td>
                                            <td>{el.attributes.txn_status 
                                                ? <span>Successfull</span>
                                                : <span className="cancelled">Cancelled</span>}
                                            </td>
                                            <td>{el.attributes.total} RON</td>
                                        </tr>
                                    ))}
                                        {/* <tr>
                                            <td>#4</td>
                                            <td>20-Sep-2022</td>
                                            <td>Payment</td>
                                            <td><span className="cancelled">Cancelled</span></td>
                                            <td>250 RON</td>
                                        </tr> */}
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
                                        <tr key={el.id}>
                                            <td>#{el.id}</td>
                                            <td>{el.attributes.createdAt}</td>
                                            <td>{el.attributes.order_type}</td>
                                            <td>{el.attributes.txn_status 
                                                ? <span>Successfull</span>
                                                : <span className="cancelled">Cancelled</span>}
                                            </td>
                                            <td>{el.attributes.total} RON</td>
                                        </tr>
                                    ))}
                                        {/* <tr>
                                            <td>#4</td>
                                            <td>20-Sep-2022</td>
                                            <td>Payment</td>
                                            <td><span className="cancelled">Cancelled</span></td>
                                            <td>250 RON</td>
                                        </tr> */}
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
                                        <tr key={el.id}>
                                            <td>#{el.id}</td>
                                            <td>{el.attributes.createdAt}</td>
                                            <td>{el.attributes.order_type}</td>
                                            <td>{el.attributes.txn_status 
                                                ? <span>Successfull</span>
                                                : <span className="cancelled">Cancelled</span>}
                                            </td>
                                            <td>{el.attributes.total} RON</td>
                                        </tr>
                                    ))}
                                        {/* <tr>
                                            <td>#4</td>
                                            <td>20-Sep-2022</td>
                                            <td>Payment</td>
                                            <td><span className="cancelled">Cancelled</span></td>
                                            <td>250 RON</td>
                                        </tr> */}
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