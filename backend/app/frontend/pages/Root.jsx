import { Header } from '../components/Header';
import { ConversionForm } from '../components/ConversionForm';
import {DefaultApi} from '~/util/api-client/index';

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
        <div className="min-h-full">
            <Header/>
            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    <ConversionForm uploadsPath={uploadsPath}/>
                </div>
            </main>
        </div>
    )
}
