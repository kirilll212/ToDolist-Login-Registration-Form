import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SHA256 } from 'crypto-js';
import {validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword
} from "./Validation/config"
import { FormInput } from './inputs/formControl';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const { name, email } = JSON.parse(storedUsers);
      setName(name);
      setEmail(email);
    }
  }, []);

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

  const handleFormSubmit = (e) => {
    e.preventDefault();

    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    const nameValidation = validateName(name);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validateConfirmPassword(password, confirmPassword);

    setNameError(nameValidation.error);
    setEmailError(emailValidation.error);
    setPasswordError(passwordValidation.error);
    setConfirmPasswordError(confirmPasswordValidation.error);
  
    const storedUsers = localStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      setEmailError('User with this email already exists');
      return;
    }

    if (
      nameValidation.isValid &&
      emailValidation.isValid &&
      passwordValidation.isValid &&
      confirmPasswordValidation.isValid
    ) {
      const hashedPassword = SHA256(password).toString();
      const newUser = { name, email, password: hashedPassword };
      const updatedUsers = [...users, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    
      const storedUsernames = localStorage.getItem('usernames');
      const usernames = storedUsernames ? JSON.parse(storedUsernames) : [];
      const updatedUsernames = [...usernames, name];
      localStorage.setItem('usernames', JSON.stringify(updatedUsernames));
  
      setSuccessMessage('Registration successful!');
  
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
  };
  
  return (
    <div className="signup template d-flex justify-content-center align-items-center vh-100 bg-info">
      <div className="form_container p-5 rounded bg-white">
        <form onSubmit={handleFormSubmit}>
          <h3 className="text-center">Sign Up</h3>
            <FormInput
                input="text"
                onChange={handleNameChange}
                placeholder="Enter your name"
                error={nameError}
              />

            <FormInput
              input="email"
              name="Email"
              onChange={handleEmailChange}
              error={emailError}
            />

            <FormInput
              input="password"
              name="Password"
              onChange={handlePasswordChange}
              error={passwordError}
            />

            <FormInput
              input="confirmPassword"
              name="Confirm Pass"
              onChange={handleConfirmPasswordChange}
              error={confirmPasswordError}
            />

          <div className="d-grid mt-2">
            <button className="btn btn-primary" type="submit">
              Register
            </button>
            {successMessage && <p className='text-success'>{successMessage}</p>}
          </div>
          <p className="text-end mt-2">
            Already Registered? <Link to="/" className="ms-2">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;