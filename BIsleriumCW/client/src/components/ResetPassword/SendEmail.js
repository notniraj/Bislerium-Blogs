import React, { useState } from "react";
import axios from "axios"; // Import Axios
import TextInput from "../Common/TextInput";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const SendEmail = () => {
    const [error, setError] = useState("");
    const [newPassword, setNewPassword] = useState();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setNewPassword({
            ...newPassword,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://localhost:7212/api/user-authentication/reset-password');
            setNewPassword();
            toast.success(response);
            navigate("/");
        } catch (error) {
            setError("something went wrong, try agian later");
        }
    };

    return (
        <div className="auth-container">
            <ToastContainer />
            <h2>Reset Password</h2>
            <hr />
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <div>
                    <label>Email:</label>
                    <TextInput
                        type="email"
                        name="email"
                        // value={newPassword.email}
                        onChange={handleChange}
                    />
                </div>
                <hr />
                <button type="submit" className="py-3 btn-adds">
                    Send email
                </button>
            </form>
        </div>
    );
};

export default SendEmail;