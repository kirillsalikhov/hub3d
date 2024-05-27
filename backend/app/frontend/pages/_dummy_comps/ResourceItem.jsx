import {createAxios} from "@/util/axios";
import {useCallback, useState} from "react";
import {Link} from "react-router-dom";
import {CreateVersionForm} from "@/pages/_dummy_comps/CreateVersionForm";
import {VersionList} from "@/pages/_dummy_comps/VersionList";

const axiosInstance = createAxios();

const deleteResource = async (id) => {
    const res = await axiosInstance.delete(`/api/v1/resources/${id}`);
    console.log(res);
}

export const ResourceItem = ({resource, onDelete}) => {
    const [showForm, setShowForm] = useState(false);
    const [showVersions, setShowVersions] = useState(false);

    const toggleUpdateForm = useCallback(() => {
        setShowForm(!showForm);
    }, [showForm]);

    const toggleShowVersions = useCallback(() => {
        setShowVersions(!showVersions);
    }, [showVersions]);

    const deleteHandler = useCallback(async () => {
        await deleteResource(resource.id);
        onDelete(resource.id);
    }, []);

    const onVersionCreate = useCallback((version) => {
        console.log(version, 'version');
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
                    <div onClick={toggleShowVersions}
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
                        onClick={deleteHandler}
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
