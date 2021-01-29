import React, { useState, useRef, useEffect, useCallback } from 'react';
import classNames from 'classnames';

import sendMouseEvent from '../../api/sendMouseEvent';
import useTimeout from '../../utils/hooks/useTimeout';
import pickStyleMouseEvents from '../../utils/functions/pickStyleMouseEvents';

import './MouseEvent.css';

const MouseEvent = ({ mouseInterface, auth, twitch }) => {
    /**
     * Send client coord on mouse event
     */
    const [isSending, setIsSending] = useState({ mousedown: false, mouseup: false });
    const [isCooldown, setCooldown] = useState({ mousedown: false, mouseup: false });
    const isMounted = useRef(true);
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);
    const handleMouse = useCallback(
        async (evt, item) => {
            // To avoid issues when mouseup and mousedown are used, we re-enable when mouseup cooldown is ended
            if (isSending[item.type] || isCooldown[item.type] || isCooldown.mouseup) return;
            const params = {
                type: item.type,
                clientWidth: document.body.clientWidth,
                clientHeight: document.body.clientHeight,
                clientX: evt.clientX,
                clientY: evt.clientY,
            };
            setIsSending({ ...isCooldown, [item.type]: true });

            // Send mouse event
            await sendMouseEvent(auth, twitch, params);

            // If mouseup cooldown is ended, so all cooldown are ended
            setCooldown({ ...isCooldown, [item.type]: true });
            useTimeout(
                () => setCooldown({ mousedown: false, mouseup: false }),
                item.cooldown.duration
            );

            if (isMounted.current) {
                setIsSending({ ...isSending, [item.type]: false });
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

    // TODO Improve mousedown / mouseup with default `onMouseUp` event

    return (
        <div
            className={classNames('MouseEvent', {
                'MouseEvent-cursor-auto':
                    isSending.mouseup ||
                    isCooldown.mouseup ||
                    isSending.mousedown ||
                    isCooldown.mousedown,
            })}
            style={pickStyleMouseEvents(mouseInterface, isSending, isCooldown)}
            {...syntheticEvent}
        />
    );
};

export default MouseEvent;
