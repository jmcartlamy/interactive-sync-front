import React from 'react';

export default function renderComponents(Components, global, view, direction) {
    return ({ type, ...props }) =>
        Components[type] &&
        React.createElement(Components[type], {
            props,
            global,
            view,
            direction,
        });
}
