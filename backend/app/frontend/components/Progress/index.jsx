import React, { useEffect, useRef } from 'react';

export const progressTransitionDuration = 300
export const Progress = ({progress}) => {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.style.transform = `translateX(-${100 - 100 * progress}%)`;
        }
    }, [ref.current, progress])

    return (
        <div className="w-full overflow-hidden rounded-full">
            <div className={`h-4 rounded-full bg-blue-800 transition-transform duration-${progressTransitionDuration} ease-linear`} style={{transform: 'translateX(-100%)'}} ref={ref} />
        </div>
    )
}
