import {useCallback, useReducer, useState} from "react";
import {Link} from "react-router-dom";
import {CreateVersionForm} from "@/pages/_dummy_comps/CreateVersionForm";
import {VersionList} from "@/pages/_dummy_comps/VersionList";
import {Resource} from "@/util/api-client";
import {useDeleteResource} from "@/pages/_dummy_comps/queries.ts";

interface ResourceItemProps {
    resource: Resource,
}

export const ResourceItem = ({resource}: ResourceItemProps) => {
    const [showForm, setShowForm] = useState(false);
    const [showVersions, toggleVersions] = useReducer((state) => !state, false);

    const toggleUpdateForm = useCallback(() => {
        setShowForm(!showForm);
    }, [showForm]);

    const deleteMutation = useDeleteResource();

    const onVersionCreate = useCallback(() => {
        setShowForm(false);
    }, []);

    const roundedStyle = showVersions ? 'rounded-l-md rounded-md-lg': 'rounded-md'

    return (
        <div className="my-4">
            <div className={`flex justify-between px-4 py-2 ${roundedStyle} bg-slate-200`}>
                <div className="flex gap-2">
                    {/* I do not understand why standard min-w-128 doesn't work for me(*/}
                    <Link className="underline my-auto min-w-[128px]" to={`resources/${resource.id}`}>
                        {resource.name}
                    </Link>
                    <div onClick={toggleVersions}
                        className="px-2 py-1 bg-gray-300 rounded cursor-pointer">
                        {showVersions? 'Close versions' : 'Versions'}
                    </div>
                </div>
                <div className="flex gap-2">
                    <div
                        onClick={toggleUpdateForm}
                        className="px-2 py-1 rounded bg-blue-300 cursor-pointer">
                        {showForm ? 'close': 'Add Version' }
                    </div>
                    <div
                        onClick={() => deleteMutation.mutate({id: resource.id})}
                        className="px-2 py-1 rounded bg-rose-400 cursor-pointer">
                        Delete
                    </div>
                </div>
            </div>
            {showVersions && <div className="ml-16">
                <VersionList resource={resource} />
            </div>}
            {showForm && <div className="ml-16">
                <CreateVersionForm resource={resource} onSuccess={onVersionCreate}/>
            </div>}
        </div>
    )
}
