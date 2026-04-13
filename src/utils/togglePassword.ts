import { useCallback, useState } from 'react';

export const useTogglePassword = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);
  return { showPassword, togglePassword, setShowPassword };
};
