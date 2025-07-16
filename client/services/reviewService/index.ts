import strapiAxios from "../../api/axios";
import { IProductReviewModel } from "../../models/ProductReview.model";
import { AppUtils } from "../../utils/app.utils";
import { PRODUCT_REVIEWS } from "../../utils/constants";

class ReviewService {
  async postProductReview(prodReview: { data: IProductReviewModel }) {
    try {
      return await strapiAxios
        .post(`${PRODUCT_REVIEWS}`, prodReview)
        .then(() => {
          AppUtils.toastNotification(
            "A review has been added successfully!",
            true
          );
        });
    } catch (error) {
      console.log(error);
      AppUtils.toastNotification(
        "OOPS! An error occured adding the review!",
        false
      );
    }
  }

  async likeReview(
    userId: number,
    revId: number,
    totalLikes: number,
    usersLikedOldList: number[] | null,
    totalDislikes: number,
    usersDislikedOldList: number[] | null
  ) {
    let _newData: any = {
      data: {
        likes: 0,
        users_liked: [],
        dislikes: totalDislikes,
        users_disliked: usersDislikedOldList ? [...usersDislikedOldList] : [],
      },
    };
    if (
      usersDislikedOldList &&
      usersDislikedOldList.find((uId) => uId === userId)
    ) {
      const undoDislike = usersDislikedOldList.filter((uId) => uId !== userId);
      _newData = {
        data: {
          ..._newData.data,
          dislikes: totalDislikes - 1,
          users_disliked: [...undoDislike],
        },
      };
    }
    if (usersLikedOldList && usersLikedOldList.find((uId) => uId === userId)) {
      // if there is a list & the user already liked, undo the like
      const undoLike = usersLikedOldList.filter((uId) => uId !== userId);
      _newData = {
        data: {
          ..._newData.data,
          likes: totalLikes - 1,
          users_liked: [...undoLike],
        },
      };
    } else {
      _newData = {
        data: {
          ..._newData.data,
          likes: totalLikes + 1,
          users_liked: usersLikedOldList
            ? [...usersLikedOldList, userId]
            : [userId],
        },
      };
    }

    try {
      await strapiAxios.put(`${PRODUCT_REVIEWS}/${revId}`, _newData);
    } catch (error) {
      console.log(error);
      AppUtils.toastNotification(
        "OOPS! An error occured while updating reviews!",
        false
      );
    }
  }

  async dislikeReview(
    userId: number,
    revId: number,
    totalLikes: number,
    usersLikedOldList: number[] | null,
    totalDislikes: number,
    usersDislikedOldList: number[] | null
  ) {
    let _newData: any = {
      data: {
        likes: totalLikes,
        users_liked: usersLikedOldList ? [...usersLikedOldList] : [],
        dislikes: 0,
        users_disliked: [],
      },
    };
    if (usersLikedOldList && usersLikedOldList.find((uId) => uId === userId)) {
      const undoLike = usersLikedOldList.filter((uId) => uId !== userId);
      _newData = {
        data: {
          ..._newData.data,
          likes: totalLikes - 1,
          users_liked: [...undoLike],
        },
      };
    }
    if (
      usersDislikedOldList &&
      usersDislikedOldList.find((uId) => uId === userId)
    ) {
      // if there is a list & the user already liked, undo the dislike
      const undoDislike = usersDislikedOldList.filter((uId) => uId !== userId);
      _newData = {
        data: {
          ..._newData.data,
          dislikes: totalDislikes - 1,
          users_disliked: [...undoDislike],
        },
      };
    } else {
      _newData = {
        data: {
          ..._newData.data,
          dislikes: totalDislikes + 1,
          users_disliked: usersDislikedOldList
            ? [...usersDislikedOldList, userId]
            : [userId],
        },
      };
    }

    try {
      await strapiAxios.put(`${PRODUCT_REVIEWS}/${revId}`, _newData);
    } catch (error) {
      console.log(error);
      AppUtils.toastNotification(
        "OOPS! An error occured while updating reviews!",
        false
      );
    }
  }
}

export default new ReviewService();
