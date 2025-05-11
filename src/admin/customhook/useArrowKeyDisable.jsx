import { useEffect } from 'react';

function useArrowKeyDisable(ref) {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                event.preventDefault();
            }
        };
        const handleWheel = (event) => {
            if (document.activeElement === ref.current) {
                event.preventDefault();
            }
        };

        const inputElement = ref.current;
        if (inputElement) {
            inputElement.addEventListener('keydown', handleKeyDown);
            inputElement.addEventListener('wheel', handleWheel);
        };

        return () => {
            if (inputElement) {
                inputElement.removeEventListener('keydown', handleKeyDown);
                inputElement.removeEventListener('wheel', handleWheel);
            }
        };

    }, []);

}

export default useArrowKeyDisable