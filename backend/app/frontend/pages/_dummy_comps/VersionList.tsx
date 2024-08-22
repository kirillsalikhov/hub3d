import {Version, VersionStatus, Resource} from "@/util/api-client";
import {useGetResourceVersions, useResourceSetCurrent} from "@/pages/_dummy_comps/queries.ts";

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

type VersionItemProps = {
    version: Version,
    isCurrent: boolean
}

const VersionItem = ({version, isCurrent} : VersionItemProps) => {
    const {resource_id, id} = version;
    const setCurrentMutation = useResourceSetCurrent(resource_id);

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
                         onClick={() => setCurrentMutation.mutate(id)}>
                        Make current
                    </div>
                }
            </div>
        </div>
    )
}

type VersionListProps = {
    resource: Resource
}

export const VersionList = ({resource}: VersionListProps) => {
    const {data: versions, isLoading} = useGetResourceVersions({resourceId: resource.id});

    if (isLoading) {
        return <div className="p-2 rounded-b-lg bg-slate-200">Loading...</div>
    }

    return (
        <div className="p-2 rounded-b-lg bg-slate-200">
            {versions?.map(v => <VersionItem
                version = {v}
                key = {v.id}
                isCurrent = {resource.current_id === v.id}
            />)}
        </div>
    )
}
