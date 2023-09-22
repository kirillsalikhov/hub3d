import React, { useEffect, useRef } from 'react';

export const Progress = ({progress}) => {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.style.transform = `translateX(-${100 - 100 * progress}%)`;
        }
    }, [ref.current, progress])

    return (
        <div className='relative h-4 overflow-hidden rounded-full bg-secondary w-full'>
            <div className='progress h-full w-full flex-1 bg-indigo-500 py-2 transition-transform' style={{transform: 'translateX(-100%)'}} ref={ref}/>
        </div>
    )
}
