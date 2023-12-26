import React from 'react';

export const ConversionLogs = ({ logs }) => {
    return (
        <div className="mx-auto max-w-7xl px-6">
            <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white/40 shadow-2xl shadow-indigo-500 p-6">
                <div className="whitespace-pre-wrap">
                    { JSON.stringify(logs, null, 2) }
                </div>
            </div>
        </div>
    )
}
