import { Header } from '../Header';

export default function Layout({ children }) {
    return (
        <div className="h-full relative overflow-hidden bg-front bg-cover">
            <Header/>
            <main className="h-full">
                { children }
            </main>
        </div>
    )
}
