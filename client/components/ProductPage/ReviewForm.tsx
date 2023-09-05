import { useContext, useRef, useState } from "react";
import { Formik } from 'formik';
import { Form } from 'react-bootstrap';
import Rating from "react-rating";
import { Star } from "react-feather";
import IProduct from '../../types/Product.interface';
// import * as Yup from "yup";
// import CustomFormField from "../global/form/CustomFormField";
import CustomLabeledField from "../global/form/LabeledField";
import { InputType } from "../../shared/enums/input.enum";
import AccountContext from "../../store/account-context";
import { IProductReviewModel } from "../../models/ProductReview.model";

type Props = {
    product: IProduct,
    setShow: () => void,
}

export default function ReviewForm({ product, setShow }: Props) {
    const titleRef = useRef<HTMLInputElement | null>(null);
    const reviewRef = useRef<HTMLInputElement | null>(null);
    const [rating, setRating] = useState<number>(0);
    const [ratingMsg, setRatingMsg] = useState<string | null>(null);
    const accountManager = useContext(AccountContext);
    // const validate = Yup.object({
    //     rating: Yup.number().required('Nota este obligatorie'),
    // })

    console.log(accountManager?.userDetails)
    const submitHandler =async (event: React.SyntheticEvent) => {
        event.preventDefault();

        if (rating === 0) {
            setRatingMsg("Nota este obligatorie")
        } else {
            const data: {data: IProductReviewModel} = {
                data: {
                    blocked: false,
                    product_id: product.id,
                    rating: rating,
                    title_review: titleRef?.current?.value,
                    review: reviewRef?.current?.value,
                    user_profile_detail: [accountManager!.userDetails!.id],
                }
            }
            accountManager?.refreshUserTotalReviews(accountManager.userDetails!.id, accountManager.userDetails!.attributes.reviews);
            accountManager?.postReview(data);
            setShow();
        }
    }

    return (
        <div className='modal-review-content'>
            {/* @ts-ignore */}
            <Formik
                initialValues={{
                    rating: "",
                    title: "",
                    review: "",
                }}
                // validationSchema={validate}
            >
                {({ isSubmitting }) => (
                    <Form onSubmit={submitHandler}>
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

                        {/* <Form.Group className='my-5' controlId='reviewTitle'>
                            <Form.Label>Titlu review (optional)</Form.Label>
                            <Form.Control type='text' placeholder='Foloseste o sugestie sau scrie propriul titlu' ref={titleRef}/>
                        </Form.Group>
                        <Form.Group className='my-5' controlId='review'>
                            <Form.Label>Review (optional)</Form.Label>
                            <Form.Control ref={reviewRef} as='textarea' rows={4} placeholder='Spune-ne daca iti place sau nu ce ti-ai luat. &#10; 
                                • Se ridica la nivelul asteptarilor tale
                                • Esti multumit de raportul calitate pret?
                                • Daca ai recomanda si altora'/>
                        </Form.Group> */}

                        <CustomLabeledField 
                            name="title"
                            controlId="title"
                            class="my-5"
                            label="Titlu review (optional)"
                            type={InputType.TEXT}
                            ref={titleRef}
                        />
                        <CustomLabeledField 
                            name="review"
                            controlId="review"
                            class="my-5"
                            label="Review (optional)"
                            placeholder="Spune-ne daca iti place sau nu ce ti-ai luat."
                            type={InputType.TEXTAREA}
                            ref={reviewRef}
                        />
                        <button 
                            className='button-second' 
                            disabled={isSubmitting} 
                            type='submit' 
                            // onClick={setShow}
                        >Adauga review</button>
                    </Form>
                )}
            </Formik>
        </div>

    )
}