import {useCallback, useEffect, useReducer, useState} from "react";
import Client from '../../util/Client';

const statusColor = (() => {
    const _c = (color) => `bg-${color}-100`;
    const _statusIdx = {
        'pending': _c('gray'),
        'in_progress': _c('blue'),
        'ready': _c('green'),
        'failed': _c('red'),
        'canceled': _c('pink')
    }

    return (status) => _statusIdx[status];
})();

const VersionItem = ({version, isCurrent, setCurrentAction}) => {
    return (
        <div className="px-2 py-1 mt-2 flex gap-2 justify-between rounded bg-slate-300">
            <div className="flex gap-2">
                <div>{new Date(version.created_at).toLocaleString()}</div>
                <div className={`px-2 rounded ${statusColor(version.status)}`}>{version.status}</div>
            </div>
            <div>
                {isCurrent ?
                    <div className="px-2 bg-slate-400 rounded">is Current</div>:
                    <div className="px-2 bg-indigo-400 rounded cursor-pointer"
                         onClick={()=> setCurrentAction(version.id)}>
                        Make current
                    </div>
                }
            </div>
        </div>
    )
}

const useApiCall = (apiCall) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        (async () => {
            const {data} = await apiCall();
            setData(data);
            setLoading(false);
        })();
    }, []);

    return { data, loading };
}

export const VersionList = ({resource}) => {
    const {data, loading } = useApiCall(() => Client.getResourceVersions(resource.id))
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const versions = data ?? [];

    const setCurrentHandler = useCallback(async (versionId) => {
        try {
            const res = await Client.setResourceCurrent(resource.id, {current_id: versionId});
            const {current_id} = res.data;
            // NOTE don't do this way !!!
            resource.current_id = current_id;
            forceUpdate();
        } catch (error) {
            // TODO for Marina: actually no error check
            console.log(error);
            throw error;
        }
    }, [resource.id]);

    return (
        <div className="p-2 rounded-b-lg bg-slate-200">
            Version List
            {loading && <div>Loading...</div>}
            {versions.map(v => <VersionItem
                version = {v}
                key = {v.id}
                setCurrentAction = {setCurrentHandler}
                isCurrent = {resource.current_id === v.id}
            />)}
        </div>
    )
}
