import React from 'react';
import classNames from 'classnames';

import './Select.css';

const Select = ({ global = {}, props, formik = {} }) => {
    const { type, label, name, template, values, style, styleValues } = props;
    return (
        <div
            className={classNames('Select', {
                'Select-transparent': global.configUI?.transparent || template === 'button',
            })}
            style={style}
        >
            {label && (
                <div id={`${name}-group`} className="Select-label-group">
                    {label}
                </div>
            )}

            <div role="group" aria-labelledby={`${name}-group`}>
                {Object.entries(values).map(([key, value]) => (
                    <div>
                        <input
                            type={type}
                            className={classNames('Select-value', {
                                'Select-value-button': template === 'button',
                            })}
                            id={`${name}-${key}`}
                            name={name}
                            value={key}
                            style={template === 'classic' && styleValues}
                            onChange={formik.handleChange}
                        />
                        <label
                            for={`${name}-${key}`}
                            className={classNames({
                                'Select-transparent': global.configUI?.transparent,
                            })}
                            style={template === 'button' && styleValues}
                        >
                            {value}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Select;
