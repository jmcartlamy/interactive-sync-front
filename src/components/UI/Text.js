import React from 'react';
import classNames from 'classnames';

import './Text.css';

const Text = ({ global = {}, props: { text, style } }) => {
    return (
        <p
            className={classNames('Text', { 'Text-transparent': global.configUI?.transparent })}
            style={style}
        >
            {text}
        </p>
    );
};

export default Text;
