import { useEffect, useState } from 'react';
import Client from '../../util/Client';

const initialShareOptions = {
    has_link_password: false,
    link_access: 'view'
}
export const useShareOptions = ({resourceId}) => {
    const [ shareOptions, setShareOptions ] = useState(initialShareOptions);

    useEffect(() => {
        (async () =>  {
            try {
                const response = await Client.getShareOptions(resourceId)
                if (response['data']) {
                    setShareOptions(response['data']);
                } else {
                    throw `no data received: ${response}`;
                }
            } catch(err) {
                console.error(err);
            }
        })()
    }, []);

    return shareOptions;
}
