export const resourceUrl = (spaceKey, resourceId) => `/s/${spaceKey}/resources/${ resourceId }`;
export const conversionUrl = (spaceKey, conversionId) => `/s/${spaceKey}/conversions/${conversionId}`;

const spaceKeyRegExp = /^\/s\//

export const spaceKeyFromUrl = (uri) => {
    if (spaceKeyRegExp.test(uri)) {
        return uri?.split('/')[2];
    }
    return null;
}
