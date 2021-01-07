import { useEffect } from 'react';

export default function useKeydown(code, action, options) {
    useEffect(() => {
        function onKeydown(e) {
            if (e.code === code && !options.disabled) {
                action();
            }
        }
        window.addEventListener('keydown', onKeydown);
        // Remove event listeners on cleanup
        return () => window.removeEventListener('keydown', onKeydown);
    }, [options]); // Empty array ensures that effect is only run on mount and unmount
}
