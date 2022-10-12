import { TabPanel, TabView } from "primereact/tabview";


const OrderHistory = () => {
    return (
        <>
            <div className="order-history">
                <div className="title">Order history</div> 
                <div className="table-content">
                    <TabView className="filtertabs">
                        <TabPanel header="All Orders">
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
                                    <tr>
                                        <td>#1</td>
                                        <td>19-Sep-2020</td>
                                        <td>Subscription</td>
                                        <td>Active</td>
                                        <td>100 RON</td>
                                    </tr>
                                    <tr>
                                        <td>#2</td>
                                        <td>20-Sep-2021</td>
                                        <td>Payment</td>
                                        <td>Successfull</td>
                                        <td>250 RON</td>
                                    </tr>
                                    <tr>
                                        <td>#3</td>
                                        <td>20-Sep-2022</td>
                                        <td>Payment</td>
                                        <td>Successfull</td>
                                        <td>250 RON</td>
                                    </tr>
                                    <tr>
                                        <td>#4</td>
                                        <td>20-Sep-2022</td>
                                        <td>Payment</td>
                                        <td><span className="cancelled">Cancelled</span></td>
                                        <td>250 RON</td>
                                    </tr>
                                    <tr>
                                        <td>#5</td>
                                        <td>20-Sep-2022</td>
                                        <td>Payment</td>
                                        <td>Successfull</td>
                                        <td>250 RON</td>
                                    </tr>
                                </tbody>
                            </table>
                        </TabPanel>
                        <TabPanel header="Completed"></TabPanel>
                        <TabPanel header="Cancelled"></TabPanel>
                    </TabView>
                </div>
            </div>
        </>
    );
}

export default OrderHistory;