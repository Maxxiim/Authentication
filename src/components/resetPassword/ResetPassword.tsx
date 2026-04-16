import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
import HidePassword from "../../assets/HidePassword";
import { url } from "../../api/url";

import { useTogglePassword } from "../../utils/togglePassword";

import styles from "./resetPassword.module.scss";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const urlParams = new URLSearchParams(window.location.search);

      const token = urlParams.get("token");
      data["token"] = token;

      const { passwordConfirm, ...dataForServer } = data;

      const response = await fetch(`${url}/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataForServer),
      });

      if (response) {
        const responseData = await response.json();
        console.log(responseData);
        alert("Пароль изменен");
        reset();
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { showPassword, setShowPassword, togglePassword } = useTogglePassword();

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={`${styles.block} ${styles.password}`}>
          <label className={`${styles.label}`} htmlFor="password">
            <span className={`${styles.span}`}>Пароль</span>
            <input
              // type={showPassword ? 'text' : 'password'}
              type="text"
              id="password"
              {...register("password", {
                required: true,
                minLength: {
                  value: 6,
                  message: "Минимальное количество символов 6",
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                  message:
                    "Необходимо указать как минимум одну букву и одну цифру",
                },
              })}
            />
          </label>
          <ErrorMessage
            errors={errors}
            name="password"
            render={({ message }) => (
              <p
                className={
                  errors.password?.type === "pattern"
                    ? styles.errorPassword
                    : styles.error
                }
              >
                {message}
              </p>
            )}
          />
        </div>

        <div className={`${styles.block} ${styles.passwordConfirm}`}>
          <label className={`${styles.label}`} htmlFor="passwordConfirm">
            <span className={`${styles.span}`}>Подтвердить пароль</span>
            <input
              type="text"
              // type={showPassword ? 'text' : 'password'}
              id="passwordConfirm"
              {...register("passwordConfirm", {
                required: true,
                validate: (value) =>
                  value === watch("password") || "Пароли не совпадают",
              })}
            />
            <button
              type="button"
              className={
                showPassword
                  ? `${styles.passwordIconActive}`
                  : `${styles.passwordIcon}`
              }
              onClick={togglePassword}
            >
              <HidePassword />
            </button>
          </label>

          <ErrorMessage
            errors={errors}
            name="passwordConfirm"
            render={({ message }) => (
              <p
                className={
                  errors.passwordConfirm?.type === "validate"
                    ? styles.errorPasswordConfirm
                    : styles.error
                }
              >
                {message}
              </p>
            )}
          />
        </div>

        <button className={`${styles.btn}`} type="submit">
          Регистрация
        </button>
      </form>
    </div>
  );
}
export default ResetPassword;
