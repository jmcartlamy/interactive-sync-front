import React from 'react';
import classNames from 'classnames';

import './Header.css';

const Header = ({ label, transparent, style }) => {
    return (
        <h3 className={classNames('Header', { 'Header-transparent': transparent })} style={style}>
            {label}
        </h3>
    );
};

export default Header;
