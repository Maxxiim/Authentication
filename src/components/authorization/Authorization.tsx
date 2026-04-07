import { useState } from 'react';
import { url } from '../../api/url';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import styles from './authorization.module.scss';

interface UserLogin {
  name: string;
  password: string;
}

function Authorization() {
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      password: '',
    },
  });

  const togglePassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data: UserLogin) => {
    try {
      const response = await fetch(`${url}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, password: data.password }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Ошибка входа');
      }
      localStorage.setItem('token', responseData.token);
      reset();
      setError('');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="wrapper">
      <div className={`${styles.wrapperHeader}`}>
        <h1 className={`${styles.title}`}>ВХОД</h1>
        {error && <p className={`${styles.error}`}>{error}</p>}
      </div>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className={`${styles.name}`}>
          <label className={`${styles.labelName}`} htmlFor="name">
            <span className={`${styles.span}`}>name</span>
            <input
              style={{ display: 'relative' }}
              id="name"
              {...register('name', {
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

        <div className={`${styles.password}`}>
          <label className={`${styles.labelPassword}`} htmlFor="password">
            <span className={`${styles.span}`}>password</span>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              {...register('password', {
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
        </div>
        <button className={`${styles.btnIn}`} type="submit">
          Войти
        </button>
      </form>
    </div>
  );
}

export default Authorization;
