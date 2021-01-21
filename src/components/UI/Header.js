import React from 'react';

import './Header.css';

const Header = ({ label, style }) => {
    return (
        <h3 className="Header" style={style}>
            {label}
        </h3>
    );
};

export default Header;
