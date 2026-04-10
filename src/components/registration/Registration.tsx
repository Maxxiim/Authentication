import { useCallback, useEffect, useState } from 'react';
import { url } from '../../api/url';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

import styles from './registration.module.scss';

interface UserLogin {
  name: string;
  password: string;
  email: string;
  passwordConfirm: string;
}

function Registration() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors },
    clearErrors,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      password: '',
      email: '',
      passwordConfirm: '',
    },
  });

  const togglePassword = useCallback(
    () => setShowPassword((prev) => !prev),
    [],
  );

  const onSubmit = async (data: UserLogin) => {
    try {
      const { passwordConfirm, ...dataForServer } = data;

      const response = await fetch(`${url}/registration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataForServer),
      });

      const responseData = await response.json();
      

      if (responseData.fields && Array.isArray(responseData.fields)) {
        console.log(responseData)
        setGeneralError(responseData.message);

        responseData.fields.forEach((field) => {
          setError(field, { type: 'manual', message: '' });
        });
      }

      if (!response.ok) {
        throw new Error(responseData.message || 'Ошибка входа');
      }
      reset();
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <div className="wrapper">
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
              {...register('name', {
                required: true,
                minLength: {
                  value: 2,
                  message: 'Минимальная длина 2',
                },
                maxLength: {
                  value: 20,
                  message: 'Максимальная длина 20',
                },
              })}
              onFocus={() => clearErrors('name')}
            />
            {errors.name && errors.name.type !== 'manual' && (
              <p className={styles.error}>{errors.name.message}</p>
            )}
          </label>
        </div>

        <div className={`${styles.block} ${styles.email}  `}>
          <label className={`${styles.label}`} htmlFor="email">
            <span className={`${styles.span}`}>Email</span>
            <input
              className={errors.email ? `${styles.errorsInput}` : ''}
              style={{ display: 'relative' }}
              id="email"
              {...register('email', {
                required: true,
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: 'Невалидный email',
                },
              })}
              onFocus={() => clearErrors('email')}
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
              type={showPassword ? 'text' : 'password'}
              id="password"
              {...register('password', {
                required: true,
                minLength: {
                  value: 6,
                  message: 'Минимальное количество символов 6',
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                  message:
                    'Необходимо указать как минимум одну букву и одну цифру',
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
                  errors.password?.type === 'pattern'
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
              type={showPassword ? 'text' : 'password'}
              id="passwordConfirm"
              {...register('passwordConfirm', {
                required: true,
                validate: (value) =>
                  value === watch('password') || 'Пароли не совпадают',
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
              <svg
                width="18"
                height="16"
                viewBox="0 0 18 16"
                fill=""
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.34984 12.7748C2.4915 11.5582 1.2915 9.72482 1.2915 8.11649C1.2915 5.38316 4.7415 2.03316 8.99984 2.03316C10.7415 2.03316 12.3582 2.59149 13.6582 3.45816"
                  stroke=""
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.5414 5.17517C16.2839 6.11684 16.7164 7.1585 16.7164 8.11684C16.7164 10.8502 13.2581 14.2002 8.99977 14.2002C8.24144 14.2002 7.50061 14.0918 6.80811 13.9002"
                  stroke=""
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.13804 9.97249C6.6422 9.48166 6.3647 8.81249 6.3672 8.11499C6.36387 6.66083 7.54054 5.47916 8.99554 5.47666C9.69554 5.47499 10.3672 5.75249 10.8622 6.24749"
                  stroke=""
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.5912 8.58258C11.3962 9.65925 10.5537 10.5034 9.47705 10.7009"
                  stroke=""
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.5762 1.54158L2.43115 14.6866"
                  stroke=""
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </label>

          <ErrorMessage
            errors={errors}
            name="passwordConfirm"
            render={({ message }) => (
              <p
                className={
                  errors.passwordConfirm?.type === 'validate'
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

export default Registration;
