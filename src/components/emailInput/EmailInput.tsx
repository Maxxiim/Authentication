import { ErrorMessage } from '@hookform/error-message';

interface PropsDate {
  register: any;
  errors: any;
  styles: any;
}

function EmailInput({ register, errors, styles }: PropsDate) {
  return (
    <div className={`${styles.block} ${styles.email}  `}>
      <label className={`${styles.label}`} htmlFor="email">
        <span className={`${styles.span}`}>Email</span>
        <input
          style={{ display: 'relative' }}
          id="email"
          {...register('email', {
            required: true,
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: 'Невалидный email',
            },
          })}
        />
      </label>

      <ErrorMessage
        errors={errors}
        name="email"
        render={({ message }) => (
          <span className={`${styles.error}`}>{message}</span>
        )}
      />
    </div>
  );
}

export default EmailInput;
