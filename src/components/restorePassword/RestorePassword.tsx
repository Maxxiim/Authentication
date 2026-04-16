import { useForm } from "react-hook-form";
import { url } from "../../api/url";

import { Link } from "react-router-dom";

import styles from "./restore.module.scss";
import { useState } from "react";

function RestorePassword() {
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: { email: string }) => {
    setMessage("");

    try {
      const response = await fetch(`${url}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();

      if (responseData) {
        reset();
        setMessage("Успешно! Письмо отправлено на почту!");

      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={`${styles.block} ${styles.email}  `}>
          <label className={`${styles.label}`} htmlFor="email">
            <span className={`${styles.span}`}>Email</span>
            <input
              className={errors.email ? `${styles.errorsInput}` : ""}
              style={{ display: "relative" }}
              id="email"
              {...register("email", {
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
        <button className={`${styles.btn}`}>Отправить</button>
      </form>
      {message && (
        <Link className={`${styles.message}`} to="/">
          Хотите вернуться на главную страницу?
        </Link>
      )}
    </div>
  );
}

export default RestorePassword;
