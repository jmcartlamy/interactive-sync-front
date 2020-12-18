import React from 'react';
import { enableBodyScroll, disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

export const useBodyScrollLock = (targetElement, modalOpen, bodyScrollOption) => {
    // Fires synchronously after all DOM mutations
    React.useEffect(() => {
        if (!targetElement) {
            return;
        }
        if (modalOpen) {
            disableBodyScroll(targetElement, bodyScrollOption);
        } else {
            enableBodyScroll(targetElement);
        }
        return () => {
            // On cleanup
            clearAllBodyScrollLocks();
        };
    }, [targetElement, modalOpen]);
};
