import { Form, Button } from "react-bootstrap";
import { ChangeEvent, useState } from "react";
import CustomFormField from "../global/form/CustomFormField";
import { useRouter } from "next/router";
import { Check } from "react-feather";
import maleIcon from "../../public/img/male-icon.png";
import femaleIcon from "../../public/img/female-icon.jpg";
// import axios from "../../api/axios";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const REGISTER_URL = "/auth/local/register";
const USER_DETAILS = "/user-profile-details";
const CLIENT_URL = process.env.NEXT_PUBLIC_BASEURL;
const STRIPE_CUSTOMER = "/api/v1/stripe/customer"

const signUpSchema = z
  .object({
    email: z.string().email(),
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="gender-icons">
          <Form.Check>
            <Form.Check.Label
              onChange={() => {
                handleGender("female");
              }}
            >
              <Image src={femaleIcon} width={100} height={100} />
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
              <Form.Check.Input type="radio" checked={cbFemale} />
            </Form.Check.Label>
            <p>Feminin</p>
          </Form.Check>
          <Form.Check>
            <Form.Check.Label
              onChange={() => {
                handleGender("male");
              }}
            >
              <Image src={maleIcon} width={100} height={100} />
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
              <Form.Check.Input type="radio" checked={cbMale} />
            </Form.Check.Label>
            <p>Masculin</p>
          </Form.Check>
        </div>
        {error && <div className="form-errors">ERROR: {error}</div>}

        <CustomFormField
          {...register("email")}
          label="Email address"
          type="email"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setValue("email", e.target.value)}
          error={errors.email?.message}
        />
        <CustomFormField
          {...register("password")}
          label="Password"
          type="password"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setValue("password", e.target.value)}
          error={errors.password?.message}
        />
        <CustomFormField
          {...register("confirmPassword")}
          label="Password confirmation"
          type="password"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setValue("confirmPassword", e.target.value)}
          error={errors.confirmPassword?.message}
        />

        <div className="form-field newsletter">
          <label className="check-box" onChange={() => handleNewsletter()}>
            <input className="cb" type="checkbox" checked={newsletter}></input>
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
        <Button
          disabled={isSubmitting}
          className="button-second mt-5"
          type="submit"
        >
          Sign up
        </Button>
      </form>
    </>
  );
}
