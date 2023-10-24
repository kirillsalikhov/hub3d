import Layout from '../components/Layout';
import { ConversionForm } from '../components/ConversionForm';
import { DefaultApi } from '~/util/api-client/index';

// Test function
async function foo() {
    const testId = '7bbafcfc-54a0-4b48-af0e-52d890b64ac8';
    // here should url go
    const client = new DefaultApi()
    const result = await client.getConversion(testId);
    console.log(result, 'result');
    const logs = await client.getConversionLogs(testId);
    console.log(logs);
    const tasks = await client.getConversions();
    console.log(tasks.data);

    // kirill didn't test this
    // const newTask = await client.convertAnonym({input_file: 'TEST_DIRECT_UPLOADED_ID'});
}

//foo();

export default function Root({ uploadsPath }) {
    return (
        <Layout>
            <div className="mx-auto max-w-7xl">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    <div
                        className="px-6 sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:flex lg:items-center lg:text-left">
                        <div>
                            <h1 className="text-4xl font-black tracking-normal text-blue-950 sm:text-5xl md:text-6xl ">
                                SHARE IFC FILES IN&nbsp;A&nbsp;HEARTBEAT
                            </h1>
                            <p className="mt-3 text-base font-medium text-blue-950 sm:mt-8 sm:text-xl lg:text-lg xl:text-xl">
                                Online viewer lets you view and share CAD models with no licenses needed. Enjoy
                                freedom! No registration. Absolutely secure
                            </p>
                        </div>
                    </div>
                    <div className="mt-16 sm:mt-24 lg:col-span-6 lg:mt-0">
                        <div
                            className="bg-white sm:mx-auto sm:w-full sm:max-w-md sm:overflow-hidden sm:rounded-lg shadow-2xl shadow-indigo-500">
                            <div className="px-6 py-8 sm:px-10">
                                <ConversionForm uploadsPath={ uploadsPath }/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
