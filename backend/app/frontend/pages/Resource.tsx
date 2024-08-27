import { useEffect, useMemo, useRef, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Share } from '@/components/Share';
import { useModel } from '../models/ModelProvider';
import { isBrowser } from '../util/isBrowser';
import {AssetFile, ResourceExtended} from "@/util/api-client";

export const ResourcePage = () => {
    const { resource, files } = useLoaderData() as {resource: ResourceExtended, files: AssetFile[]};
    const { resourceViewModel } = useModel();
    const [ isImported, setIsImported ] = useState(false);

    useEffect(() => {
        if (isBrowser()) {
            import('../components/Industrial').then(() => setIsImported(true));
        }
    }, []);

    const viewerRef = useRef(null);

    // TODO probably move to dataLoader
    type VersionContents = {
        [key: string]: {path: string}
    }
    const versionContents: VersionContents = {};
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
            // TODO at least add types from iv, at most add iv app from types
            window.viewer.load({
                resource,
                versionContents,
                domElement: viewerRef.current,
                ShareComponent: resource?.permissions?.manage ? ShareComponent : null
            });
        }
    }, [resource.id, isImported]);

    useEffect(() => {
        if (resource.share_options) {
            resourceViewModel.setHasLinkPassword(resource.share_options?.has_link_password);
        }
    }, [resource.share_options])

    return (
        <div id='viewer' ref={viewerRef} />
    )
}
