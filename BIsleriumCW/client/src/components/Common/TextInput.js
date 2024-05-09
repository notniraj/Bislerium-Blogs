// src/components/Common/TextInput.js
import React from 'react';

const TextInput = ({ label, name, type, value, onChange }) => {
    return (
        <div className="form-group">
            <label>{label}</label>
            <input
                type={type}
                className="form-control"
                name={name}
                value={value}
                onChange={onChange}
                required
            />
        </div>
    );
};

export default TextInput;
