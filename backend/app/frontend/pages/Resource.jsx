import { useEffect, useMemo, useRef } from 'react';
import '../components/Industrial';
import { Share } from '../components/Share';

export default function Resource({ resource, version, files }) {
    const viewerRef = useRef(null);

    const versionContents = {};
    for (const file of files) {
        versionContents[file.originFilePath] = { path: file.signedUrl }
    }

    const ShareComponent = useMemo(() =>
        () => Share({resourceId: resource['id'], shareOptions: resource['share_options']}
    ), [resource['id'], resource['share_options']]);

    useEffect(() => {
        if (resource.id) {
            window.viewer.load({
                resource,
                versionContents,
                domElement: viewerRef.current,
                ShareComponent: resource?.permissions?.manage ? ShareComponent : null
            });
        }
    }, [resource.id]);


    return (
        <div id='viewer' ref={viewerRef}/>
    )
}
