import {createAxios} from "@/util/axios";
import {useEffect, useState} from "react";

const axiosInstance = createAxios();

const getVersions = async (resourceId) => {
    const {data} = await axiosInstance.get(`/api/v1/resources/${resourceId}/versions`);
    return data;
}


const VersionItem = ({version}) => {
    return (
        <div className="px-2 py-1 mt-2 flex gap-2 rounded bg-slate-300">
            <div>{new Date(version.created_at).toLocaleString()}</div>
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
    const versions = data ?? [];

    return (
        <div className="p-2 rounded-b-lg bg-slate-200">
            Version List
            {loading && <div>Loading...</div>}
            {versions.map(v => <VersionItem version={v} key={v.id}/>)}
        </div>
    )
}
