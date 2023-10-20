import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Progress } from '../components/Progress';
import { ConversionLogs } from '../components/ConversionLogs';
import { useWebsocket } from '../util/useWebsocket';
import Client from '../util/Client';

const STATUSES = {
    finished: 'finished',
    inProgress: 'inProgress',
    failed: 'failed',
    canceled: 'canceled',
    canceling: 'canceling'
}
const resourceUrl = (resourceId) => `/resources/${resourceId}`;
export default function Resource({ conversionTask, resource }) {
    const [ progress, setProgress ] = useState( Math.max(conversionTask.progress, .01) );
    const [ status, setStatus ] = useState(conversionTask.status);
    const [ logs, setLogs ] = useState(null);
    const { operation, record } = useWebsocket('TaskChannel');

    useEffect(() => {
        if (record?.progress) {
            setProgress(record?.progress);
        }
        if (record?.status) {
            setStatus(record?.status);
        }
    }, [ record?.progress, record?.status ]);

    useEffect(() => {
        if (status === STATUSES.finished) {
            setTimeout(() => {
                window.location.href = resourceUrl(conversionTask.meta.dest_resource_id)
            }, 1000);
        }
        if (status === STATUSES.failed) {
            Client.getConversionLogs(conversionTask.id)
                .then(({ data: logs }) => setLogs(logs))
                .catch(({ status }) => {
                    if (status === 404) {
                        return false;
                    }
                });
        }
    }, [status]);

    return (
        <div className='min-h-full'>
            <Header/>
            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    <div className='py-1 flex justify-between'>
                        <span>{ resource.name }</span>
                        <span>{ status }</span>
                    </div>
                    <Progress progress={ progress }/>
                </div>
                { status === STATUSES.failed && <ConversionLogs logs={logs}/>}
            </main>
        </div>
    )
}
