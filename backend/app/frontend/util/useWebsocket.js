import React, { useMemo, useState } from 'react';
import ActionCable from './ActionCable';

export const useWebsocket = (subscriptionOptions) => {
    const [data, setData] = useState({});

    useMemo(() => {
        ActionCable.getConsumer().subscriptions.create(
            subscriptionOptions,
            {
                received: (data) => setData(data)
            }
        )
    }, [subscriptionOptions]);

    return data;
};
