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
const setResourceCurrent = async (resourceId: string, versionId: string) => {
    const res = await Client.setResourceCurrent(resourceId, {current_id: versionId});
    const {current_id} = res.data;
    return current_id;
}

type UseResourceSetCurrentOpts = {
    resourceId: string
}

export const useResourceSetCurrent = ({resourceId}: UseResourceSetCurrentOpts) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (versionId: string) => setResourceCurrent(resourceId, versionId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['resources']});
        },
    })
}
