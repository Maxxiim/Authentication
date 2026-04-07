import { ErrorMessage } from '@hookform/error-message';

interface PropsDate {
  register: any;
  errors: any;
  styles: any;
}

function NameInput({ register, errors, styles }: PropsDate) {
  return (
    <div className={`${styles.block} ${styles.name}`}>
      <label className={`${styles.label}`} htmlFor="name">
        <span className={`${styles.span}`}>Логин</span>
        <input
          style={{ display: 'relative' }}
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
        />
      </label>

      <ErrorMessage
        errors={errors}
        name="name"
        render={({ message }) => (
          <span className={`${styles.error}`}>{message}</span>
        )}
      />
    </div>
  );
}

export default NameInput;
