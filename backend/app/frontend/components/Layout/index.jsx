import { Header } from '../Header';

export default function Layout({ children }) {
    return (
        <div className="min-h-full flex flex-col relative bg-front bg-cover">
            <Header/>
            <main className="flex-auto flex flex-col">
                { children }
            </main>
        </div>
    )
}
