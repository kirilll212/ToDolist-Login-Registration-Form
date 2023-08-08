export const validateName = (name) => {
  if (!name || name.length < 3 || /[^a-zA-Z0-9 ]/.test(name)) {
    return {
      isValid: false,
      error: 'Invalid name. Name should be at least 3 characters long and contain only letters and numbers.',
    };
  }

  return {
    isValid: true,
    error: '',
  };
};

export const validateEmail = (email) => {
  const emailRegex = /^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z]+$/;

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Invalid email address. Please enter a valid email.',
    };
  }

  return {
    isValid: true,
    error: '',
  };
};

export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;

  if (!passwordRegex.test(password)) {
    return {
      isValid: false,
      error: 'Invalid password. Password should be at least 8 characters long and contain at least one uppercase letter and one digit.',
    };
  }

  return {
    isValid: true,
    error: '',
  };
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Passwords do not match. Please enter the same password again.',
    };
  }

  return {
    isValid: true,
    error: '',
  };
};
