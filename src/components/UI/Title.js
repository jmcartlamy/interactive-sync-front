import React from 'react';
import classNames from 'classnames';

import './Title.css';

const Title = ({ global = {}, props: { label, style } }) => {
    return (
        <h3
            className={classNames('Title', { 'Title-transparent': global.configUI?.transparent })}
            style={style}
        >
            {label}
        </h3>
    );
};

export default Title;
