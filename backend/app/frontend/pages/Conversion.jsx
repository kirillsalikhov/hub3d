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
const resourceUrl = (resourceId) => `/resources/${ resourceId }`;
export default function Resource({ conversionTask, resource }) {
    const [ progress, setProgress ] = useState(Math.max(conversionTask.progress, .01));
    const [ status, setStatus ] = useState(conversionTask.status);
    const [ logs, setLogs ] = useState(null);
    const { operation, record } = useWebsocket({ channel: 'TaskChannel', task: conversionTask.id });

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
    }, [ status ]);

    return (
        <Layout>
            <div className="flex h-full flex-col flex-auto">
                <div className="flex flex-col flex-grow place-content-center">
                    <div className="mx-auto w-full max-w-7xl px-6 pb-24 ">
                        <div
                            className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white/80 shadow-2xl shadow-indigo-500">
                            <div className="p-6">
                                <div className="flex max-w-7xl items-center justify-between gap-2 text-xl ">
                                    <p className="text-blue-950 italic truncate">
                                        <span className="font-bold">Converting</span>  { resource.name }...
                                    </p>
                                    <p className="text-gray-400">{ +Number(progress * 100).toFixed(2) }%</p>
                                </div>
                                <Progress progress={ progress } />
                            </div>
                            <div className="px-6 py-4 text-center text-sm text-blue-950">
                                <p className="w-full mx-auto max-w-md items-center justify-center">
                                    You may <span className="font-bold">save this browser link</span> to check it later,
                                    and close the window now. Or log in to get the link in your profile once ready
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-12 sm:mt-16">
                    { status === STATUSES.failed && <ConversionLogs logs={ logs } /> }
                </div>
            </div>
        </Layout>
    )
}
