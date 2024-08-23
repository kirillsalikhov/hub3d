export const Card = ({children}: {children: React.ReactNode}) => {
    return (
        <div className='overflow-hidden p-8 rounded-lg bg-white shadow-xl'>
            { children }
        </div>
    )
}
