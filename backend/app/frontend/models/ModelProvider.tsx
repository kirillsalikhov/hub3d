import { createContext, useContext } from 'react'
import { Model } from './index';
export const ModelContext = createContext<Model>(undefined);
export const useModel = () => {
    return useContext(ModelContext);
}
