﻿import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext'; // Import useAuth hook
import './navbar.css'

const Navbar = () => {
    const { user, isLoggedIn, handleLogout } = useAuth(); // Use useAuth hook to access authentication context
    

    return (
        <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
            <div className="container">
                <Link className="navbar-brand" to="/"><i className="fa-solid fa-blog fa-bounce px-1"></i>Bislerium Blogs</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/"><i className="fa-brands fa-blogger-b mx-1"></i>Blogs</Link>
                        </li>
                        {isLoggedIn ? (
                            <li className="nav-item">
                                <Link className="nav-link" to="/myblogs"><i className="fa-regular fa-pen-to-square mx-1"></i>My Blogs</Link>
                            </li>
                        ) : (
                            null
                        )}
                        {isLoggedIn && user.Role === "Admin" && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin"><i className="fa-solid fa-chart-column mx-1"></i>Dashboard</Link>
                                 </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/registeradmin"><i className="fa-solid fa-user-shield mx-1"></i>Admin Register</Link>
                                </li>
                            </>
                            
                        )}

                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fa-solid fa-list"></i> Blog Sort Categories
                            </a>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                                <Link className="dropdown-item" to="/popularity">Popularity</Link>
                                <Link className="dropdown-item" to="/recency">Recency</Link>
                                <Link className="dropdown-item" to="/random">Random</Link>
                            </div>
                        </li>

                        
                    </ul>
                    <ul className="navbar-nav ml-auto">
                        {isLoggedIn ? (
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="fa fa-user"></i> {user.FirstName} {user.LastName}{/* Access user data from context */}
                                </a>
                                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                                    <Link className="dropdown-item" to="/profile"><i className="fa-solid fa-user-pen mx-1"></i>Profile</Link>
                                    <button className="dropdown-item" style={{ color: "red" }} onClick={handleLogout}><i className="fa-solid fa-arrow-right-from-bracket fa-flip mx-1" style={{ color: "red" }}></i>Logout</button> {/* Use handleLogout from context */}
                                </div>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Signup</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
