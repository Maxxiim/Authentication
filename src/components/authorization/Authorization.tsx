import { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { Link } from "react-router-dom";

import { authApi } from "../../api/authApi";
import HidePassword from "../../assets/HidePassword";
import { useTogglePassword } from "../../utils/togglePassword";
import type { UserFieldLogin } from "../../shared/types/type";

import styles from "./authorization.module.scss";

function Authorization() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      password: "",
    },
  });

  const [error, setError] = useState("");
  const { showPassword, togglePassword } = useTogglePassword();

  const onSubmit = async (data: UserFieldLogin) => {
    try {
      const response = await authApi.login(data);

      if (response.message && response.status !== 200) {
        setError(response.message);
        return;
      }

      alert("Вы успешно авторизовались ");
      reset();
      setError("");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <div className="wrapper">
      <Link className={styles.topLink} to="/registration">
        <button className={`${styles.btn} ${styles.btnRegister}`}>
          Регистрация
        </button>
      </Link>
      <div className={`${styles.wrapperHeader}`}>
        <h1 className={`${styles.title}`}>ВХОД</h1>
        {error && <p className={`${styles.error}`}>{error}</p>}
      </div>
      <form className={`${styles.form}`} onSubmit={handleSubmit(onSubmit)}>
        <div className={`${styles.block}${styles.name}`}>
          <label className={`${styles.label}`} htmlFor="name">
            <span className={`${styles.span}`}>логин</span>
            <input
              style={{ display: "relative" }}
              id="name"
              {...register("name", {
                required: true,
              })}
            />
          </label>

          <ErrorMessage
            errors={errors}
            name="name"
            render={({ message }) => <span className="error">{message}</span>}
          />
        </div>

        <div className={`${styles.block}${styles.password}`}>
          <label className={`${styles.label}`} htmlFor="password">
            <span className={`${styles.span}`}>пароль</span>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              {...register("password", {
                required: true,
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
        </div>
        {error && (
          <Link className={`${styles.restore}`} to="/restore">
            <button className={`${styles.restore}`} type="button">
              Восстановить пароль?
            </button>
          </Link>
        )}
        <button className={`${styles.btn}`} type="submit">
          Войти
        </button>
      </form>
    </div>
  );
}

export default Authorization;
