import { useEffect, useMemo, useRef, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Share } from '../components/Share';
import { useModel } from '../models/ModelProvider';
import { isBrowser } from '../util/isBrowser';

export const Resource = () => {
    const { resource, files } = useLoaderData();
    const { resourceViewModel } = useModel();
    const [ isImported, setIsImported ] = useState(false);

    useEffect(() => {
        if (isBrowser()) {
            import('../components/Industrial').then(() => setIsImported(true));
        }
    }, []);

    const viewerRef = useRef(null);

    const versionContents = {};
    for (const file of files) {
        versionContents[file.originFilePath] = { path: file.signedUrl }
    }

    const ShareComponent = useMemo(() =>
        observer(
            () => Share({resourceId: resource['id'], model: resourceViewModel})
        ), [resource['id'], resourceViewModel]
    );

    useEffect(() => {
        if (isImported && resource.id) {
            window.viewer.load({
                resource,
                versionContents,
                domElement: viewerRef.current,
                ShareComponent: resource?.permissions?.manage ? ShareComponent : null
            });
        }
    }, [resource.id, isImported]);

    useEffect(() => {
        if (resource['share_options']) {
            resourceViewModel.setHasLinkPassword(resource['share_options']?.['has_link_password']);
        }
    }, [resource['share_options']])


    return (
        <div id='viewer' ref={viewerRef} />
    )
}
