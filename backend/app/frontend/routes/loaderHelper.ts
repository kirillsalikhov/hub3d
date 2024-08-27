import Client from '../util/_Client.ts';
import {QueryClient} from "@tanstack/react-query";
import {getResourcesQueryOpts} from "@/pages/_dummy_comps/queries.ts";

export const getConversionPageData = async (conversionId: string) => {
    try {
        const {data: conversionTask} = await Client.getConversion(conversionId);
        // TODO could be not set, e.g. texture
        const resourceId = conversionTask.meta!.dest_resource_id!;
        const resourceResponse = await Client.getResource(resourceId);
        return {
            resourceName: resourceResponse.data.name,
            conversionTask
        }
    } catch (err) {
        handleLoaderError(err);
    }
}

export const getResourcePageData = async (resourceId: string) => {
    try {
        const {data: resource } = await Client.getResource(resourceId);
        // TODO there might be no currentId
        // check ??? current_id
        const versionId = resource.current_id!;
        const [{data: version}, {data: files} ] =
            await Promise.all([
                Client.getVersion(versionId!),
                Client.getVersionFiles(versionId!)
            ]);

        return {
            resource,
            version,
            files
        }
    } catch (err) {
        handleLoaderError(err);
    }
}

export const getDashboardPageData = (queryClient: QueryClient) => async () => {
    // TODO move func getDashboardPageData out of here
    try {
        return queryClient.getQueryData(getResourcesQueryOpts().queryKey) ??
            (await queryClient.fetchQuery(getResourcesQueryOpts()));
    } catch (err) {
        handleLoaderError(err);
    }
}

const handleLoaderError = (err) => {
    const { response } = err;
    if (response) {
        const { data, ...rest } = response;
        throw new Response(data, {...rest} as ResponseInit);
    }
    console.error(err);
    const message = err?.message || 'something went wrong';
    throw new Response(message);
}
