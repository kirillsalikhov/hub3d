import React from 'react';

export const ConversionLogs = ({ logs }) => {
    return (
        <section>
            <div className='w-full'>
                <pre>
                    { JSON.stringify(logs, null, 2) }
                </pre>
            </div>
        </section>
    )
}
