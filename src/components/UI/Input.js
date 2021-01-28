import React from 'react';
import classNames from 'classnames';

import './Input.css';

const Input = ({ global = {}, props, formik = {} }) => {
    const { label, name, placeholder, style } = props;
    return (
        <div className="Input-container">
            {label && <label for={name}>{label}</label>}
            <input
                type="text"
                id={name}
                name={name}
                className={classNames('Input', {
                    'Input-transparent': global.configUI?.transparent,
                })}
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
