import React from 'react';

export function ValidationMessage({ message }) {
  return <p className="text-danger">{message}</p>;
}

export function validateName(name) {
  if (!name || name.length < 3 || /[^a-zA-Z0-9 ]/.test(name)) {
    return 'Invalid name. Name should be at least 3 characters long and contain only letters and numbers.';
  }
  return '';
}

export function validateEmail(email) {
  const emailRegex = /^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email address. Please enter a valid email.';
  }
  return '';
}

export function validatePassword(password) {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return 'Invalid password. Password should be at least 8 characters long and contain at least one uppercase letter and one digit.';
  }
  return '';
}

export function validateConfirmPassword(password, confirmPassword) {
  if (password !== confirmPassword) {
    return 'Passwords do not match. Please enter the same password again.';
  }
  return '';
}

export function SignupFormValidation({ name, email, password, confirmPassword }) {
  const nameError = validateName(name);
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  const confirmPasswordError = validateConfirmPassword(password, confirmPassword);

  return {
    nameError,
    emailError,
    passwordError,
    confirmPasswordError,
    isValid: !nameError && !emailError && !passwordError && !confirmPasswordError,
  };
}
