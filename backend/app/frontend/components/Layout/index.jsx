import { Header } from '../Header';

export default function Layout({ children }) {
    return (
        <div className="min-h-full relative overflow-hidden bg-front bg-cover">
            <div className="relative pb-16 pt-6 sm:pb-24">
                <Header/>
                <main className="mt-16 sm:mt-24">
                    { children }
                </main>
            </div>
        </div>
    )
}
