import {createAxios} from "@/util/axios";
import {useCallback, useEffect, useReducer, useState} from "react";

const axiosInstance = createAxios();

const getVersions = async (resourceId) => {
    const {data} = await axiosInstance.get(`/api/v1/resources/${resourceId}/versions`);
    return data;
}

const setCurrent = async (resourceId, versionId) => {

    const {data} = await axiosInstance.patch(`/api/v1/resources/${resourceId}/set_current`, {current_id: versionId});
    return data;
}
const VersionItem = ({version, isCurrent, setCurrentAction}) => {
    return (
        <div className="px-2 py-1 mt-2 flex gap-2 justify-between rounded bg-slate-300">
            <div>{new Date(version.created_at).toLocaleString()}</div>
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
            const data = await apiCall();
            setData(data);
            setLoading(false);
        })();
    }, []);

    return { data, loading };
}

export const VersionList = ({resource}) => {
    const {data, loading } = useApiCall(() => getVersions(resource.id))
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const versions = data ?? [];

    const setCurrentHandler = useCallback(async (versionId) => {
        const data = await setCurrent(resource.id, versionId);
        // NOTE don't do this way !!!
        resource.current_id = data.current_id;
        forceUpdate();
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
