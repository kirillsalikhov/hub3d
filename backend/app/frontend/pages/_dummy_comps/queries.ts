// Rename file

import {queryOptions, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import Client from "@/util/_Client";

const getResources = async () => {
    const resourcesResponse = await Client.getResources();
    return resourcesResponse.data;
}

export const getResourcesQueryOpts = () => {
    return queryOptions({
        queryKey: ['resources'],
        queryFn: getResources
    })
}

export const useResources = () => {
    return useQuery(getResourcesQueryOpts());
}

//--- split ---//
const getResourceVersions = async (resourceId: string) => {
    const response = await Client.getResourceVersions(resourceId);
    return response.data;
}

const getResourceVersionsOpts = (resourceId: string) => {
    return queryOptions({
        queryKey: ['versions', {resource: resourceId}],
        queryFn: () => getResourceVersions(resourceId)
    })
}

type UseGetResourceVersionsOpts = {
    resourceId: string
}

export const useGetResourceVersions = ({resourceId} : UseGetResourceVersionsOpts) => {
    return useQuery(getResourceVersionsOpts(resourceId));
}

//--- split ---/
const setResourceCurrent = async ({resource_id, version_id} : {resource_id: string, version_id: string}) => {
    const res = await Client.setResourceCurrent(resource_id, {current_id: version_id});
    const {current_id} = res.data;
    return current_id;
}

export const useResourceSetCurrent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: setResourceCurrent,
        onSuccess: () => {
            return queryClient.invalidateQueries({queryKey: ['resources']});
        },
    })
}

// --- delete ---/

const deleteResource = async ({id} : {id: string}) => {
    return Client.deleteResource(id);
}

export const useDeleteResource = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteResource,
        onSuccess: () => {
            return queryClient.invalidateQueries({queryKey: ['resources']});
        },
    })
}
