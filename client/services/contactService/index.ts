import axios from "axios";
import { AppUtils } from "../../utils/app.utils";
import { API_V, CONTACTS } from "../../utils/constants";

const NEXT_CONTACT_US_API = `${process.env.NEXT_PUBLIC_BASEURL}${API_V}${CONTACTS}`

class ContactService {
    async postContactUs(data: any) {
        console.log('DATA IN SERVICE', data)
        try {
            const response = await axios.post(`${NEXT_CONTACT_US_API}`, data)
            return response.data;
        } catch (error) {
            AppUtils.toastNotification("OOPS! An error occured while submitting your request to contact form!", false);
        }
    }
}

export default new ContactService();