import { useForm } from 'react-hook-form';
import { url } from '../../api/url';

import styles from './restore.module.scss';

function RestorePassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: { email: string }) => {
    try {
      const response = await fetch(`${url}/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={`${styles.block} ${styles.email}  `}>
          <label className={`${styles.label}`} htmlFor="email">
            <span className={`${styles.span}`}>Email</span>
            <input
              value={'test@mail.ru'}
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
        <button className={`${styles.btn}`}>Отправить</button>
      </form>
    </div>
  );
}

export default RestorePassword;
