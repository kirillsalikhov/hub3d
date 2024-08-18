import {useCallback, useEffect, useReducer, useState} from "react";
import Client from '@/util/_Client';
import {Resource} from "@/pages/_dummy_comps/_ResourceItem.tsx";
import {AxiosResponse} from "axios";

type VersionStatus = 'pending' | 'in_progress' | 'ready' | 'failed' | 'canceled'

interface Version {
    id: string,
    space_id: string,
    space_key: string,
    resource_id: string,
    status: VersionStatus,
    is_version: boolean,
    created_at: string,
    updated_at: string
}

const statusColor = (() => {
    const _c = (color: string) => `bg-${color}-100`;
    const _statusIdx = {
        'pending': _c('gray'),
        'in_progress': _c('blue'),
        'ready': _c('green'),
        'failed': _c('red'),
        'canceled': _c('pink')
    }

    return (status: VersionStatus) => _statusIdx[status];
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

const useApiCall = <T,>(apiCall: () => Promise<AxiosResponse<T>>) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<T>(null);

    useEffect(() => {
        (async () => {
            const { data } = await apiCall();
            setData(data);
            setLoading(false);
        })();
    }, []);

    return { data, loading };
}

type VersionListProps = {
    resource: Resource
}

export const VersionList = ({resource}: VersionListProps) => {
    const {data, loading } = useApiCall(() => {
        // TODO remove when openApi response types
        return Client.getResourceVersions(resource.id) as unknown as Promise<AxiosResponse<Version[]>>;
    });
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const versions = data ?? [];

    const setCurrentHandler = useCallback(async (versionId: string) => {
        try {
            const res = await Client.setResourceCurrent(resource.id, {current_id: versionId});
            // TODO remove when openApi response types
            const {current_id} = res.data as unknown as Resource;
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
