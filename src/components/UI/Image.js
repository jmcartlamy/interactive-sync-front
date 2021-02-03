import React from 'react';

import './Image.css';

const Image = ({ global = {}, props: { src, style } }) => {
    return <img className="Image" src={src} style={style} />;
};

export default Image;
