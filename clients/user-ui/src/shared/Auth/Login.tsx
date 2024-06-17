import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AiFillGithub,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";

import { LOGIN_USER } from "@/src/graphql/actions/login.action";
import styles from "@/src/utils/style";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be atleast 8 characters long"),
});

type LoginSchema = z.infer<typeof formSchema>;

const Login = ({
  setActiveState,
  setOpen,
}: {
  setActiveState: (e: string) => void;
  setOpen: (e: boolean) => void;
}) => {
  const [show, setShow] = useState(false);
  const [login, { loading }] = useMutation(LOGIN_USER);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      const loginData = {
        email: data.email,
        password: data.password,
      };
      const response = await login({
        variables: loginData,
      });

      if (response.data.Login.user) {
        toast.success("Login Successful");
        Cookies.set("refresh_token", response.data.Login.refreshToken);
        Cookies.set("access_token", response.data.Login.accessToken);
        setOpen(false);
        reset();
        window.location.reload();
      } else toast.error(response.data.Login.error.message);
    } catch (error: any) {
      toast.error(error.message);
    }

    reset();
  };

  return (
    <div>
      <h1 className={`${styles.title}`}>Login with DarshanWebDev</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label className={`${styles.label}`}>Enter your email</label>

        <input
          {...register("email")}
          type="email"
          placeholder="aa@gmail.com"
          className={`${styles.input}`}
        />

        {errors.email && (
          <span className="text-red-500 block mt-1">
            {`${errors.email.message}`}
          </span>
        )}

        <div className="w-full mt-5 relative mb-1">
          <label htmlFor="password" className={`${styles.label}`}></label>

          <input
            {...register("password")}
            type={!show ? "password" : "text"}
            placeholder="password"
            className={`${styles.input}`}
          />

          {!show ? (
            <AiOutlineEyeInvisible
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(true)}
            />
          ) : (
            <AiOutlineEye
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(false)}
            />
          )}
        </div>

        {errors.password && (
          <span className="text-red-500 mt-1">{`${errors.password.message}`}</span>
        )}

        <div className="w-full mt-5">
          <span
            className={`${styles.label} text-[#2190ff] block text-right cursor-pointer`}
            onClick={() => setActiveState("Forgot-Password")}
          >
            Forgot your password ?
          </span>
          <input
            type="submit"
            value="Login"
            disabled={isSubmitting || loading}
            className={`${styles.button} mt-3`}
          />
        </div>

        <br />

        <h5 className="text-center pt-4 font-Poppins text-[16px] text-white">
          Or join with
        </h5>

        <div className="flex items-center justify-center my-3">
          <FcGoogle size={30} className="cursor-pointer mr-2" />

          <AiFillGithub size={30} className="cursor-pointer ml-2" />
        </div>

        <h5 className="text-center pt-4 font-Poppins text-[14px]">
          Not have any account ?{" "}
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setActiveState("Signup")}
          >
            Sign Up
          </span>
        </h5>

        <br />
      </form>
    </div>
  );
};

export default Login;