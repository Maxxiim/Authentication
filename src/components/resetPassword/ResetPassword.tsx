import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
import HidePassword from "../../assets/HidePassword";
import { url } from "../../api/url";
import { useNavigate } from "react-router-dom";

import { useTogglePassword } from "../../utils/togglePassword";
import type { UserFieldResetPassword } from "../../shared/types/type";

import styles from "./resetPassword.module.scss";
import { useState } from "react";

function ResetPassword() {
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

  const [generalError, setGeneralError] = useState("");

  const navigate = useNavigate();

  const { showPassword, togglePassword } = useTogglePassword();

  function changePage() {
    const timer = setTimeout(() => {
      return navigate("/");
    }, 2000);

    return () => clearTimeout(timer);
  }

  const onSubmit = async (data: UserFieldResetPassword) => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (!token) {
        setGeneralError("Ссылка для сброса пароля недействительна.");
        return;
      }

      const dataForServer = { ...data };
      dataForServer.token = token;
      delete dataForServer.passwordConfirm;

      const response = await fetch(`${url}/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataForServer),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setGeneralError(responseData.message ?? "Не удалось изменить пароль.");
        return;
      }

      setGeneralError("");
      alert("Пароль изменен");
      reset();
      changePage();
    } catch (error) {
      if (error instanceof Error) {
        setGeneralError(error.message);
      } else {
        setGeneralError("Произошла ошибка при сбросе пароля.");
      }
    }
  };

  return (
    <div className="wrapper">
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={`${styles.block} ${styles.password}`}>
          <label className={`${styles.label}`} htmlFor="password">
            <span className={`${styles.span}`}>Пароль</span>
            <input
              type={showPassword ? "text" : "password"}
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
              <p className={`${styles.validationError} ${styles.errorVisible}`}>
                {message}
              </p>
            )}
          />
          {!errors.password && (
            <p className={`${styles.validationError} ${styles.errorPlaceholder}`}>
              {" "}
            </p>
          )}
        </div>

        <div className={`${styles.block} ${styles.passwordConfirm}`}>
          <label className={`${styles.label}`} htmlFor="passwordConfirm">
            <span className={`${styles.span}`}>Подтвердить пароль</span>
            <input
              type={showPassword ? "text" : "password"}
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
              <p className={`${styles.validationError} ${styles.errorVisible}`}>
                {message}
              </p>
            )}
          />
          {!errors.passwordConfirm && (
            <p className={`${styles.validationError} ${styles.errorPlaceholder}`}>
              {" "}
            </p>
          )}
        </div>

        <button className={`${styles.btn}`} type="submit">
          Сбросить пароль
        </button>
      </form>
      <p
        className={`${styles.error} ${generalError ? styles.errorVisible : styles.errorPlaceholder}`}
      >
        {generalError || " "}
      </p>
    </div>
  );
}
export default ResetPassword;
