import React from 'react';

import './Title.css';

const Title = ({ props: { label, style } }) => {
    return (
        <h3 className="Title" style={style}>
            {label}
        </h3>
    );
};

export default Title;
