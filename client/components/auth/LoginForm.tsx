import { ChangeEvent } from "react";
import { Button } from "react-bootstrap";
import {
  useState,
  useContext,
} from "react";
import CustomFormField from "../global/form/CustomFormField";
import AuthContext from "../../store/auth-context";
import { useRouter } from "next/router";
// import axios from '../../api/axios';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import axios from "axios";
import { USER_LOGIN } from "../../shared/utils/constants";

const logInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Parola trebuie sa contina minim 8 caractere"),
});

type TLogInSchema = z.infer<typeof logInSchema>;

export default function LogInForm() {
  const { setIsAuth } = useContext(AuthContext);
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
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
        router.push("/");

        const expireAuth = 3000 * 60 * 60;
        setTimeout(() => {
          setIsAuth(false);
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomFormField
          {...register("email", { value: getValues("email") || "" })}
          label="Email address"
          type="email"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue("email", e.target.value)
          }
          error={errors?.email?.message}
        />
        <CustomFormField
          {...register("password", { value: getValues("password") || "" })}
          label="Password"
          type="password"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue("password", e.target.value)
          }
          error={errors?.password?.message}
        />
        {error && <div className="form-errors">ERROR: {error}</div>}
        <Button
          disabled={isSubmitting}
          className="button-second mt-5"
          type="submit"
        >
          Log In
        </Button>
      </form>
    </>
  );
}
