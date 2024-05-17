import { useLoaderData, Link} from 'react-router-dom';

const ResourceItem = ({resource}) => {
    return (
        <div className="my-4 px-4 py-2 rounded-md bg-slate-200 ">
            <Link className="underline" to={`resources/${resource.id}`}>
                {resource.name}
            </Link>
        </div>
    )
}

// TODO for marina, it's dummy test page
export const Dashboard = () => {
    const { resources } = useLoaderData();

    return (
        <div className="container px-2 mx-auto">
            ResourceList
            {resources.map(resource => <ResourceItem key={resource.id} resource={resource}/>)}
        </div>
    )
}
