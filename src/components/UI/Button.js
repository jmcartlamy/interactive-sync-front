import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRipple } from 'react-use-ripple';
import sendInputEvent from '../../api/sendInputEvent';
import pickMatchedActions from '../../utils/functions/pickMatchedActions';
import useInterval from '../../utils/hooks/useInterval';
import useKeydown from '../../utils/hooks/useKeydown';

import './Button.css';

const Button = ({ global, props, view, direction = 'row' }) => {
    const { actions, userCooldown, modal } = global;
    const { name, label, keyCode, extension, style, cooldown } = props;

    /**
     * On Unmount
     */
    const isMounted = useRef(true);
    useEffect(() => {
        return () => {
            isMounted.current = false;
            if (modal) {
                modal.setIsOpen(false);
                actions.setCurrent(null);
            }
        };
    }, []);

    /**
     * Send request on call
     */
    const [isSending, setIsSending] = useState(false);
    const [message, setMessage] = useState('');

    const sendRequest = () => {
        if (modal.isOpen) {
            modal.setIsOpen(false);
        }
        sendRequestCallback();
    };

    const sendRequestCallback = useCallback(async () => {
        if (isSending) return;
        setIsSending(true);
        await sendInputEvent(global, { ...props, view, setMessage });
        userCooldown.set(true, 3000);
        if (isMounted.current) {
            setIsSending(false);
        }
    }, [isSending]);

    /**
     * Ripple on button
     */
    const rippleRef = useRef();
    useRipple(rippleRef);

    /**
     * Open modal
     */
    const openModal = () => {
        modal.setIsOpen(true);
        actions.setCurrent({ ...props, view, setMessage });
    };

    /**
     * Countdown before enabling the button again
     */
    const scheduledTimestamp = pickMatchedActions(actions, name);
    const countdownRemaining = scheduledTimestamp ? scheduledTimestamp - Date.now() : null;
    const [countdown, setCountdown] = useState(null);
    useInterval(() => {
        if (countdownRemaining > 0) {
            setCountdown(countdownRemaining / 1000);
        } else {
            setCountdown(null);
        }
    }, 100);

    const disabled = userCooldown?.value || (countdown && countdown > 0) || isSending;

    const hasExtension = extension?.components?.length;
    const buttonOnClick = hasExtension ? openModal : sendRequest;

    /**
     * Set action on keydown
     */
    if (keyCode) {
        useKeydown(keyCode, buttonOnClick, { disabled });
    }

    return (
        <div key={name} className={`Button-container Button-container-${direction}`}>
            <button
                type="button"
                className="Button"
                ref={rippleRef}
                id={name}
                onClick={buttonOnClick}
                disabled={disabled}
                style={style}
            >
                <span className="Button-label">{label}</span>
                {disabled && (
                    <div className="Button-overlay" style={cooldown?.style}>
                        {countdown && countdown > 0 && (
                            <span className="Button-overlay-countdown">{countdown.toFixed(1)}</span>
                        )}
                        {isSending && (
                            <div className="Button-overlay-container-loader">
                                <div className="Button-overlay-loader"></div>
                            </div>
                        )}
                    </div>
                )}
            </button>
        </div>
    );
};

export default Button;
