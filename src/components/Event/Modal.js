import React, { useRef, useState, useCallback } from 'react';
import { useFormik } from 'formik';
import classNames from 'classnames';
import { useRipple } from 'react-use-ripple';

import cross from '../../assets/img/cross.png';
import setAction from '../../api/setAction';
import Title from '../UI/Title';
import Header from '../UI/Header';
import Input from '../UI/Input';

import './Modal.css';
import { useBodyScrollLock } from '../../utils/hooks/useBodyScrollLock';
import pickMatchedActions from '../../utils/functions/pickMatchedActions';
import useInterval from '../../utils/hooks/useInterval';

const Modal = ({ modal, userCooldown, actions }) => {
    /**
     * Send request on call
     */
    const [isSending, setIsSending] = useState(false);
    const sendRequest = (formikValues) => {
        modal.setIsOpen(false);
        sendRequestCallback(actions.current, formikValues);
    };

    const sendRequestCallback = useCallback(
        async (currentAction, formikValues) => {
            if (isSending) return;
            setIsSending(true);
            await setAction(currentAction, formikValues);
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
    const scheduledTimestamp = actions.current && pickMatchedActions(actions, actions.current.name);
    const countdownRemaining = scheduledTimestamp ? scheduledTimestamp - Date.now() : null;
    const [countdown, setCountdown] = useState(null);
    useInterval(() => {
        if (countdownRemaining > 0) {
            setCountdown(countdownRemaining / 1000);
        } else {
            setCountdown(null);
        }
    }, 100);

    /**
     * Formik form
     */

    const InitialValuesComponents = {
        input: '',
    };

    const initialValues = () =>
        actions.current.extension.components.reduce((acc, { type, name }) => {
            if (typeof InitialValuesComponents[type] !== 'undefined') {
                acc[name] = InitialValuesComponents[type];
            }
            return acc;
        }, {});

    const formik =
        actions.current &&
        actions.current.extension &&
        actions.current.extension.components.length &&
        useFormik({
            initialValues: initialValues(),
            enableReinitialize: true,
            onSubmit: sendRequest,
        });

    /**
     * Render
     */

    const disabled = (countdown && countdown > 0) || isSending || !modal.isOpen;

    const Components = {
        title: Title,
        input: Input,
    };

    return (
        <div
            className={classNames('Modal', {
                'Modal-open': modal.isOpen,
            })}
            ref={modalRef}
        >
            <img className="Modal-close-button" src={cross} onClick={closeModal} />
            {actions.current && actions.current.extension && (
                <form onSubmit={formik.handleSubmit}>
                    {actions.current.extension.title && (
                        <Header label={actions.current.extension.title} />
                    )}
                    {actions.current.extension.components.length &&
                        actions.current.extension.submit && (
                            <div className="Modal-components">
                                {actions.current.extension.components.map(
                                    ({ type, ...properties }) =>
                                        Components[type] &&
                                        React.createElement(Components[type], {
                                            ...properties,
                                            formik,
                                        })
                                )}
                                {actions.current.extension.submit && (
                                    <button
                                        ref={rippleRef}
                                        type="submit"
                                        className="Modal-button"
                                        id="modal-button"
                                        disabled={disabled}
                                    >
                                        {actions.current.extension.submit.label}
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
                            </div>
                        )}
                </form>
            )}
        </div>
    );
};

export default Modal;
