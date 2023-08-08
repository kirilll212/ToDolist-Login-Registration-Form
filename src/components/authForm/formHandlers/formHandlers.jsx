import { useState } from 'react';
import { validateName, validateEmail, validatePassword, validateConfirmPassword } from "../Validation/config";

export const useFormHandlers = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleNameChange = (value) => {
    setName(value);
    setNameError(validateName(value).error);
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    setEmailError(validateEmail(value).error);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordError(validatePassword(value).error);
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    setConfirmPasswordError(validateConfirmPassword(password, value).error);
  };

  return {
    name,
    email,
    password,
    confirmPassword,
    nameError,
    emailError,
    passwordError,
    confirmPasswordError,
    successMessage,
    handleNameChange,
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    setName,
    setEmail,
    setNameError,
    setEmailError,
    setPassword,
    setPasswordError,
    setConfirmPassword,
    setConfirmPasswordError,
    setSuccessMessage,
  };
};
