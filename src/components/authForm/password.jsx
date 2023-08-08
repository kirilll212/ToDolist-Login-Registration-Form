import React, { useState } from 'react';
import './formStyle.css';
import { Link } from 'react-router-dom';
import { SHA256 } from 'crypto-js';

function Password() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);

      const foundUser = users.find((user) => user.email === email);

      if (foundUser) {
        if (newPassword === confirmPassword) {
          if (
            newPassword.length >= 8 &&
            /[A-Z]/.test(newPassword) &&
            /[0-9]/.test(newPassword)
          ) {
            // Хешування пароля
            const hashedPassword = SHA256(newPassword).toString();

            // Зміна хешованого пароля для користувача
            foundUser.password = hashedPassword;
            localStorage.setItem('users', JSON.stringify(users));
            setSuccessMessage('Password changed successfully');
            setErrorMessage('');
            setEmail('');
            setNewPassword('');
            setConfirmPassword('');
          } else {
            setErrorMessage(
              'Password must be at least 8 characters long and contain at least one uppercase letter and one digit'
            );
            setSuccessMessage('');
          }
        } else {
          setErrorMessage('Passwords do not match');
          setSuccessMessage('');
        }
      } else {
        setErrorMessage('User does not exist');
        setSuccessMessage('');
      }
    } else {
      setErrorMessage('User does not exist');
      setSuccessMessage('');
    }
  };

  return (
    <div className='login-container template d-flex justify-content-center align-items-center vh-100'>
      <div className='login-card form_container p-5 rounded bg-white'>
        <form onSubmit={handleFormSubmit}>
          <h3 className='text-center text-uppercase'>Password Restoring</h3>
          <div className='mb-2'>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              placeholder='Enter your email'
              className='form-control'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='mb-2'>
            <label htmlFor='password'>New Password</label>
            <input
              type='password'
              placeholder='Enter your new password'
              className='form-control'
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className='mb-2'>
            <label htmlFor='confirmPassword'>Confirm New Password</label>
            <input
              type='password'
              placeholder='Enter your new password again :)'
              className='form-control'
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className='d-grid mt-2'>
            <button className='btn btn-primary' type='submit'>
              Confirm
            </button>
          </div>
          {errorMessage && (
            <p className='text-danger'>{errorMessage}</p>
          )}
          {successMessage && (
            <p className='text-success'>{successMessage}</p>
          )}
          <div className='d-grid mt-2'>
            <p className='text-end mt-2'>
              Are you Remember?
              <Link to='/'>
                <i className='bx bx-arrow-back'></i>Go Back
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Password;