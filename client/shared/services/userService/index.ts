import axios from "../../../api/axios";
import { IUserModel } from "../../../models/User.model";
import { IGETUserDetails } from "../../../models/UserDetails.model";
import { USER_DETAILS, USER_ME } from "../../utils/constants";

class UserService {
  async getUserId(header: any) {
    // user id
    const userData: IUserModel = await axios
      .get(USER_ME, header)
      .then((resp) => resp.data);
    return userData.id;
  }

  async getUserDetailsID(header: any) {
    // user profile-details id
    const uID = await this.getUserId(header);

    const uDetails: IGETUserDetails = await axios
      .get(`${USER_DETAILS}?filters[user_id][$eq]=${uID}`, header)
      .then((resp) => resp.data.data[0]);
    return uDetails.id;
  }

  async updateUserSubscription(
    header: any,
    userDetailsID: number | string,
    subscriptionName?: string | null
  ) {
    const data = {
      subscribed: subscriptionName ? true : false,
      subscription_name: subscriptionName,
    };
    await axios
      .put(`${USER_DETAILS}/${userDetailsID}`, { data: { ...data } }, header)
      .then((resp) => true)
      .catch((error) => false);
  }

  // async cancelUserSubscription(header: any, userDetailsID: number | string) {
  //   const data = {
  //     subscribed: false,
  //     subscription_name: null,
  //   };
  //   await axios
  //     .put(`${USER_DETAILS}/${userDetailsID}`, { data: { ...data } }, header)
  //     .then((resp) => true)
  //     .catch((error) => false);
  // }
}

export default new UserService();
