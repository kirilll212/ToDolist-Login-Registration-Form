import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SHA256 } from 'crypto-js';
import './formStyle.css';
import { Container, Form, Button, Card } from 'react-bootstrap';

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
    <Container fluid className='d-flex justify-content-center align-items-center vh-100 login-container'>
      <Card className='login-card'>
        <Card.Body>
          <h3 className='text-center text-uppercase mb-4'>Login</h3>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId='formBasicEmail'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId='formBasicPassword' className='mt-3'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <div className='d-grid mt-4'>
              <Button variant='primary' type='submit'>
                Login
              </Button>
            </div>
          </Form>

          {errorMessage && <p className='text-danger mt-3'>{errorMessage}</p>}

          <div className='text-center mt-3'>
            <Link to='/password'>Forgot Password?</Link>
          </div>
          <div className='text-center mt-3'>
            Don't have an account? <Link to='/signup'>Sign Up</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;