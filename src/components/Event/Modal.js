import React, { useRef, useState, useCallback } from 'react';
import { useFormik } from 'formik';
import classNames from 'classnames';
import { useRipple } from 'react-use-ripple';
import * as Yup from 'yup';

import sendInputEvent from '../../api/sendInputEvent';
import Title from '../UI/Title';
import Header from '../UI/Header';
import Input from '../UI/Input';
import Image from '../UI/Image';
import Text from '../UI/Text';
import Select from '../UI/Select';

import { useBodyScrollLock } from '../../utils/hooks/useBodyScrollLock';
import pickMatchedActions from '../../utils/functions/pickMatchedActions';
import useInterval from '../../utils/hooks/useInterval';

import './Modal.css';

const Modal = ({ global }) => {
    const { modal, userCooldown, actions, configUI } = global;
    /**
     * Send request on call
     */
    const { isSending, setIsSending } = actions.current || {};
    const sendRequest = (formikValues) => {
        modal.setIsOpen(false);
        sendRequestCallback(actions.current, formikValues);
    };

    const sendRequestCallback = useCallback(
        async (currentAction, formikValues) => {
            if (isSending) return;
            setIsSending(true);
            await sendInputEvent(global, currentAction, formikValues);
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
    useRipple(rippleRef, { disabled: !configUI.ripple });

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

    const extension = actions.current?.extension;

    const InitialValuesComponents = {
        input: '',
        radio: '',
        checkbox: [],
    };

    const ValidationSchemaComponents = {
        radio: Yup.string().required(),
        checkbox: Yup.array().min(1),
    };

    const initialValues = () =>
        extension.components.reduce((acc, { type, name }) => {
            if (typeof InitialValuesComponents[type] !== 'undefined') {
                acc[name] = InitialValuesComponents[type];
            }
            return acc;
        }, {});

    const ModalSchema = () =>
        Yup.object().shape(
            extension.components.reduce((acc, { type, name }) => {
                if (typeof ValidationSchemaComponents[type] !== 'undefined') {
                    acc[name] = ValidationSchemaComponents[type];
                }
                return acc;
            }, {})
        );

    const formik =
        extension?.components?.length &&
        useFormik({
            initialValues: initialValues(),
            validationSchema: ModalSchema(),
            enableReinitialize: true,
            onSubmit: sendRequest,
        });

    /**
     * Render
     */

    const disabled = (countdown && countdown > 0) || isSending || !modal.isOpen || !formik?.isValid;

    const Components = {
        title: Title,
        input: Input,
        image: Image,
        text: Text,
        radio: Select,
        checkbox: Select,
    };

    return (
        <div
            className={classNames('Modal', {
                'Modal-open': modal.isOpen,
                'Modal-transparent': configUI.transparent,
            })}
            style={extension?.style}
            ref={modalRef}
        >
            <div className="Modal-close-button" onClick={closeModal} />
            {extension && (
                <form onSubmit={formik.handleSubmit}>
                    {extension.title?.label && (
                        <Header
                            label={extension.title.label}
                            style={extension.title.style}
                            transparent={configUI.transparent}
                        />
                    )}
                    {extension.components?.length && extension.submit && (
                        <div className="Modal-components">
                            {extension.components.map(
                                (props) =>
                                    Components[props.type] &&
                                    React.createElement(Components[props.type], {
                                        global,
                                        props,
                                        formik,
                                    })
                            )}
                            <button
                                ref={rippleRef}
                                type="submit"
                                className={classNames('Modal-button', {
                                    'Modal-button-transparent': configUI.transparent,
                                })}
                                id="modal-button"
                                style={extension.submit.style}
                                disabled={disabled}
                            >
                                {extension.submit.label}
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
                        </div>
                    )}
                </form>
            )}
        </div>
    );
};

export default Modal;
