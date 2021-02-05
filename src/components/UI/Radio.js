import React from 'react';
import classNames from 'classnames';

import './Radio.css';

const Radio = ({ global = {}, props, formik = {} }) => {
    const { label, name, template, values, style, styleValues } = props;
    return (
        <div
            className={classNames('Radio', {
                'Radio-transparent': global.configUI?.transparent || template === 'button',
            })}
            style={style}
        >
            {label && (
                <div id={`${name}-group`} className="Radio-label-group">
                    {label}
                </div>
            )}

            <div role="group" aria-labelledby={`${name}-group`}>
                {Object.entries(values).map(([key, value]) => (
                    <div>
                        <input
                            type="radio"
                            className={classNames('Radio-value', {
                                'Radio-value-button': template === 'button',
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
                                'Radio-transparent': global.configUI?.transparent,
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

export default Radio;
