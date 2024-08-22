import { CreateResourceForm } from './_dummy_comps/CreateResourceForm';
import {useCallback, useReducer, useState} from "react";
import {ResourceItem} from "./_dummy_comps/ResourceItem";
import {useResources} from "@/pages/_dummy_comps/queries";


// TODO for marina, it's dummy test page
export const Dashboard = () => {
    const [showForm, setShowForm] = useState(false);
    const {data: resources, isLoading} = useResources();

    const toggleForm = useCallback(()=> {
        setShowForm(!showForm);
    }, [showForm]);

    const onResourceCreate = useCallback( () => {
        setShowForm(false);
    }, []);

    if (isLoading) {
        return 'Loading resources ...'
    }

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
            />)}
        </div>
    )
}
