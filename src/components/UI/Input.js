import React from 'react';

import './Input.css';

const Input = ({ props, formik = {} }) => {
    const { label, name, placeholder, style } = props;

    return (
        <div className="Input-container">
            {label && <label for={name}>{label}</label>}
            <input
                type="text"
                id={name}
                name={name}
                className="Input"
                style={style}
                maxLength="128"
                placeholder={placeholder}
                onChange={formik.handleChange}
                value={formik.values && formik.values[name]}
            />
        </div>
    );
};

export default Input;
