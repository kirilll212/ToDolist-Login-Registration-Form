import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SHA256 } from 'crypto-js';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const hashedPassword = SHA256(password).toString();

      const foundUser = users.find(
        (user) => user.email === email && user.password === hashedPassword
      );

      if (foundUser) {
        localStorage.setItem('loggedInUser', JSON.stringify(foundUser.name));
        navigate('/NewTodoList');
      } else {
        setErrorMessage('Invalid email or password');
      }
    } else {
      setErrorMessage('User does not exist');
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('users');
    if (storedUser) {
      const { email: storedEmail } = JSON.parse(storedUser);
      setEmail(storedEmail);
    }
  }, []);

  return (
    <div className='login template d-flex justify-content-center align-items-center vh-100 bg-info'>
      <div className='form_container p-5 rounded bg-white'>
        <form onSubmit={handleFormSubmit}>
          <h3 className='text-center'>Login</h3>
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
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              placeholder='Enter your password'
              className='form-control'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className='mb-2'>
            <input
              type='checkbox'
              className='custom-control custom-checkbox'
              id='check'
            />
            <label htmlFor='check' className='custom-input-label ms-2'>
              Remember Me!
            </label>
          </div>
          <div className='d-grid mt-2'>
            <button className='btn btn-primary' type='submit'>
              Login
            </button>
            <Link to='/NewTodoList' className='decor text-white'></Link>
          </div>
          <p className='text-end mt-2'>
            <Link to='/password'>Forgot Password?</Link>
            <Link to='/signup' className='ms-2'>
              Sign Up
            </Link>
          </p>
          {errorMessage && (
            <p className='text-danger'>{errorMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;