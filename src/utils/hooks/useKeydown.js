import { useEffect } from 'react';

export default function useKeydown(code, action) {
    useEffect(() => {
        function onKeydown(e) {
            if (e.code === code) {
                action();
            }
        }
        window.addEventListener('keydown', onKeydown);
        // Remove event listeners on cleanup
        return () => window.removeEventListener('keydown', onKeydown);
    }, []); // Empty array ensures that effect is only run on mount and unmount
}
