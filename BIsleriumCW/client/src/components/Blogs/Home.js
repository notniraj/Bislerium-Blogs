import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Auth/AuthContext';
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
    // State variables for editing comments
    const [isEditingComment, setIsEditingComment] = useState(false);
    const [editedCommentText, setEditedCommentText] = useState('');
    const [editedCommentId, setEditedCommentId] = useState(null);
    const { isLoggedIn } = useAuth();

    let userId = null;
    if (isLoggedIn) {        
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
                    console.log(blog.Comments);
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
            window.location.reload();
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
            const response = await axios.post(`https://localhost:7212/api/Blog/${blogId}/upvote`, null, {
                params: {
                    UserId: userId
                }
            });
            // Update the upvote count after successful upvote
            const upvoteCountResponse = await axios.get(`https://localhost:7212/api/Blog/${blogId}/upvoteCount`);
            const updatedBlogs = blogs.map(blog => {
                if (blog.BlogID === blogId) {
                    return { ...blog, UpVote: upvoteCountResponse.data };
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
            const response = await axios.post(`https://localhost:7212/api/Blog/${blogId}/downvote`, null, {
                params: {
                    UserId: userId
                }
            });
            // Update the downvote count after successful downvote
            const downvoteCountResponse = await axios.get(`https://localhost:7212/api/Blog/${blogId}/downvoteCount`);
            const updatedBlogs = blogs.map(blog => {
                if (blog.BlogID === blogId) {
                    return { ...blog, DownVote: downvoteCountResponse.data };
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

    const handleUpvoteComment = async (commentId) => {
        try {
            await axios.post(`https://localhost:7212/api/Comment/${commentId}/upvote`, null, {
                params: {
                    UserId: userId
                }
            });
            // Update the upvote count after successful upvote
            const upvoteCountResponse = await axios.get(`https://localhost:7212/api/Comment/${commentId}/upvoteCount`);
            const updatedBlogs = blogs.map(blog => {
                const updatedComments = blog.Comments.map(comment => {
                    if (comment.CommentId === commentId) {
                        return { ...comment, UpVote: upvoteCountResponse.data };
                    }
                    return comment;
                });
                return { ...blog, Comments: updatedComments };
            });
            setBlogs(updatedBlogs);
            console.log(blogs);
            toast.success('Upvoted successfully');
        } catch (error) {
            console.error('Error upvoting comment:', error);
            toast.error('Error upvoting comment');
        }
    };

    const handleDownvoteComment = async (commentId) => {
        try {
            await axios.post(`https://localhost:7212/api/Comment/${commentId}/downvote`, null, {
                params: {
                    UserId: userId
                }
            });
            // Update the downvote count after successful downvote
            const downvoteCountResponse = await axios.get(`https://localhost:7212/api/Comment/${commentId}/downvoteCount`);
            const updatedBlogs = blogs.map(blog => {
                const updatedComments = blog.Comments.map(comment => {
                    if (comment.CommentId === commentId) {
                        return { ...comment, DownVote: downvoteCountResponse.data };
                    }
                    return comment;
                });
                return { ...blog, Comments: updatedComments };
            });
            setBlogs(updatedBlogs);
            toast.success('Downvoted successfully');
        } catch (error) {
            console.error('Error downvoting comment:', error);
            toast.error('Error downvoting comment');
        }
    };

    
    // Function to handle editing comment
    const handleEditComment = async (commentId) => {
        // Find the comment by its ID
        const commentToEdit = blogs.flatMap(blog => blog.Comments).find(comment => comment.CommentId === commentId);
        // Set the edited comment text and ID
        setEditedCommentText(commentToEdit.Comments);
        setEditedCommentId(commentId);
        setIsEditingComment(true);
    };

    // Function to handle updating the edited comment
    const handleUpdateComment = async (BlogId) => {
        try {
            await axios.put(`https://localhost:7212/api/Comment/UpdateComment/${editedCommentId}`, {
                UserId: userId,
                comments: editedCommentText,
                blogId: BlogId
            });
            // Refresh the page or update the comments state to reflect the changes
            window.location.reload();
        } catch (error) {
            console.error('Error updating comment:', error);
            toast.error('Error updating comment');
        }
        setIsEditingComment(false);
        setEditedCommentText('');
        setEditedCommentId(null);
    };

    // Function to handle deleting comment
    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await axios.delete(`https://localhost:7212/api/Comment/DeleteComment/${commentId}`);
                // Refresh the page or update the comments state to reflect the changes
                window.location.reload();
            } catch (error) {
                console.error('Error deleting comment:', error);
                toast.error('Error deleting comment');
            }
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
                        <h1 className="card-title">{blog.BlogTitle}</h1>
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
                                <small className="me-2"><strong>Author: </strong>{blog.UserName}</small>
                                <small><strong>Published: </strong>{new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(blog.CreatedAt))}</small>
                            </div>
                        </div>
                        <hr className="text-white" />
                        <h4>Comments</h4>
                        {blog.Comments && blog.Comments.map(comment => (
                            <div key={comment.CommentId} className="mb-3">
                                <div>
                                    <span className="mx-2">
                                        {new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(comment.CreatedAt))}
                                    </span>
                                    <span><strong>{comment.User.UserName}: </strong>{comment.Comments}</span>
                                    <div>
                                        {isLoggedIn && (
                                            <div className="d-flex">
                                                <button className="btn btn-light me-2 rounded-5" style={{ width: "42px", height: "35px" }} onClick={() => handleUpvoteComment(comment.CommentId)}>
                                                    <i class="fa-solid fa-heart"></i>{comment.UpVote}
                                                </button>
                                                <button className="btn btn-danger rounded-5" style={{ width: "42px", height: "35px" }} onClick={() => handleDownvoteComment(comment.CommentId)}>
                                                    <i className="fa-regular fa-thumbs-down"></i> {comment.DownVote}
                                                </button>
                                                {comment.User.UserId === userId && (
                                                    <>
                                                        <button className="btn btn-primary ms-2" style={{ width: "42px", height: "35px" }} onClick={() => handleEditComment(comment.CommentId)}><i class="fa-regular fa-pen-to-square"></i></button>
                                                        <button className="btn btn-danger ms-2" style={{ width: "42px", height: "35px" }} onClick={() => handleDeleteComment(comment.CommentId)}><i class="fa-solid fa-trash-can"></i></button>

                                                        {comment.CommentId === editedCommentId && (
                                                            <div className="mb-3">
                                                                <textarea
                                                                    className="form-control"
                                                                    value={editedCommentText}
                                                                    onChange={(e) => setEditedCommentText(e.target.value)}
                                                                ></textarea>
                                                                <button className="btn btn-primary mt-2" onClick={() => handleUpdateComment(blog.BlogID)}>Update Comment</button>
                                                            </div>
                                                        )}
                                                    </>

                                                )}


                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <hr className="text-white" />
                        {isLoggedIn && (
                            <button className="btn btn-adds my-4 w-25" onClick={() => toggleCommentModal(blog.BlogID)}> <i class="fa-regular fa-comment mx-2"></i>Add Comment</button>
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
