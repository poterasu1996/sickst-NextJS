import ICartProduct from "../../../types/CartProduct.interface";
import { PaymentEnums } from "../../enums/payment.enums";

class CartService {

    

    subscriptionList(storageList: ICartProduct[] | null) {
        if(storageList) {
            const list = storageList.filter((item: ICartProduct) => {
              return item.payment === PaymentEnums.SUBSCRIPTION;
            })
            return list;
        }
        return null;
    }
}

export default new CartService();