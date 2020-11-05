import React, { useState, useRef, useEffect, useCallback } from 'react';
import setAction from '../../api/setAction';
import useInterval from '../../utils/hooks/useInterval';
import withActions from '../../utils/HOCs/withActions';

import './Button.css';

const Button = ({ name, label, scheduledTimestamp, auth, twitch }) => {
    /**
     * Set action on click
     */
    const [isSending, setIsSending] = useState(false);
    const isMounted = useRef(true);
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);
    const [message, setMessage] = useState('');
    const sendRequest = useCallback(async () => {
        if (isSending) return;
        setIsSending(true);
        await setAction(auth, twitch, name, setMessage);
        if (isMounted.current) {
            setIsSending(false);
        }
    }, [isSending]);

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
        <div key={name} className="Button-container">
            <button
                type="button"
                className="Button"
                id={name}
                onClick={sendRequest}
                disabled={countdown && countdown > 0}
            >
                {label}
            </button>
            {countdown && countdown > 0 && (
                <span className="countdown">{countdown.toFixed(1)}</span>
            )}
            {!countdown && message && <span>{message}</span>}
            {isSending && <div className="Button-loader"></div>}
        </div>
    );
};

export default withActions(Button);
