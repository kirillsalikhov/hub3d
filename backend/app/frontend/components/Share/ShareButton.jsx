import React from 'react';

export const ShareButton = ({onClick}) => {
    return (
        <button
            onClick={onClick}
            className="flex-none -ml-px items-center gap-x-1.5 px-3 py-2 text-sm leading-6 bg-blue-800 text-white ring-1 ring-inset ring-blue-800 hover:bg-blue-700"
            aria-hidden="true">
            Share
        </button>
    )
}
