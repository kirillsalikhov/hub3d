import Client from '../util/Client.js';

export const getConversionPageData = async (conversionId) => {
    try {
        const conversionResponse = await Client.getConversion(conversionId);
        const resourceId = conversionResponse.data.meta.dest_resource_id;
        const resourceResponse = await Client.getResource(resourceId);
        return {
            resourceName: resourceResponse.data.name,
            conversionTask: conversionResponse.data
        }
    } catch (err) {
        handleLoaderError(err);
    }
}

export const getResourcePageData = async (resourceId) => {
    try {
        const resourceResponse = await Client.getResource(resourceId);
        const versionId = resourceResponse.data.current_id;
        const [versionResponse, filesResponse] =
            await Promise.all([
                Client.getVersion(versionId),
                Client.getVersionFiles(versionId)
            ]);
        return {
            resource: resourceResponse.data,
            version: versionResponse.data,
            files: filesResponse.data
        }
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
