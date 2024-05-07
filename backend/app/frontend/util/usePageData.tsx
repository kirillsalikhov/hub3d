import { useEffect, useState } from 'react';
import { useModel } from '../models/ModelProvider';
import { IPageData } from '../models';
import { autorun } from 'mobx';

export const usePageData = () => {
    const model = useModel();
    const [ data, setData ] = useState<IPageData>(model.pageData);

    useEffect(() => {
        const dispose = autorun(() => {
            setData(model.pageData);
        });
        return () => dispose();
    }, [model]);

    return data;
};
