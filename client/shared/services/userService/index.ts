import strapiAxios from "../../../api/axios";
import { IUserModel } from "../../../models/User.model";
import { IGETUserDetails, IUserDetailsModel } from "../../../models/UserDetails.model";
import { USER_PROFILE_DETAILS, USER_ME, API_V } from "../../utils/constants";
import { AppUtils } from "../../utils/app.utils";

const NEXT_USERS_ME_API = `${process.env.NEXT_PUBLIC_BASEURL}${API_V}${USER_ME}`;
const NEXT_USER_PROFILE_DETAILS_API = `${process.env.NEXT_PUBLIC_BASEURL}${API_V}${USER_PROFILE_DETAILS}`;

class UserService {
  // de scos header, este adaugat in axios config
  async getUsersMe(): Promise<IUserModel> {
    try {
      const response = await strapiAxios.get<IUserModel>(USER_ME);
      return response.data;
    } catch (error) {
      console.log("Error fetching user data: ", error);
      throw new Error("Failed to fetch user data");
    }
  }

  async getUserDetailsID() {
    // user profile-details id
    const response = await this.getUsersMe();
    const uID = response.id;

    const queryFilter = `?filters[user_id][$eq]=${uID}`;
    const uDetails: IGETUserDetails = await strapiAxios.get(`${USER_PROFILE_DETAILS}${queryFilter}`).then(res => res.data.data[0]);
    return uDetails.id;
  }

  async getUserDetails(userId: number) {
    const queryFilter = `?filters[user_id][$eq]=${userId}`;
    const response = await strapiAxios.get(`${USER_PROFILE_DETAILS}${queryFilter}`);
    return response.data;
  }

  async updateUserDetails(data: IUserDetailsModel) {
    const getUserDetailsID = await this.getUserDetailsID();
    const parsedData = {
      data: {
        ...data
      }
    }
    const response = await strapiAxios.put(`${USER_PROFILE_DETAILS}/${getUserDetailsID}`, parsedData)
    return response.data;
  }

  async updateUserSubscription(
    userDetailsID: number | string,
    subscriptionName?: string | null
  ) {
    // update that user is subscribed
    const data = {
      subscribed: subscriptionName ? true : false,
      subscription_name: subscriptionName,
    };
    try {
      await strapiAxios
        .put(`${USER_PROFILE_DETAILS}/${userDetailsID}`, { data: { ...data } })
    } catch (error) {
      console.log(error)
    }
  }

  async refreshUserTotalReviews(id: number, totalReviews: number) {
    const newData = {
      data: {
        reviews: totalReviews + 1,
      },
    };
    try {
      await strapiAxios.put(`${USER_PROFILE_DETAILS}/${id}`, newData)
    } catch (error) {
      console.log(error);
      AppUtils.toastNotification("OOPS! An error occured while updating reviews!", false);      
    }
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
