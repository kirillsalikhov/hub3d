import { Header } from '../components/Header';
import { ConversionForm } from '../components/ConversionForm';

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
