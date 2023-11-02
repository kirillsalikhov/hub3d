import Layout from '../components/Layout';
import { ConversionForm } from '../components/ConversionForm';

const MainText = () => (
    <div>
        <h1 className="text-4xl font-black tracking-normal text-blue-950 sm:text-5xl md:text-6xl ">
            SHARE IFC FILES IN&nbsp;A&nbsp;HEARTBEAT
        </h1>
        <p className="mt-3 text-base font-medium text-blue-950 sm:mt-8 sm:text-xl lg:text-lg xl:text-xl">
            Online viewer lets you view and share CAD models with no licenses needed. Enjoy
            freedom! No registration. Absolutely secure
        </p>
    </div>
)

export default function Root({ uploadsPath }) {
    return (
        <Layout>
            <div className="mx-auto max-w-7xl">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    <div className="px-6 sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:flex lg:items-center lg:text-left hidden sm:block">
                        <MainText />
                    </div>
                    <ConversionForm uploadsPath={ uploadsPath } />
                    <div className="m-8 md:max-w-2xl sm:hidden">
                        <MainText />
                    </div>
                </div>
            </div>
        </Layout>
    )
}
