import axios from "axios";
import { API_V, SHIPPING_INFORMATIONS } from "../../utils/constants";
import { AppUtils } from "../../utils/app.utils";
import { IShippingInfo, IShippingInformationModel } from "../../models/ShippingInformation.model";

const NEXT_SHIPPING_INFORMATIONS_API = `${process.env.NEXT_PUBLIC_BASEURL}${API_V}${SHIPPING_INFORMATIONS}`;

class ShippingService {
  async getShippingList(userId: number) {
    try {
      const response = await axios.get(
        `${NEXT_SHIPPING_INFORMATIONS_API}/${userId}`
      );
      return response.data.data[0];
    } catch (error: any) {
      console.log(error);
      if (error.response.status !== 404) {
        AppUtils.toastNotification(
          "OOPS! An error occured retrieving shipping list!",
          false
        );
      }
    }
  }

  async editShippingAddress(
    listID: number,
    siNewData: { data: IShippingInformationModel }
  ) {
    // used for set primary / edit / delete address
    try {
      await axios
        .post(`${NEXT_SHIPPING_INFORMATIONS_API}/${listID}`, siNewData)
        .then(() => {
          AppUtils.toastNotification("Adresa a fost modificata cu succes!", true);
        });
    } catch (error) {
      console.log(error);
      AppUtils.toastNotification("OOPS! An error occured while deleting the address!", false);
    }
  }

  async addShippingInfo(newData: IShippingInfo, userId: number) {
    try {
      // prepare the date for server
      const payload = {
        data: {
          shipping_info_list: [newData],
          user_id: userId
        }
      };

      const response = await axios.post(`${NEXT_SHIPPING_INFORMATIONS_API}/${userId}`, payload)
      AppUtils.toastNotification("An address has been changed successfully!", true);
      return response.data;
    } catch (error) {
      console.log(error);
      AppUtils.toastNotification("OOPS! An error occurred while saving the address!", false);
    }
  }
}

export default new ShippingService();
