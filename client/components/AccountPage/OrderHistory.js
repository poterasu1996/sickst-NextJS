

const OrderHistory = () => {
    return (
        <>
            <div className="order-history">
                <div className="title">Order history</div> 
                <div className="table-content">
                    <div className="table-filters">
                        <ul className="filter-list">
                            <li className="active">All Orders</li>
                            <li>Completed</li>
                            <li>Cancelled</li>
                        </ul>
                    </div>
                    <table class="table">
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
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default OrderHistory;