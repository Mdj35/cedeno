import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import classes from './registerPage.module.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');      // State for name
  const [address, setAddress] = useState(''); // State for address
  const navigate = useNavigate();            // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Send registration data to the PHP API using axios
      const response = await axios.post('https://vynceianoani.helioho.st/ced/register.php', {
        username, 
        password, 
        name,    // Sending name to the backend
        address  // Sending address to the backend
      });

      // Handle successful response
      if (response.status === 200) {
        alert('Registration successful');
        navigate('/login'); // Redirect to login page after successful registration
      } else {
        alert(`Registration failed: ${response.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert('Registration failed');
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.details}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)} // Input for name
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)} // Input for address
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Input for username
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Input for password
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} // Input for confirm password
            required
          />
          <button type="submit">Register</button>
        </form>
        <div className={classes.loginPrompt}>
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
}
