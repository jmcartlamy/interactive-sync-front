import React, { useState, useRef, useEffect, useCallback } from 'react';
import sendMouseEvent from '../../api/sendMouseEvent';
import useTimeout from '../../utils/hooks/useTimeout';

import './MouseEvent.css';

const MouseEvent = ({ mouseInterface, auth, twitch }) => {
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
            await sendMouseEvent(auth, twitch, params);
            setCooldown(true);
            useTimeout(() => setCooldown(false), item.cooldown);

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

    return <div className="MouseEvent" {...syntheticEvent} />;
};

export default MouseEvent;
