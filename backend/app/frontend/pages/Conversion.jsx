import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Progress, progressTransitionDuration } from '../components/Progress';
import { ConversionLogs } from '../components/ConversionLogs';
import { useWebsocket } from '../util/useWebsocket';
import Client from '../util/Client';
import Layout from '../components/Layout';

const STATUSES = {
    finished: 'finished',
    inProgress: 'inProgress',
    failed: 'failed',
    canceled: 'canceled',
    canceling: 'canceling'
}

const STATUSES_NAMES = {
    finished: 'Finished',
    inProgress: 'Converting',
    failed: 'Failed',
    canceled: 'Canceled',
    canceling: 'Canceling'
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
            }, progressTransitionDuration);
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
        <Layout>
            <div className="mx-auto max-w-7xl px-6 ">
                <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white/40 shadow-2xl shadow-indigo-500">
                    <div className="px-6 py-5 sm:p-6">
                        <div>
                            <h4 className="sr-only">Status</h4>
                            <p className="text-xl font-medium text-blue-950">Converting { resource.name }...</p>
                            <div className="mt-6" aria-hidden="true">
                                <Progress progress={ progress }/>
                                <div className="mt-6 hidden grid-cols-4 text-sm font-medium text-gray-400 sm:grid">
                                    <div className="text-blue-800">{ STATUSES_NAMES[status] } </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-12 sm:mt-16">
                { status === STATUSES.failed && <ConversionLogs logs={logs}/>}
            </div>
        </Layout>
    )
}
