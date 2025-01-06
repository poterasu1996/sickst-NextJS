import logo from "../../../public/logo.svg";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
// import axios from "../../../api/axios";
import axios from "axios";
import { IGETOrderHistory } from "../../../models/OrderHistory.model";
import { AppUtils } from "../../../shared/utils/app.utils";
import { IOHProduct } from "../../../models/OrderHistory.model";
import { Table } from 'react-bootstrap';
import { useContext, useState } from "react";
import AccountContext from "../../../store/account-context";
import { useRouter } from "next/router";
import { ICompanyDetail, ICompanyDetailModel } from "../../../models/CompanyDetail.model";
import { Modal, ModalBody } from "reactstrap";
import orderService from "../../../shared/services/orderService";

interface Props {
    order: IGETOrderHistory | null,
    companyDet: ICompanyDetail | null,
}

interface TableContent {
    id: number,
    product: string,
    quantity: number,
    price: number,
    total: number,
}

interface ColumnMeta {
    header: string,
    field: string,
}

const OrderId = ({ order, companyDet }: Props) => {
    const router = useRouter();
    const accountManager = useContext(AccountContext);
    const [showCancelOrder, setShowCancelOrder] = useState<boolean>(false);
    const columns: ColumnMeta[] = [
        {field: 'id', header: 'Nr. Crt'},
        {field: 'product', header: 'Denumire produs/abonament'},
        {field: 'quantity', header: 'Cant.'},
        {field: 'price', header: 'Pret unit.'},
        {field: 'total', header: 'Total'},
    ]
    const tableContent: TableContent[] | undefined = order?.attributes.product_list!.map((product: IOHProduct) => {
        return {
            id: product.product_id,
            product: product.brand + " " + product.model,
            quantity: product.quantity,
            price: product.price,
            total: product.quantity * product.price
        }
    })

    function handlePrint() {
        window.print();
    }

    function handleCancelOrder() {
        if (!order) return;
        orderService.cancelOrder(order.id, order)
            .then(() => router.replace(router.asPath));
        setShowCancelOrder(false);
    }
    
    return (<>
        <div className="layout order-content">
            <div className="container">
                <div className="row">
                    {!order
                        ? <h3 className="text-center mt-5 fw-bold">Din pacate aceasta comanda nu a fost gasita!</h3>
                        : <>
                            <div className="col-lg-8 col-xl-9 col-12">
                                <div className="order-card">
                                    <div className="order-card--text">
                                        <div className="mx-3 my-3">
                                            <img className="logo mb-5" src={logo.src} />
                                            {companyDet && <>
                                                <p style={{textTransform: "uppercase", fontWeight: "bold"}}>{companyDet.attributes.name}</p>
                                                <p>CIF: {companyDet.attributes.cif}</p>
                                                <p>Reg. com.: {companyDet.attributes.reg_com}</p>
                                                <p>Adresa: {companyDet.attributes.address}</p>
                                                <p>IBAN: {companyDet.attributes.iban}</p>
                                                <p>Banca: {companyDet.attributes.bank}</p>
                                            </>}
                                        </div>
                                        <div className="mx-3 my-3">
                                            {order && <>
                                                <h3 className="mb-5"><b>Order #{order.id}</b></h3>
                                                <p>Order Date: {AppUtils.isoToFormat(order.attributes.createdAt)}</p>
                                            </>}
                                        </div>
                                    </div>
                                    <hr className="divider"></hr>
                                    <div className="order-card--text">
                                        <div className="mx-3 my-3">
                                            <p className="my-4"><b>Invoice to:</b></p>
                                            <p className="mb-1">Poterasu Ionut</p>
                                            <p className="mb-1">Alexandru cel Bun nr. 2</p>
                                        </div>
                                    </div>
                                    <Table>
                                        <thead>
                                            <tr>
                                                {columns.map((col, i) => (
                                                    <th key={i} className={(i!== 0 && i!== 1) ? 'text-center' : ''}>{col.header}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tableContent?.map((el: TableContent, i) => (
                                                <tr key={i}>
                                                    <td>{el.id}</td>
                                                    <td>{el.product}</td>
                                                    <td className="text-center">{el.quantity}</td>
                                                    <td className="text-center">{el.price}</td>
                                                    <td className="text-center">{el.total}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                    <div className="order-card--text">
                                        <div className="mx-3 my-3">
                                            <p className="my-4"><b>Invoice to:</b></p>
                                            <p className="mb-1">Poterasu Ionut</p>
                                            <p className="mb-1">Alexandru cel Bun nr. 2</p>
                                        </div>
                                        <div className="mx-3 my-3">
                                            <table style={{border: 'none'}}>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <p className="my-1 me-5">Subtotal:</p>
                                                            <p className="mb-1">Discount:</p>
                                                            <p className="mb-1">Transport:</p>
                                                            <p className="mb-1">Total:</p>
                                                        </td>
                                                        <td>
                                                            <p className="my-1"><b>Lei 140</b></p>
                                                            <p className="my-1"><b>Lei 0.00</b></p>
                                                            <p className="my-1"><b>Lei 15.00</b></p>
                                                            <p className="my-1"><b>Lei 155.00</b></p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-xl-3 col-12 print">
                                <div className="order-card">
                                    <div className="order-buttons">
                                        <button className="button-primary order-details-btn">Download</button>
                                        <button 
                                            className="button-primary order-details-btn"
                                            onClick={() => handlePrint()}
                                        >Print</button>
                                        <button 
                                            className="button-second order-details-btn"
                                            disabled={order?.attributes.is_cancelled}
                                            onClick={() => setShowCancelOrder(true)}
                                        >{order?.attributes.is_cancelled ? "Anulata" : "Anulare"}</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    }

                </div>
            </div>
        </div>

        <Modal
            centered={true}
            size="xl"
            isOpen={showCancelOrder}
            toggle={() => setShowCancelOrder(false)}
            className="subscription-modal"
        >
            <ModalBody>
                <div className="title">Anulare comanda</div>
                <div className="text">Esti sigur ca doresti sa anulezi comanda?</div>
                <div className="button-wrapper">
                    <button className="button-second" onClick={() => setShowCancelOrder(!showCancelOrder)}>Cancel</button>
                    <button className="button-primary" onClick={() => handleCancelOrder()}>Anulare</button>
                </div>
            </ModalBody>
        </Modal>
    </>)
}

export default OrderId;

const COMPANY_DETAILS = `${process.env.NEXT_PUBLIC_STRAPI_APIURL}/company-details`;
const ORDER_HISTORIES = `${process.env.NEXT_PUBLIC_STRAPI_APIURL}/order-histories`;

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const { params } = context;
    const id = params?.id;
    const cookies = context.req.cookies; 
    const jwt = cookies.jwt;

    let order: IGETOrderHistory | null = null;
    let companyDet: ICompanyDetail | null = null;
    if(jwt) {
        const header = {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        };
        try {
            const orderResponse = await axios.get(`${ORDER_HISTORIES}/${id}`, header)
            order = orderResponse.data.data;

            const compDetResponse = await axios.get(COMPANY_DETAILS, header);
            companyDet = compDetResponse.data.data[0] ?? null
        } catch (error) {
            console.log(error)
        }
    }

    return {
        props: {
            order,
            companyDet
        }
    }
}