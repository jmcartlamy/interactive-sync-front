import React from 'react';

import './Input.css';

const Input = ({ label, name, placeholder, formik = {} }) => {
    return (
        <div className="Input-container">
            <label for={name}>{label}</label>
            <input
                type="text"
                id={name}
                name={name}
                className="Input"
                maxLength="128"
                placeholder={placeholder}
                onChange={formik.handleChange}
                value={formik.values && formik.values[name]}
            />
        </div>
    );
};

export default Input;
