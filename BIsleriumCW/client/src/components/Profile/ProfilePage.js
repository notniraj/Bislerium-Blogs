import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Auth/AuthContext';
import { ToastContainer, toast } from 'react-toastify';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const { isLoggedIn, handleLogout } = useAuth();

    let userId = null;
    if (isLoggedIn) {
        const userData = localStorage.getItem('user');
        userId = JSON.parse(userData)?.UserId;
    }

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        password: '',
        email: '',
        phoneNumber: '',
        role: 'Blogger',
        newPassword: '',
        oldPassword: ''
    });

    useEffect(() => {
        // Fetch user information
        const fetchUser = async () => {
            try {
                const response = await axios.get(`https://localhost:7212/api/User/GetUser/${userId}`);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        if (userId) {
            fetchUser();
        }
    }, [userId]);

    const handleEditClick = () => {
        setFormData({
            firstName: user?.FirstName,
            lastName: user?.LastName,
            userName: user?.UserName,
            email: user?.Email,
            phoneNumber: user?.PhoneNumber,
            role: user?.Role
        });
        setEditMode(true);
    };

    const handleSaveClick = async () => {
        try {
            const response = await axios.put(`https://localhost:7212/api/User/UpdateUser/${userId}`, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                userName: formData.userName,
                email: formData.email,
                phoneNumber: formData.phoneNumber
            });
            setUser(response.data);
            setEditMode(false);
            toast.success('User info updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Error updating profile');
        }
    };

    const handleChangePassword = async () => {
        try {
            console.log(formData.oldPassword);
            console.log(formData.newPassword);
            const response = await axios.post('https://localhost:7212/api/user-authentication/change-password', {
                    UserId: userId,
                    currentPassword: formData.oldPassword,
                    newPassword: formData.newPassword
                
            });
            console.log(response);
            toast.success(response.data);
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error('Error changing password');
        }
    };

    const handleDeleteProfile = async () => {
        try {
            
            const response = await axios.delete('https://localhost:7212/api/User/DeleteUser', {
                UserId: userId
            });
            toast.success(response);
            handleLogout();
            // Redirect to login page or perform other actions after deletion
        } catch (error) {
            console.error('Error deleting profile:', error);
            alert('Error deleting profile');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="container mt-5">
            <div className="row d-flex">
                <div className="col-md-6">
                    {user && (
                        <div>
                            <h2 className="w-25">Profile</h2>
                            <hr className="text-white" />
                            <div className="mb-3">
                                <strong>First Name:</strong> {user.FirstName}
                            </div>
                            <div className="mb-3">
                                <strong>Last Name:</strong> {user.LastName}
                            </div>
                            <div className="mb-3">
                                <strong>Username:</strong> {user.UserName}
                            </div>
                            <div className="mb-3">
                                <strong>Email:</strong> {user.Email}
                            </div>
                            <div className="mb-3">
                                <strong>Phone Number:</strong> {user.PhoneNumber}
                            </div>
                        </div>
                    )}
                    <ToastContainer />
                    {editMode ? (
                        <div>
                            <hr className="text-white" />
                            <div className="form-group">
                                <label htmlFor="firstName" className="text-white">First Name:</label>
                                <input type="text" name="firstName" id="firstName" className="form-control" value={formData.firstName} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName" className="text-white">Last Name:</label>
                                <input type="text" name="lastName" id="lastName" className="form-control" value={formData.lastName} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="userName" className="text-white">Username:</label>
                                <input type="text" name="userName" id="userName" className="form-control" value={formData.userName} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email" className="text-white">Email:</label>
                                <input type="email" name="email" id="email" className="form-control" value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phoneNumber" className="text-white">Phone Number:</label>
                                <input type="text" name="phoneNumber" id="phoneNumber" className="form-control" value={formData.phoneNumber} onChange={handleChange} />
                            </div>
                            <button className="btn btn-primary my-3" onClick={handleSaveClick}>Save</button>
                            <button className="btn btn-danger" onClick={() => setEditMode(false)}>Cancel</button>
                        </div>


                    ) : (
                        <button className="btn btn-primary" onClick={handleEditClick}>Edit</button>
                    )}
                </div>
                <div className="col-md-6 d-flex flex-column gap-5">
                    <div className="d-flex flex-column gap-4">
                        <h3>Change Password</h3>
                        <input type="password" name="oldPassword" className="form-control mb-2" placeholder="Old Password" value={formData.oldPassword} onChange={handleChange} />
                        <input type="password" name="newPassword" className="form-control mb-2" placeholder="New Password" value={formData.newPassword} onChange={handleChange} />
                        <button className="btn btn-primary w-50" onClick={handleChangePassword}>Change Password</button>
                    </div>
                    <hr className="text-white"/>
                    <div className="mb-3">
                        <h3>Delete Profile</h3>
                        <p className="text-danger">Are you sure you want to delete your profile?</p>
                        <button className="btn btn-danger w-25" onClick={handleDeleteProfile}>Delete Profile</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
