import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { url } from "../../api/url";

import type { UserFieldRestore } from "../../shared/types/type";

import styles from "./restore.module.scss";


function RestorePassword() {

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

  const [message, setMessage] = useState("");
  const [messageInvalid, setMessageInvalid] = useState("");
  const [back, setBack] = useState(false);

 

  const onSubmit = async (data: UserFieldRestore) => {
    setMessage("");
    try {
      const response = await fetch(`${url}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        reset();
        setBack(true);
        setMessageInvalid("");
        setMessage(responseData.message);
      } else if (response.status === 401) {
        setBack(true);
        setMessageInvalid(responseData.message);
      } else {
        setBack(true);
        setMessage("Ошибка сервера. Попробуйте позже.");
      }
    } catch (error) {
      throw new Error(String(error));
    }
  };

  return (
    <div className={`${styles.restore}`}>
      <div className={`${styles.wrapper}`}>
        <h1 className={`${styles.title}`}>
          Какой электронный адрес привязан к вашей учетной записи? Мы пришлем
          ссылку для сброса пароля.
        </h1>
        <form className={`${styles.form}`} onSubmit={handleSubmit(onSubmit)}>
          <div className={`${styles.block} ${styles.email}  `}>
            <label className={`${styles.label}`} htmlFor="email">
              <input
                className={`${styles.input} ${errors.email ? styles.errorsInput : ""}`}
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
          </div>
          <button className={`${styles.btn}`}>Отправить</button>
        </form>
        {message && <p className="">{message}</p>}

        {back && (
          <Link className={`${styles.message}`} to="/">
            Вернуться на главную страницу?
          </Link>
        )}
      </div>

      {messageInvalid && (
        <p className={`${styles.messageInvalid}`}>
          {messageInvalid}
          <Link className={`${styles.messageInvalidLink}`} to="/registration">
            Зарегистрироваться?
          </Link>
        </p>
      )}
    </div>
  );
}

export default RestorePassword;
