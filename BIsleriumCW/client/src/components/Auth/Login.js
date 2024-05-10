import React, { useState } from 'react';
import { useNavigate, useHistory } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import TextInput from '../Common/TextInput';

const Login = () => {
    const [formData, setFormData] = useState({ userName: '', password: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
    const navigate = useNavigate();
    


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        //console.log("0-0-0-0-0-0-0-0-0-0-0-0-0")

        try {
            const response = await axios.post('https://localhost:7212/api/user-authentication/login', formData);

            if(response.data.Token) {
                // Store the token in local storage
                localStorage.setItem('token', response.data.Token);

                // Reset form data
                setFormData({ userName: '', password: '' });

                // Redirect to the home page or any other page upon successful login

                const decodedToken = JSON.parse(atob(response.data.Token.split('.')[1]));
                
                console.log("New user Role: " + decodedToken);
                if (decodedToken.Role === "Admin") {
                    navigate('/admin');
                }
                else {
                    navigate('/');
                }
                // Reload the page
                window.location.reload();
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            setError('Login failed. Please check your username and password.');
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <hr />
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <div>
                    <label>Username:</label>
                    <TextInput
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <div className="password-input position-relative">
                        <TextInput
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <div className="d-flex mt-3">
                            <i
                                className={`password-toggle-icon ${showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}`}
                                onClick={togglePasswordVisibility}
                                style={{ cursor: 'pointer', font: 'Sans-Serif' }} // Change cursor to pointer on hover
                            ><p className="d-inline-block px-2" style={{ fontFamily:'monospace' }}>Show password</p></i>
                        </div>
                        
                    </div>
                </div>
                <hr />
                <button type="submit" className="py-3 btn-adds">Login</button>
            </form>
        </div>
    );
};

export default Login;
