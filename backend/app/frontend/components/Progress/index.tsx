import React, { useEffect, useRef } from 'react';

export const progressTransitionDuration = 300
export const Progress = ({ progress }: {progress: number}) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.style.transform = `translateX(-${ 100 - 100 * progress }%)`;
        }
    }, [ ref.current, progress ])

    return (
        <div className="mt-6" aria-hidden="true">
            <div className="overflow-hidden rounded-full bg-gray-200 shadow-inner">
                <div
                    className={ `h-4 rounded-full motion-safe:animate-pulse bg-gradient-to-tr from-indigo-600 to-purple-700 transition-transform duration-${ progressTransitionDuration } ease-linear w-full` }
                    style={ { transform: 'translateX(-100%)' } } ref={ ref } />
            </div>
        </div>
    )
}
