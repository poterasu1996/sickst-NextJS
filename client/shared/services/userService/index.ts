import axios from "axios";
import strapiAxios from "../../../api/axios";
import { IUserModel } from "../../../models/User.model";
import { IGETUserDetails, IUserDetailsModel } from "../../../models/UserDetails.model";
import { USER_PROFILE_DETAILS, USER_ME, API_V } from "../../utils/constants";

const NEXT_USERS_ME_API = `${process.env.NEXT_PUBLIC_BASEURL}${API_V}${USER_ME}`;
const NEXT_USER_PROFILE_DETAILS_API = `${process.env.NEXT_PUBLIC_BASEURL}${API_V}${USER_PROFILE_DETAILS}`;

class UserService {
  async getUsersMe() {
    const response: IUserModel = await axios.get(NEXT_USERS_ME_API).then(res => res.data);
    return response;
  }

  async getUserDetailsID() {
    // user profile-details id
    const response = await this.getUsersMe();
    const uID = response.id;

    const uDetails: IGETUserDetails = await axios.get(`${NEXT_USER_PROFILE_DETAILS_API}/${uID}`).then(res => res.data.data[0]);
    return uDetails.id;
  }

  async getUserDetails(userId: number) {
    const response = await axios.get(`${NEXT_USER_PROFILE_DETAILS_API}/${userId}`);
    return response.data;
  }

  async updateUserDetails(userId:number, data: IUserDetailsModel) {
    const response = await axios.put(`${NEXT_USER_PROFILE_DETAILS_API}/${userId}`, data)
    return response.data;
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
    await strapiAxios
      .put(`${USER_PROFILE_DETAILS}/${userDetailsID}`, { data: { ...data } }, header)
      .then((resp) => true)
      .catch((error) => false);
  }

  // async cancelUserSubscription(header: any, userDetailsID: number | string) {
  //   const data = {
  //     subscribed: false,
  //     subscription_name: null,
  //   };
  //   await strapiAxios
  //     .put(`${USER_PROFILE_DETAILS}/${userDetailsID}`, { data: { ...data } }, header)
  //     .then((resp) => true)
  //     .catch((error) => false);
  // }
}

export default new UserService();
