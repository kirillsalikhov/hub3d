import { useLoaderData, Link} from 'react-router-dom';
import { CreateResourceForm } from './_dummy_comps/CreateResourceForm';
import {useCallback, useReducer, useState} from "react";
import {createAxios} from "~/util/axios";

const axiosInstance = createAxios();

const deleteResource = async (id) => {
    const res = await axiosInstance.delete(`/api/v1/resources/${id}`);
    console.log(res);
}

const ResourceItem = ({resource, onDelete}) => {

    const deleteHandler = useCallback(async () => {
        await deleteResource(resource.id);
        onDelete(resource.id);
    }, []);

    return (
        <div className="my-4 px-4 py-2 flex justify-between rounded-md bg-slate-200 ">
            <div>
                <Link className="underline" to={`resources/${resource.id}`}>
                    {resource.name}
                </Link>
            </div>
            <div>
                <div
                    onClick={deleteHandler}
                    className="px-2 py-1 rounded bg-rose-400 cursor-pointer">
                    Delete
                </div>
            </div>
        </div>
    )
}

// TODO for marina, it's dummy test page
export const Dashboard = () => {
    const [showForm, setShowForm] = useState(false);
    const {resources} = useLoaderData();

    const [_, forceUpdate] = useReducer((x) => x + 1, 0);

    const toggleForm = useCallback(()=> {
        setShowForm(!showForm);
    }, [showForm]);

    const onResourceDelete = useCallback((id) => {

        const deleteIndex = resources.findIndex(r => r.id === id);
        // NOTE !!! don't do this way
        resources.splice(deleteIndex, 1);
        forceUpdate();
    }, []);

    const onResourceCreate = useCallback(resource => {
        // NOTE !!! don't do this way
        resources.push(resource);
        setShowForm(false);
        forceUpdate();
    }, []);

    return (
        <div className="container px-6 mx-auto max-w-7xl">
            <div
                className="inline-block px-4 py-2 min-w-64 rounded cursor-pointer text-white bg-sky-700 hover:bg-sky-400"
                onClick={toggleForm}>
                {showForm ? "Close form" : "Create Resource"}
            </div>

            {showForm && <CreateResourceForm onCreate={onResourceCreate}/>}

            {resources.map(resource => <ResourceItem
                key={resource.id}
                resource={resource}
                onDelete={onResourceDelete}
            />)}
        </div>
    )
}
