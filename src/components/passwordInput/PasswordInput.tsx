import { ErrorMessage } from '@hookform/error-message';

interface PropsDate {
  register: any;
  errors: any;
  showPassword: any;
  styles: any;
}

function passwordInput({ register, errors, styles, showPassword }: PropsDate) {
  return (
    <div className={`${styles.block} ${styles.password}`}>
      <label className={`${styles.label}`} htmlFor="password">
        <span className={`${styles.span}`}>Пароль</span>
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          {...register('password', {
            required: true,
            minLength: {
              value: 2,
              message: 'Минимальное количество символов 8',
            },
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{2,}$/,
              message: 'Необходимо указать как минимум одну букву и одну цифру',
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
  );
}

export default passwordInput;
