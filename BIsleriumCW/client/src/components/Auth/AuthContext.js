import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Create a new context
const AuthContext = createContext();

// Create a custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to manage authentication state
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if token exists in local storage
        const token = localStorage.getItem('token');
        if (token) {
            // Token exists, set isLoggedIn to true and retrieve user data from token
            setIsLoggedIn(true);
            // Extract user data from token (example code, adjust according to your token structure)
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setUser(decodedToken);
            // Store user data in local storage
            localStorage.setItem('user', JSON.stringify(decodedToken));

        } else {
            // No token found, set isLoggedIn to false
            setIsLoggedIn(false);
            setUser(null);
        }
    }, []);

    const handleLogout = () => {
        // Clear token and user data from local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Set isLoggedIn to false and clear user data
        setIsLoggedIn(false);
        setUser(null);
        navigate('/login');
    };

    // Value object to be provided by the context provider
    const value = {
        user,
        isLoggedIn,
        handleLogout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
