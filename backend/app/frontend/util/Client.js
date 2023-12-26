import { DefaultApi } from '~/util/api-client/index';
import { createAxios } from './axios';

const config = {};
const basePath = '';

export default new DefaultApi(config, basePath, createAxios());
