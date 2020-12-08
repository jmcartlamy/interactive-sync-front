import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRipple } from 'react-use-ripple';
import setAction from '../../api/setAction';
import useInterval from '../../utils/hooks/useInterval';
import useKeydown from '../../utils/hooks/useKeydown';
import withActions from '../../utils/HOCs/withActions';

import './Button.css';

const Button = ({
    view,
    name,
    label,
    scheduledTimestamp,
    auth,
    twitch,
    userCooldown,
    keyCode,
    direction = 'row',
}) => {
    /**
     * Prepare request
     */
    const [isSending, setIsSending] = useState(false);
    const isMounted = useRef(true);
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);
    const [message, setMessage] = useState('');
    /**
     * Send request on call
     */
    const sendRequest = useCallback(async () => {
        if (isSending) return;
        setIsSending(true);
        await setAction(view, auth, twitch, name, setMessage);
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
     * Set action on keydown
     */
    useKeydown(keyCode, sendRequest);

    /**
     * Countdown before enabling the button again
     */
    const countdownRemaining = scheduledTimestamp ? scheduledTimestamp - Date.now() : null;
    const [countdown, setCountdown] = useState(null);
    useInterval(() => {
        if (countdownRemaining > 0) {
            setCountdown(countdownRemaining / 1000);
        } else {
            setCountdown(null);
        }
    }, 100);

    // TODO message
    const disabled =
        (userCooldown && userCooldown.value) || (countdown && countdown > 0) || isSending;

    return (
        <div key={name} className={`Button-container Button-container-${direction}`}>
            <button
                type="button"
                className="Button"
                ref={rippleRef}
                id={name}
                onClick={sendRequest}
                disabled={disabled}
            >
                {label}
                {disabled && (
                    <div className="Button-overlay">
                        {countdown && countdown > 0 && (
                            <span className="Button-overlay-countdown">{countdown.toFixed(1)}</span>
                        )}
                        {isSending && <div className="Button-overlay-loader"></div>}
                    </div>
                )}
            </button>
        </div>
    );
};

export default withActions(Button);
