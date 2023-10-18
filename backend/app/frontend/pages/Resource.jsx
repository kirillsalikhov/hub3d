import '../components/Industrial';
import { useEffect, useRef } from 'react';

export default function Resource({ resource, version, files }) {
    const viewerRef = useRef(null);

    const versionContents = {};
    for (const file of files) {
        versionContents[file.originFilePath] = { path: file.signedUrl }
    }

    useEffect(() => {
        window.viewer.load({
            resource,
            versionContents,
            domElement: viewerRef.current
        });
    }, []);


    return (
        <div id='viewer' ref={viewerRef}/>
    )
}
