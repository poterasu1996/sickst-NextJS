import { Button } from "react-bootstrap";
import { useState, useContext } from "react";
import CustomFormField from "../global/form/CustomFormField";
import AuthContext from "../../store/auth-context";
import { useRouter } from 'next/router';
import axios from '../../api/axios';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// @ts-ignore
import Cookies from 'js-cookie';

const LOGIN_URL = '/auth/local';
const logInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Parola trebuie sa contina minim 8 caractere"),
})

type TLogInSchema = z.infer<typeof logInSchema>

export default function LogInForm() {
  const { setAuth } = useContext(AuthContext);
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TLogInSchema>({
    resolver: zodResolver(logInSchema)
  });

  function createCookieInHour(cookieName: string, cookieValue: any, hourToExpire: number) {
    let date =  new Date();
    date.setTime(date.getTime()+(hourToExpire*60*60*1000)); // number of hours
    document.cookie = cookieName + "=" + cookieValue + ";path = " + "/" + "; expires = " + date.toString();
  }

  const onSubmit = async (data: TLogInSchema) => {
    try {
      const response = await axios.post(LOGIN_URL, {
        identifier: data.email,
        password: data.password
      });
      const jwt = response?.data?.jwt;

      if (jwt) {
        setAuth(jwt);
        createCookieInHour('jwt', jwt, 1); // create cookie with jwt
        router.push('/');

        // adding auto-logout
        const oneHour = 1000 * 60 * 60; 
        setTimeout(() => {
          Cookies.remove("jwt");
          setAuth(null);
          router.push("/account/login");
        }, oneHour);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('No server response');
      } else if (err.response?.status === 400) {
        setError('Invalid email or password');
      } else {
        setError('Login Failed');
      } 
    }

    reset();
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomFormField 
          {...register("email")}
          controlid="floatingEmail" 
          name="email" 
          label="Email address" 
          type="email" 
          error={errors?.email?.message}
        />
        <CustomFormField 
          {...register("password")}
          controlid="floatingPassword" 
          name="password" 
          label="Password" 
          type="password" 
          error={errors?.password?.message}
        />
        {error && 
          <div className="form-errors">
            ERROR: {error}
          </div>
        }
        <Button 
          disabled={isSubmitting}
          className="button-second mt-5" 
          type="submit"
        >Log In</Button>
      </form>

    </>
  );
};

