import { ChangeEvent, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

// Components
import InputField from "../global/form/InputField";
import PrimaryButton from "../global/PrimaryButton";
import { Check } from "react-feather";
import maleIcon from "../../public/img/male-icon.png";
import femaleIcon from "../../public/img/female-icon.jpg";

const REGISTER_URL = "/auth/local/register";
const USER_DETAILS = "/user-profile-details";
const CLIENT_URL = process.env.NEXT_PUBLIC_BASEURL;
const STRIPE_CUSTOMER = "/api/v1/stripe/customer"

const signUpSchema = z
  .object({
    email: z.string({ required_error: 'Field is required' }).email({ message: 'Invalid email address'}),
    password: z.string().min(8, "Parola trebuie sa contina minim 8 caractere"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parolele trebuie sa coincida",
    path: ["confirmPassword"],
  });

type TSignUpSchema = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [cbFemale, setCbFemale] = useState(true);
  const [cbMale, setCbMale] = useState(false);
  const [newsletter, setNewsletter] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  function handleGender(value: string) {
    if (value === "female") {
      cbMale && setCbMale(!cbMale);
      !cbFemale && setCbFemale(!cbFemale);
    } else {
      !cbMale && setCbMale(!cbMale);
      cbFemale && setCbFemale(!cbFemale);
    }
  }

  function handleNewsletter() {
    setNewsletter((prev) => !prev);
  }

  const onSubmit = async (formData: TSignUpSchema) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_APIURL}${REGISTER_URL}`, {
        username: formData.email ,
        email: formData .email,
        password: formData.password,
      })

      // create stripe customer acc
      const stripeCustomer = await axios.post(`${CLIENT_URL}${STRIPE_CUSTOMER}`, {email: formData.email});

      // create user-details profile
      const header = {
        headers: {
          'Authorization': `Bearer ${response.data.jwt}`,
        }
      }
      const data = {
        data: {
          client_role: 'client',
          gender: cbFemale ? 'female' : 'male',
          newsletter: newsletter,
          stripe_customer_id: stripeCustomer.data.id,
          user_id: response.data.user.id
        }
      }

      await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_APIURL}${USER_DETAILS}`, data, header)
        .catch(err => console.log(err))

      if (response.status === 200) {
        router.push('/account/login');
      }
    } catch (err: any) {
      if(err.response?.status === 400) {
        console.log(err)
        setError(err.response?.data.error.message);
      } else {
        setError("Failed to create an account.");
      }
    }
    reset();
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="gender-icons">
          <div className="form-check">
            <label className="form-check-label" onChange={() => handleGender("female")}>
              <Image src={femaleIcon} width={100} height={100} />
              <input 
                className="cb hidden" 
                type="checkbox" 
                defaultChecked={true}
              ></input>
              {cbFemale && (
                  <div className="checked">
                    <Check
                      strokeWidth={"3px"}
                      height={22}
                      width={22}
                      stroke={"#cc3633"}
                    />
                  </div>
                )}
            </label>
            <p>Feminin</p>
          </div>
          <div className="form-check">
            <label className="form-check-label" onChange={() => handleGender("male")}>
              <Image src={maleIcon} width={100} height={100} />
              <input 
                className="cb hidden" 
                type="checkbox" 
                defaultChecked={true}
              ></input>
              {cbMale && (
                  <div className="checked">
                    <Check
                      strokeWidth={"3px"}
                      height={22}
                      width={22}
                      stroke={"#cc3633"}
                    />
                  </div>
                )}
            </label>
            <p>Masculin</p>
          </div>
        </div>
        {error && <div className="form-errors">ERROR: {error}</div>}

        <InputField 
          {...register('email')}
          label="Email address"
          type="email"
          error={errors.email?.message}
          helperText={errors.email?.message}
          className="mt-8"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue("email", e.target.value)
          }
        />
        <InputField 
          {...register('password')}
          label="Password"
          type="password"
          error={errors.password?.message}
          helperText={errors.password?.message}
          className={errors.password?.message ? 'mt-0' : 'mt-8'}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue("password", e.target.value)
          }
        />
        <InputField 
          {...register('confirmPassword')}
          label="Password confirmation"
          type="password"
          error={errors.confirmPassword?.message}
          helperText={errors.confirmPassword?.message}
          className={errors.confirmPassword?.message ? 'mt-8' : 'mt-8'}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue("confirmPassword", e.target.value)
          }
        />

        <div className="form-field newsletter">
          <label className="check-box" onChange={handleNewsletter}>
            <input className="cb" type="checkbox" defaultChecked={true}></input>
            <span className="custom-cb"></span>
            <span className="text">Sign me up for details from Sickst</span>
          </label>
          <div className="terms">
            <span className="title">
              By hitting the "Sign up" button, you agree to the
            </span>
            <span className="tc">
              <a href="#">Terms and Conditions</a> and{" "}
              <a href="#">Privacy Policy</a>
            </span>
          </div>
        </div>
        <PrimaryButton
          disabled={isSubmitting}
          className="mt-5"
          type="submit"
        >
          Sign up
        </PrimaryButton>
      </form>
    </>
  );
}
