import React, { useMemo, useState } from 'react';
import ActionCable from './ActionCable';

export const useWebsocket = (channelName) => {
    const [data, setData] = useState({});

    useMemo(() => {
        ActionCable.getConsumer().subscriptions.create(
            channelName,
            {
                received: (data) => setData(data)
            }
        )
    }, [channelName]);

    return data;
};
