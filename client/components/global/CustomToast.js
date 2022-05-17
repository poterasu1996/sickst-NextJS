import { useEffect, useState } from "react";
import { useNotificationCenter } from "react-toastify/addons/use-notification-center";
import { ToastContainer, toast, TypeOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// interface Data {
//     exclude: boolean
// };

const CustomToast = ({ product, showToast }) => {
    const { notifications } = useNotificationCenter()
    
    
  return (
    <Toast show={showToast}>
        {/* <Toast.Header>
        
        <strong className="me-auto">Bootstrap</strong>
        <small>11 mins ago</small>
        </Toast.Header> */}
        <Toast.Body>
            <div className="toast-item">
                <div className="item-image">
                    <img src={`${process.env.NEXT_PUBLIC_STRAPI_ROOTURL}` + product.attributes.image.data[0].attributes.url}></img>
                </div>
                <div className="item-details">
                    <div className="title">{product.attributes.brand}</div>
                    <div className="subtitle">{product.attributes.model}</div>
                    <div className="added">was added to cart</div>
                </div>
            </div>
        </Toast.Body>
    </Toast>
  );
}

export default CustomToast;