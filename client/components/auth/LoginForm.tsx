import { ChangeEvent } from "react";
import {
  useState,
  useContext,
} from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import InputField from "../global/form/InputField";
import PrimaryButton from "../global/PrimaryButton";

// Storage & Services
import AuthContext from "../../store/auth-context";
import { USER_LOGIN } from "../../utils/constants";


const logInSchema = z.object({
  email: z.string({ required_error: 'Field is required' }).email({ message: 'Invalid email address'}),
  password: z.string().min(8, "Parola trebuie sa contina minim 8 caractere"),
});

type TLogInSchema = z.infer<typeof logInSchema>;

export default function LogInForm() {
  const { setIsAuth, setToken } = useContext(AuthContext);
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<TLogInSchema>({
    resolver: zodResolver(logInSchema),
  });

  const onSubmit = async (data: TLogInSchema) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}${process.env.NEXT_PUBLIC_API_V1}${USER_LOGIN}`,
        {
          email: data.email,
          password: data.password,
        }
      );

      if (response.status === 200) {
        setIsAuth(true);
        // setToken(response.data.token);  // might delete in future
        localStorage.setItem('jwt', response.data.token)
        router.push("/shop");

        const expireAuth = 3000 * 60 * 60;
        // const expireAuth = 3000;
        setTimeout(() => {
          setIsAuth(false);
          // setToken(undefined);
          localStorage.getItem('jwt') && localStorage.removeItem('jwt');
          router.push("/account/login");
        }, expireAuth);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("No server response");
      } else if (err.response?.status === 400) {
        setError("Invalid email or password");
      } else {
        setError("Login Failed");
      }
    }

    reset();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-16">
        <InputField 
          {...register('email')}
          label="Email address"
          type="email"
          error={errors.email?.message}
          helperText={errors.email?.message}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue("email", e.target.value)
          }
        />
        <InputField 
          {...register('password')}
          label="Password"
          type="password"
          className={errors.email?.message ? 'mt-0' : 'mt-8'}
          error={errors.password?.message}
          helperText={errors.password?.message}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue("password", e.target.value)
          }
        />
        {error && <div className="form-errors">ERROR: {error}</div>}
        <PrimaryButton
          className="mt-24"
          disabled={isSubmitting}
          type="submit"
        >Log In</PrimaryButton>
      </form>
    </>
  );
}
