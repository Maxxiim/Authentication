import { useCallback, useState } from 'react';
import { url } from '../../api/url';
import { useForm } from 'react-hook-form';

import { EmailInput } from '../emailInput';
import { PasswordInput } from '../passwordInput';
import { NameInput } from '../nameInput';
import { PasswordConfirmInput } from '../passwordConfirmInput';
import styles from './registration.module.scss';

interface UserLogin {
  name: string;
  password: string;
  email: string;
  passwordConfirm: string;
}

function Registration() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
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
    [showPassword],
  );

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
      <h1 className={`${styles.title}`}>Регистрация</h1>

      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <NameInput register={register} errors={errors} styles={styles} />
        <EmailInput register={register} errors={errors} styles={styles} />
        <PasswordInput
          register={register}
          showPassword={showPassword}
          errors={errors}
          styles={styles}
        />

        <PasswordConfirmInput
          togglePassword={togglePassword}
          register={register}
          showPassword={showPassword}
          errors={errors}
          styles={styles}
          watch={watch}
        />
        <button className={`${styles.btnIn}`} type="submit">
          Регистрация
        </button>
      </form>
    </div>
  );
}

export default Registration;
