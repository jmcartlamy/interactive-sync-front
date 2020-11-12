import React, { useState, useRef, useEffect, useCallback } from 'react';
import setAction from '../../api/setAction';
import useInterval from '../../utils/hooks/useInterval';
import useKeydown from '../../utils/hooks/useKeydown';
import withActions from '../../utils/HOCs/withActions';

import './Button.css';

const Button = ({
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
        await setAction(auth, twitch, name, setMessage);
        userCooldown.set(true, 3000);
        if (isMounted.current) {
            setIsSending(false);
        }
    }, [isSending]);

    /**
     * Set action on keydown
     */
    useKeydown(keyCode, sendRequest);

    /**
     * Countdown before enabling the button again
     */
    const countdownRemaining = scheduledTimestamp ? scheduledTimestamp - Date.now() : null;
    const [countdown, setCountdown] = useState(null);
    if (countdownRemaining > 0) {
        useInterval(
            () => setCountdown(countdownRemaining / 1000), // In sec
            100
        );
    } else {
        setCountdown(null);
    }

    return (
        <div key={name} className={`Button-container Button-container-${direction}`}>
            <button
                type="button"
                className="Button"
                id={name}
                onClick={sendRequest}
                disabled={(userCooldown && userCooldown.value) || (countdown && countdown > 0)}
            >
                {label}
                {!countdown && message && <span>{message}</span>}
                {countdown && countdown > 0 && (
                    <span className="countdown">{countdown.toFixed(1)}</span>
                )}
                {isSending && <div className="Button-loader"></div>}
            </button>
        </div>
    );
};

export default withActions(Button);
