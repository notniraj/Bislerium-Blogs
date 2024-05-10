import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Auth/AuthContext';
import { ToastContainer, toast } from 'react-toastify';

const MyBlogsPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [validated, setValidated] = useState(false); // State to manage form validation
    const { isLoggedIn } = useAuth(); // Assuming you have access to userId from useAuth()

    let userId = null;
    let Token = null;
    if (isLoggedIn) {
        Token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        const userObject = JSON.parse(user);
        userId = userObject.UserId;
    }

    useEffect(() => {
        const fetchUserBlogs = async () => {
            try {
                const headers = {
                    'Authorization': `Bearer ${Token}`,
                    'Content-Type': 'application/json'
                };
                const response = await axios.get(`https://localhost:7212/api/Blog/GetUserBlogs/${userId}`, { headers })
                setBlogs(response.data);
            } catch (error) {
                console.error('Error fetching user blogs:', error);
            }
        };
        if (userId) {
            fetchUserBlogs();
        }
    }, [userId]);

    const handleEditBlog = (blog) => {
        setSelectedBlog(blog);
        setEditMode(true);
    };

    const handleDeleteBlog = async (blogId) => {
        try {
            const headers = {
                'Authorization': `Bearer ${Token}`,
                'Content-Type': 'application/json'
            };
            await axios.put(`https://localhost:7212/api/Blog/ToggleDelete/${blogId}`, null, { headers });
            // Remove the deleted blog from the state
            setBlogs(blogs.filter(blog => blog.blogID !== blogId));
            toast.success('Blog deleted successfully');
            window.location.reload();
        } catch (error) {
            console.error('Error deleting blog:', error);
            alert('Error deleting blog');
        }
    };

    const handleSaveEdit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            try {
                await axios.put(`https://localhost:7212/api/Blog/UpdateBlog/${selectedBlog.BlogID}`, {
                    blogTitle: selectedBlog.BlogTitle,
                    blogDescription: selectedBlog.BlogDescription
                });
                setEditMode(false);
                toast.success('Blog updated successfully');
                window.location.reload();
            } catch (error) {
                console.error('Error updating blog:', error);
                alert('Error updating blog');
            }
        }
        setValidated(true);
    };

    const handleChange = (e) => {
        setSelectedBlog({
            ...selectedBlog,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="container mt-5">
            <h2 className="text-white">My Blogs</h2>
            {blogs.map(blog => (
                <div key={blog.blogID} className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">{blog.BlogTitle}</h5>
                        <hr />
                        <p className="card-text">{blog.BlogDescription}</p>
                        <div className="btn-group gap-3">
                            <button className="btn btn-adds rounded-2" onClick={() => handleEditBlog(blog)}>Edit</button>
                            <button className="btn btn-danger rounded-2" onClick={() => handleDeleteBlog(blog.BlogID)}>Delete</button>
                        </div>
                    </div>
                </div>
            ))}
            <ToastContainer />
            {selectedBlog && (
                <div className={`modal ${editMode ? 'show' : ''}`} style={{ display: editMode ? 'block' : 'none' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form noValidate validated={validated} onSubmit={handleSaveEdit}>
                                <div className="modal-header">
                                    <h5 className="modal-title justify-content-between">Edit Blog {selectedBlog.BlogID}</h5>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label htmlFor="blogTitle">Title:</label>
                                        <input type="text" id="blogTitle" name="BlogTitle" className={`form-control ${validated && !selectedBlog.BlogTitle ? 'is-invalid' : ''}`} value={selectedBlog.BlogTitle} onChange={handleChange} required />
                                        {validated && !selectedBlog.BlogTitle && <div className="invalid-feedback">Please provide a title.</div>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="blogDescription">Description:</label>
                                        <textarea id="blogDescription" name="BlogDescription" className={`form-control ${validated && !selectedBlog.BlogDescription ? 'is-invalid' : ''}`} value={selectedBlog.BlogDescription} onChange={handleChange} required />
                                        {validated && !selectedBlog.BlogDescription && <div className="invalid-feedback">Please provide a description.</div>}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-primary" type="submit">Save</button>
                                    <button className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBlogsPage;
