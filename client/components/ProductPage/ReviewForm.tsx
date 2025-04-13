import { ChangeEvent, useContext, useState } from "react";
import Rating from "react-rating";
import { Star } from "react-feather";
import AccountContext from "../../store/account-context";
import { IProductReviewModel } from "../../models/ProductReview.model";
import { useForm } from "react-hook-form";
import { z } from "zod";
import reviewService from "../../shared/services/reviewService";
import userService from "../../shared/services/userService";
import InputField from "../global/form/InputField";
import IProduct from "../../types/product";

const reviewSchema = z
    .object({
        title: z.string(),
        review: z.string(),
    })
type TReviewSchema = z.infer<typeof reviewSchema>;

type Props = {
    product: IProduct,
    setShow: () => void,
}

export default function ReviewForm({ product, setShow }: Props) {
    const [rating, setRating] = useState<number>(0);
    const [ratingMsg, setRatingMsg] = useState<string | null>(null);
    const accountManager = useContext(AccountContext);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        reset,
    } = useForm<TReviewSchema>();

    const onSubmit = async (formInputData: TReviewSchema) => {
        if (rating === 0) {
            setRatingMsg("Nota este obligatorie")
        } else {
            const data: {data: IProductReviewModel} = {
                data: {
                    blocked: false,
                    product_id: product.id,
                    rating: rating,
                    title_review: formInputData.title ?? undefined,
                    review: formInputData.review ?? undefined,
                    user_profile_detail: [accountManager!.userDetails!.id],
                }
            }
            userService.refreshUserTotalReviews(accountManager!.userDetails!.id, accountManager!.userDetails!.attributes.reviews);
            reviewService.postProductReview(data).then(() => accountManager!.refreshContext());
            reset();
            setShow();
        }
    }

    return (
        <div className='modal-review-content'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <p>Spune-ne parerea ta despre parfum!</p>
                <div className="prod-wrapper">
                    <img src={`${process.env.NEXT_PUBLIC_STRAPI_ROOTURL}` + product.attributes.image.data[0].attributes.url} />
                    <div className="prod-details">
                        <div className="prod-brand">{product.attributes.brand}</div>
                        <div className="prod-model">{product.attributes.model}</div>
                    </div>
                    <div className="rate-wrapper">
                        <p>Acorda o nota *</p>
                        {/* @ts-ignore */}
                        <Rating 
                            fractions={1} 
                            initialRating={rating} 
                            emptySymbol={<Star size={24} fill="#babfc7" stroke="#babfc7" />}
                            fullSymbol={<Star size={24} fill="#cc3633" stroke="#cc3633" />}
                            onChange={val => setRating(val)}
                        />
                        {ratingMsg && <p className="rating-msg">{ratingMsg}</p>}
                    </div>
                </div>

                <div className="flex flex-column">
                    <div className="mb-8">
                        <InputField 
                            {...register("title")}
                            label="Titlu review (optional)"
                            type="text"
                            className="w-full"
                            error={errors.title?.message}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setValue("title", e.target.value)
                            }
                        />
                    </div>
                    <div className="mb-8">
                        <InputField 
                            {...register("review")}
                            label="Review (optional)"
                            type="text"
                            className="w-full"
                            error={errors.review?.message}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setValue("review", e.target.value)
                            }
                        />
                    </div>
                </div>
                <button 
                    className='button-second mt-5' 
                    disabled={isSubmitting} 
                    type='submit' 
                    // onClick={setShow}
                >Adauga review</button>
            </form>
        </div>

    )
}