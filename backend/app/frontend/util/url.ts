export const resourceUrl = (spaceKey: string, resourceId: string) => `/s/${spaceKey}/resources/${ resourceId }`;
export const conversionUrl = (spaceKey: string, conversionId: string) => `/s/${spaceKey}/conversions/${conversionId}`;

const spaceKeyRegExp = /^\/s\//

export const spaceKeyFromUrl = (uri: string) => {
    if (spaceKeyRegExp.test(uri)) {
        return uri?.split('/')[2];
    }
    return null;
}
