import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './Auth/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
    const [blogs, setBlogs] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [currentBlogId, setCurrentBlogId] = useState(null);
    const [blogTitle, setBlogTitle] = useState('');
    const [blogDescription, setBlogDescription] = useState('');
    const [blogImageUrl, setBlogImageUrl] = useState('');
    const [showBlogModal, setShowBlogModal] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const { isLoggedIn } = useAuth();

    if (isLoggedIn) {
        var userId = null;
        const user = localStorage.getItem('user');
        const userObject = JSON.parse(user);
        userId = userObject.UserId;
    }

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('https://localhost:7212/api/Blog/ListActiveBlogs');
                const fetchedBlogs = response.data;
                const blogsWithComments = await Promise.all(fetchedBlogs.map(async (blog) => {
                    const commentsResponse = await axios.get(`https://localhost:7212/api/Comment/GetCommentsByBlogId/${blog.BlogID}`);
                    blog.Comments = commentsResponse.data;
                    return blog;
                }));
                setBlogs(blogsWithComments);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };
        fetchBlogs();
    }, []);

    const toggleBlogModal = () => {
        setShowBlogModal(!showBlogModal);
    };

    const toggleCommentModal = (blogId) => {
        setShowCommentModal(!showCommentModal);
        setCurrentBlogId(blogId);
    };

    const handleBlogSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('https://localhost:7212/api/Blog', {
                blogTitle: blogTitle,
                blogDescription: blogDescription,
                blogImageUrl: blogImageUrl,
                userId: userId
            });
            console.log(response);
            console.log('Blog added successfully:', response.data);
            toast.success('Blog added successfully');
            // Refresh the page or update the blogs state to display the new blog
            setBlogs([...blogs, response.data]); // Add the newly created blog to the list
        } catch (error) {
            console.error('Error adding blog:', error);
            toast.error('Error adding blog');
        }
        setBlogTitle('');
        setBlogDescription('');
        setBlogImageUrl('');
        toggleBlogModal();
    };

    const handleCommentSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('https://localhost:7212/api/Comment/CreateComment', {
                comments: commentText,
                blogId: currentBlogId,
                userId: userId
            });
            console.log(response)
            console.log('Comment submitted successfully:', response.data);
            toast.success('Comment added successfully');
            // Refresh the page or update the comments state to display the new comment
        } catch (error) {
            console.error('Error submitting comment:', error);
            toast.error('Error adding comment');
        }
        setCommentText(''); // Clear the comment text input
        toggleCommentModal(); // Close the modal after submitting the comment
    };

    const handleUpvote = async (blogId) => {
        try {
            const response = await axios.put(`https://localhost:7212/api/Blog/Upvote/${blogId}`);
            const updatedBlogs = blogs.map(blog => {
                if (blog.BlogID === blogId) {
                    return { ...blog, UpVote: response.data.UpVote };
                }
                return blog;
            });
            setBlogs(updatedBlogs);
            toast.success('Upvoted successfully');
        } catch (error) {
            console.error('Error upvoting:', error);
            toast.error('Error upvoting');
        }
    };

    const handleDownvote = async (blogId) => {
        try {
            const response = await axios.put(`https://localhost:7212/api/Blog/Downvote/${blogId}`);
            const updatedBlogs = blogs.map(blog => {
                if (blog.BlogID === blogId) {
                    return { ...blog, DownVote: response.data.DownVote };
                }
                return blog;
            });
            setBlogs(updatedBlogs);
            toast.success('Downvoted successfully');
        } catch (error) {
            console.error('Error downvoting:', error);
            toast.error('Error downvoting');
        }
    };

    return (
        <div className="container blog-container">
            <h1 className="mt-5 mb-4 text-white">Welcome to Bislerium Blogs</h1>
            {/* Add Blog Button */}
            {isLoggedIn && (
                <button className="btn btn-adds w-25" onClick={toggleBlogModal}>Add Blog</button>
            )}
            <hr className="text-white" />
            {blogs.map(blog => (
                <div key={blog.BlogID} className="card mb-4">
                    <div className="card-body">
                        <h2 className="card-title">{blog.BlogTitle}</h2>
                        <p className="card-text">{blog.BlogDescription}</p>
                        {blog.images && blog.images.map(image => (
                            <img key={image.id} src={image.BlogImageUrl} alt={image.alt} className="img-fluid mb-3" />
                        ))}
                        <div className="d-flex justify-content-between align-items-center">
                            {isLoggedIn && (
                                <div className="d-flex">
                                    <button className="btn btn-light me-2" onClick={() => handleUpvote(blog.BlogID)}>
                                        <i className="fa-regular fa-thumbs-up"></i> {blog.UpVote}
                                    </button>
                                    <button className="btn btn-danger" onClick={() => handleDownvote(blog.BlogID)}>
                                        <i className="fa-regular fa-thumbs-down"></i> {blog.DownVote}
                                    </button>
                                </div>
                            )}
                            <div>
                                <small className="me-2">Author: {blog.User.UserName}</small>
                                <small>Published: {new Date(blog.CreatedAt).toLocaleDateString()}</small>
                            </div>
                        </div>
                        <hr />
                        <h4>Comments</h4>
                        {blog.Comments && blog.Comments.map(comment => (
                            <div key={comment.CommentId} className="mb-3">
                                <strong>{comment.User.UserName}:</strong> {comment.Comments}
                            </div>
                        ))}
                        {isLoggedIn && (
                            <button className="btn btn-adds w-25 justify-content-end" onClick={() => toggleCommentModal(blog.BlogID)}>Add Comment</button>
                        )}
                    </div>
                </div>
            ))}
            <ToastContainer />
            {showCommentModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Comment</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={toggleCommentModal}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleCommentSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="commentTextarea" className="form-label">Comment</label>
                                        <textarea
                                            className="form-control"
                                            id="commentTextarea"
                                            rows="3"
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showCommentModal && <div className="modal-backdrop fade show"></div>}

            {/* Add Blog Modal */}
            {showBlogModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Blog</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={toggleBlogModal}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleBlogSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="blogTitleInput" className="form-label">Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="blogTitleInput"
                                            value={blogTitle}
                                            onChange={(e) => setBlogTitle(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="blogDescriptionInput" className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            id="blogDescriptionInput"
                                            rows="3"
                                            value={blogDescription}
                                            onChange={(e) => setBlogDescription(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="blogImageUrlInput" className="form-label">Image URL</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="blogImageUrlInput"
                                            value={blogImageUrl}
                                            onChange={(e) => setBlogImageUrl(e.target.value)}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showBlogModal && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};

export default Home;
