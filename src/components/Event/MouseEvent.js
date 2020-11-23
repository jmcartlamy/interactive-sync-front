import React, { useState, useRef, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import sendMouseEvent from '../../api/sendMouseEvent';
import useTimeout from '../../utils/hooks/useTimeout';

import './MouseEvent.css';

const MouseEvent = ({ mouseInterface, auth, twitch }) => {
    /**
     * Cursor position based on mouse moves
     */
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [visible, setVisible] = useState(false);
    const [expand, setExpand] = useState(false);

    const handleMouseMove = (evt) => {
        evt.persist();
        setPosition({ x: evt.clientX - 10, y: evt.clientY - 10 });
    };
    const handleMouseEnter = () => {
        setVisible(true);
    };
    const handleMouseLeave = () => {
        setVisible(false);
    };

    /**
     * Send client coord on mouse event
     */
    const [isSending, setIsSending] = useState(false);
    const [isCooldown, setCooldown] = useState(false);
    const isMounted = useRef(true);
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);
    const handleMouse = useCallback(
        async (evt, item) => {
            if (isSending || isCooldown) return;
            const params = {
                ...item,
                clientWidth: document.body.clientWidth,
                clientHeight: document.body.clientHeight,
                clientX: evt.clientX,
                clientY: evt.clientY,
            };
            setIsSending(true);
            setExpand(true);
            await sendMouseEvent(auth, twitch, params);
            setCooldown(true);
            useTimeout(() => setCooldown(false), item.cooldown);
            useTimeout(() => setExpand(false), item.cooldown);

            if (isMounted.current) {
                setIsSending(false);
            }
        },
        [isSending, isCooldown]
    );

    /**
     * Set synthetic events following the mouseInterface
     */
    const mouseEvents = {
        mousedown: 'onMouseDown',
        mouseup: 'onMouseUp',
    };

    const syntheticEvent = mouseInterface.reduce((acc, item) => {
        return {
            ...acc,
            [mouseEvents[item.type]]: (evt) => handleMouse(evt, item),
        };
    }, {});

    return (
        <div
            className="MouseEvent"
            {...syntheticEvent}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className={classNames('MouseEvent-cursor', {
                    'MouseEvent-cursor-hidden': !visible,
                    'MouseEvent-cursor-expand': expand,
                })}
                style={{
                    left: position.x + 'px',
                    top: position.y + 'px',
                }}
            />
        </div>
    );
};

export default MouseEvent;
