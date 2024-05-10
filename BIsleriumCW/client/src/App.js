// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './components/Blogs/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar/Navbar'
import { AuthProvider, useAuth } from './components/Auth/AuthContext';
import ProfilePage from './components/Profile/ProfilePage';
import MyBlogsPage from './components/MyBlogs/MyBlogs';
import PopularityBlogs from './components/Blogs/PopularityBlogs';
import RecencyBlogs from './components/Blogs/RecencyBlogs';
import RandomBlogs from './components/Blogs/RandomBlogs';



const App = () => {
    return (
        <Router>
            <AuthProvider>
                <div className="container p-5 pt-4">
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={<Home />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/popularity" element={<PopularityBlogs />} />
                        <Route path="/myblogs" element={<MyBlogsPage />} />
                        <Route path="/recency" element={<RecencyBlogs />} />
                        <Route path="/random" element={<RandomBlogs />} />
                        
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
};

export default App;
