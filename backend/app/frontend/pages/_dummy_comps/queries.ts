// Rename file

import {queryOptions, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import Client from "@/util/_Client";
import {ConvertAnonymRequest, Resource, SetResourceCurrentRequest, Version} from "@/util/api-client";

const getResources = async () => {
    const res = await Client.getResources();
    return res.data;
}

export const getResourcesQueryOpts = () => {
    return queryOptions({
        queryKey: resourceKeys.list(),
        queryFn: getResources
    })
}

export const useResources = () => {
    return useQuery(getResourcesQueryOpts());
}

//--- split ---//
const getResourceVersions = async (resourceId: string) => {
    const res = await Client.getResourceVersions(resourceId);
    return res.data;
}

const getResourceVersionsOpts = (resourceId: string) => {
    return queryOptions({
        queryKey: resourceKeys.resourceVersions(resourceId),
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
export const useResourceSetCurrent = (resource_id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (versionId: string) => {
            const res = await Client.setResourceCurrent(resource_id, {current_id: versionId});
            return res.data;
        },
        onSuccess: (resource: Resource) => {
            queryClient.setQueryData(resourceKeys.list(), updateInArr(resource));
        },
    })
}

// --- delete ---/
export const useDeleteResource = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => Client.deleteResource(id),
        onSuccess: (_,id) => {
            queryClient.setQueryData(resourceKeys.list(), removeFromArr<Resource>(id));
        },
    })
}

// --- createResource --- //
export const useConvertCreateResource = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ConvertAnonymRequest) => {
            const res = await Client.convertCreateResource(data);
            return res.data
        },
        onSuccess: ({resource}) => {
            queryClient.setQueryData(resourceKeys.list(), addToArr(resource));
        }
    })
}
// move to lib
type ArrMutator<T> = (items: T[]) => T[];

const addToArr = <T>(item: T) : ArrMutator<T> => {
    return (items: T[]) => [item, ...items];
}

const removeFromArr = <T extends {id: string}>(itemId: string) : ArrMutator<T> => {
    return (items: T[]) => items.filter(old => old.id !== itemId);
}

const updateInArr = <T extends {id: string}>(item: T) : ArrMutator<T> => {
    return (items: T[]) => items.map(old => old.id === item.id ? {...old, ...item} : old);
}

// --- keys --- //

const resourceKeys = {
    all: ['resources'] as const,
    lists: () => [...resourceKeys.all, 'list'] as const,
    list: () => [...resourceKeys.lists(), 'all'] as const,
    resourceVersions: (resourceId: string) => [...resourceKeys.all, resourceId, 'versions']
}


export const useConvertUpdateResource = (resourceId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ConvertAnonymRequest) => {
            const res = await Client.convertUpdateResource(resourceId, data);
            return res.data;
        },
        onSuccess: ({version}) => {
            queryClient.setQueryData(resourceKeys.resourceVersions(resourceId), addToArr(version));
        }
    })
}

