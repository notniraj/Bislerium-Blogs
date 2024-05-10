import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TextInput from '../Common/TextInput';

const RegisterAdmin = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        password: '',
        email: '',
        phoneNumber: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Make a POST request to the registration endpoint
            const response = await axios.post('https://localhost:7212/api/Admin/RegisterAdmin', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                userName: formData.userName,
                password: formData.password,
                email: formData.email,
                phoneNumber: formData.phoneNumber
            });
            console.log(response.status)
            // Check if registration was successful
            if (response.status === 201) {
                // Reset form data
                setFormData({
                    firstName: '',
                    lastName: '',
                    userName: '',
                    password: '',
                    email: '',
                    phoneNumber: ''
                });
                // Show success message
                alert('Registration successful! You can now log in.');
                // Redirect to the login page
                navigate('/login');
            } else {
                throw new Error('Registration failed');
            }
        } catch (error) {
            console.error(error.response);
            // Handle registration failure
            setError('Registration failed. Please try again later.');
        }
    };

    return (
        <div className="auth-container">
            <h2>Admin Registration</h2>
            <hr />
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <TextInput
                    label="First Name"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                />
                <TextInput
                    label="Last Name"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                />
                <TextInput
                    label="Username"
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                />
                <TextInput
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <TextInput
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <TextInput
                    label="Phone Number"
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                />
                <hr />
                <button type="submit" className="btn-adds py-3 mt-4">Register</button>
            </form>
        </div>
    );
};

export default RegisterAdmin;
