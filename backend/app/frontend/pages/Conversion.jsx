import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Progress } from '../components/Progress';
import { ConversionLogs } from '../components/ConversionLogs';
import { useWebsocket } from '../util/useWebsocket';

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
    // TODO Kirill: Probably here should be conversionTask.status as default state
    const [ status, setStatus ] = useState(STATUSES.inProgress);
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
    }, [status]);

    //  TODO fix me, Kirill doesn't know how to hook
    // --- trash start ---
    useEffect(() => {
        if (status !== STATUSES.failed) {
            return;
        }

        const logsUrl = `/api/v1/conversions/${conversionTask.id}/logs`;

        const fetchLogs = async () => {
            const fetchData = await fetch(logsUrl)
                .then((response) => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        // I return 404 status when there is conversionTask but no logs
                        // It could be so for some reason
                        // TODO 1. there is still error in console, I don't know why(
                        // TODO 2. We should use something indication that logs are loaded
                        //  but there is no logs
                        return false;
                    }
                });

            setLogs(fetchData);
        }

        fetchLogs();
    }, [status])
    // --- trash end ---

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
