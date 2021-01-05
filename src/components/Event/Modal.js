import React, { useRef, useState, useCallback } from 'react';
import classNames from 'classnames';
import { useRipple } from 'react-use-ripple';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import cross from '../../assets/img/cross.png';
import setAction from '../../api/setAction';
import Title from '../UI/Title';

import './Modal.css';
import { useBodyScrollLock } from '../../utils/hooks/useBodyScrollLock';

const Modal = ({ modal, action, userCooldown }) => {
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

    // TODO Cooldown on submit when action has been pushed
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
                        React.createElement(Components[type], {
                            ...properties,
                        })
                    )}
                    {action.current.extension.submit && (
                        <button
                            ref={rippleRef}
                            type="button"
                            className="Modal-button"
                            id="modal-button"
                            onClick={sendRequest}
                            disabled={isSending || !modal.isOpen}
                        >
                            {action.current.extension.submit.label}
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default Modal;
