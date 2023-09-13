import { Header } from '../components/Header';
import { ConversionForm } from '../components/ConversionForm';

export default function Root({ uploadsPath }) {
    return (
        <>
            <div className="min-h-full">
                <Header/>
                <ConversionForm uploadsPath={uploadsPath}/>
            </div>
        </>
    )
}
