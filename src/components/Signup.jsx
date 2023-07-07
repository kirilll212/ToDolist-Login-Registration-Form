import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SHA256 } from 'crypto-js';
import {validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword
} from "./Validation/config"

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

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setNameError(validateName(value).error);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value).error);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value).error);
    setConfirmPasswordError(validateConfirmPassword(value, confirmPassword).error);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
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
          <div className="mb-2">
            <label htmlFor="firstName">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="form-control"
              value={name}
              onChange={handleNameChange}
              />
              {nameError && <p className="text-danger">{nameError}</p>}
          </div>
          <div className="mb-2">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="form-control"
              value={email}
              onChange={handleEmailChange}
              />
              {emailError && <p className="text-danger">{emailError}</p>}
          </div>
          <div className="mb-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="form-control"
              value={password}
              onChange={handlePasswordChange}
              />
              {passwordError && <p className="text-danger">{passwordError}</p>}
          </div>
          <div className="mb-2">
            <label htmlFor="password">Confirm Password</label>
            <input
              type="password"
              placeholder="Enter your password again"
              className="form-control"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              />
          </div>
              {confirmPasswordError && <p className="text-danger">{confirmPasswordError}</p>}
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