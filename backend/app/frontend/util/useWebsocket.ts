import { useEffect, useState } from 'react';
import { isBrowser } from './isBrowser';

export const useWebsocket = (subscriptionOptions) => {
    const [ data, setData ] = useState({});
    const [ ActionCable, setActionCable ] = useState(null);

    useEffect(() => {
        if (isBrowser()) {
            import('./ActionCable').then(({default: ActionCable}) => {
                setActionCable(ActionCable);
            })
        }
    }, []);

    useEffect(() => {
        if (ActionCable) {
            ActionCable.getConsumer().subscriptions.create(
                subscriptionOptions,
                {
                    received: (data) => setData(data)
                }
            )
        }
    }, [ActionCable, subscriptionOptions]);

    return data;
};
