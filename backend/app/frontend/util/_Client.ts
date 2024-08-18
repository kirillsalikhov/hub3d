import {Configuration, DefaultApi} from '@/util/api-client/index';
import { createAxios } from './axios';

const isBrowser = () => typeof window !== 'undefined'

const basePath = isBrowser() ? '': 'http://backend:3050';

export default new DefaultApi(
    new Configuration({}),
    basePath,
    createAxios()
);
