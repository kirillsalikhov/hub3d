import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useModel } from '../../models/ModelProvider.tsx';

export const useSetPageData = () => {
    const model = useModel();
    const location = useLocation();
    useEffect(() => {
        const app = document.getElementById('app');
        model.setPageData(JSON.parse(app.dataset.page));
    }, [location]);
}
