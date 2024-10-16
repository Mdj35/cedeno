import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Profile() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    const username = localStorage.getItem('user'); // Fetch username from localStorage
    if (!username) {
      navigate('/login'); // Redirect if username is missing
    } else {
      const fetchProfileData = async () => {
        try {
          // API call to get the profile data using the username
          const response = await axios.get('https://vynceianoani.helioho.st/cedeno/getProfile.php', {
            params: { username }, // Pass username as query parameter
          });
          setName(response.data.name); // Set name from response
          setAddress(response.data.address); // Set address from response
        } catch (error) {
          console.error('Error fetching profile data:', error);
          alert('Failed to fetch profile data. Please log in again.');
          navigate('/login'); // Redirect to login if error occurs
        }
      };
      fetchProfileData(); // Call the function to fetch data
    }
  }, [navigate]);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault(); // Prevent form submission

    const username = localStorage.getItem('user'); // Get the username from localStorage

    try {
      // API call to update the profile using the username
      const response = await axios.put('https://vynceianoani.helioho.st/cedeno/updateProfile.php', {
        username, // Pass username as part of the data
        name, // Send name from state
        address, // Send address from state
      });

      // Handle success response
      alert(response.data); // Display success message
    } catch (error) {
      console.error('Error updating profile:', error);
      // Display error message
      alert(`Failed to update profile: ${error.response?.data || 'Unknown error occurred'}`);
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      <form onSubmit={handleProfileUpdate}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}
