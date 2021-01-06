import React from 'react';

import './Input.css';

const Input = ({ label, name, placeholder }) => {
    return (
        <div className="Input-container">
            <label for={name}>{label}</label>
            <input type="text" id={name} className="Input" placeholder={placeholder} />
        </div>
    );
};

export default Input;
