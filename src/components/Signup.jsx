import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SHA256 } from 'crypto-js';

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

  const handleFormSubmit = (e) => {
    e.preventDefault();

    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
  
    const storedUsers = localStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      setEmailError('User with this email already exists');
      return;
    }
  
    // Validation for Name
    if (!name ||name.length < 3 || /[^a-zA-Z0-9 ]/.test(name)) {
      setNameError('Invalid name. Name should be at least 3 characters long and contain only letters and numbers.');
      return;
    }    

    // Validation for Email
    const emailRegex = /^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email address. Please enter a valid email.');
      return;
    }

    // Validation for Password
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        'Invalid password. Password should be at least 8 characters long and contain at least one uppercase letter and one digit.'
      );
      return;
    }

    // Validation for Confirm Password
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match. Please enter the same password again.');
      return;
    }
  
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
              onChange={(e) => setName(e.target.value)}
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
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
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
              onChange={(e) => setConfirmPassword(e.target.value)}
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