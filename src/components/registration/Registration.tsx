import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useNavigate } from "react-router-dom";

import HidePassword from "../../assets/HidePassword";

import { useTogglePassword } from "../../utils/togglePassword";
import type { UserFieldRegistration } from "../../shared/types/type";

import styles from "./registration.module.scss";

import { authApi } from "../../api/authApi";

function Registration() {
  const { showPassword, setShowPassword, togglePassword } = useTogglePassword();
  const [generalError, setGeneralError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors },
    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      password: "",
      email: "",
      passwordConfirm: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: UserFieldRegistration) => {
    try {
      const dataForServer = { ...data };

      delete dataForServer.passwordConfirm;

      const response = await authApi.registration(dataForServer);

      if (response.fields && Array.isArray(response.fields)) {
        setGeneralError(response.message);

        response.fields.forEach((field: string) => {
          if (field === "name") {
            setError(field, { type: "manual", message: "" });
          }
          if (field === "email") {
            setError(field, { type: "manual", message: "" });
          }
        });
        return;
      }

      setGeneralError("");
      reset();
      setShowPassword(false);
      alert("Вы успешно зарегестрировались");
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        setGeneralError(error.message);
      }
    }
  };

  return (
    <div className="wrapper">
      <Link className={styles.topLink} to="/">
        <button className={`${styles.btn} ${styles.btnRegister}`}>Вход</button>
      </Link>
      <div className={`${styles.wrapperHeader}`}>
        <h1 className={`${styles.title}`}>Регистрация</h1>
        {generalError && <p className={styles.error}>{generalError}</p>}
      </div>

      <form className={`${styles.form}`} onSubmit={handleSubmit(onSubmit)}>
        <div className={`${styles.block} ${styles.name}`}>
          <label className={`${styles.label}`} htmlFor="name">
            <span className={`${styles.span}`}>Логин</span>
            <input
              className={
                errors.name
                  ? `${styles.errorsInput}`
                  : `${styles.errorsInputDef}`
              }
              id="name"
              {...register("name", {
                required: true,
                minLength: {
                  value: 2,
                  message: "Минимальная длина 2",
                },
                maxLength: {
                  value: 20,
                  message: "Максимальная длина 20",
                },
              })}
              onFocus={() => clearErrors("name")}
            />
            {errors.name && errors.name.type !== "manual" && (
              <p className={styles.error}>{errors.name.message}</p>
            )}
          </label>
        </div>

        <div className={`${styles.block} ${styles.email}  `}>
          <label className={`${styles.label}`} htmlFor="email">
            <span className={`${styles.span}`}>Email</span>
            <input
              className={errors.email ? `${styles.errorsInput}` : ""}
              style={{ display: "relative" }}
              id="email"
              {...register("email", {
                required: true,
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Невалидный email",
                },
              })}
              onFocus={() => clearErrors("email")}
            />
          </label>
          {errors.email && (
            <p className={`${styles.error}`}>{errors.email?.message}</p>
          )}
        </div>

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

        {generalError && (
          <Link className={`${styles.restore}`} to="/restore">
            Восстановить пароль?
          </Link>
        )}

        <button className={`${styles.btn}`} type="submit">
          Регистрация
        </button>
      </form>
    </div>
  );
}

export default Registration;
