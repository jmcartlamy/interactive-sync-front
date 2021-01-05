import React, { useRef, useState, useCallback } from 'react';
import classNames from 'classnames';
import { useRipple } from 'react-use-ripple';

import cross from '../../assets/img/cross.png';
import setAction from '../../api/setAction';
import Title from '../UI/Title';

import './Modal.css';
import { useBodyScrollLock } from '../../utils/hooks/useBodyScrollLock';
import pickMatchedActions from '../../utils/functions/pickMatchedActions';
import useInterval from '../../utils/hooks/useInterval';

const Modal = ({ modal, action, userCooldown, actions }) => {
    /**
     * Send request on call
     */
    const [isSending, setIsSending] = useState(false);
    const sendRequest = () => {
        modal.setIsOpen(false);
        sendRequestCallback(action.current);
    };

    const sendRequestCallback = useCallback(
        async (currentAction) => {
            if (isSending) return;
            setIsSending(true);
            await setAction(currentAction);
            userCooldown.set(true, 3000);
            setIsSending(false);
        },
        [isSending]
    );

    /**
     * Close modal
     */
    const closeModal = () => {
        modal.setIsOpen(false);
    };

    /**
     * Ripple on button
     */
    const rippleRef = useRef();
    useRipple(rippleRef);

    /**
     * Body scroll lock on open
     */
    const modalRef = useRef();
    useBodyScrollLock(modalRef.current, modal.isOpen);

    /**
     * Countdown if action has been pushed recently
     */
    const scheduledTimestamp = action.current && pickMatchedActions(actions, action.current.name);
    const countdownRemaining = scheduledTimestamp ? scheduledTimestamp - Date.now() : null;
    const [countdown, setCountdown] = useState(null);
    useInterval(() => {
        if (countdownRemaining > 0) {
            setCountdown(countdownRemaining / 1000);
        } else {
            setCountdown(null);
        }
    }, 100);

    const disabled = (countdown && countdown > 0) || isSending || !modal.isOpen;

    // TODO rename action or actions
    // TODO filter invalid components (Button)
    const Components = {
        title: Title,
    };

    return (
        <div
            className={classNames('Modal', {
                'Modal-open': modal.isOpen,
            })}
            ref={modalRef}
        >
            <img className="Modal-close-button" src={cross} onClick={closeModal} />
            {action.current && (
                <>
                    {action.current.extension.components.map(({ type, ...properties }) =>
                        React.createElement(Components[type], properties)
                    )}
                    {action.current.extension.submit && (
                        <button
                            ref={rippleRef}
                            type="button"
                            className="Modal-button"
                            id="modal-button"
                            onClick={sendRequest}
                            disabled={disabled}
                        >
                            {action.current.extension.submit.label}
                            {disabled && (
                                <div className="Button-overlay">
                                    {countdown && countdown > 0 && (
                                        <span className="Button-overlay-countdown">
                                            {countdown.toFixed(1)}
                                        </span>
                                    )}
                                </div>
                            )}
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default Modal;
