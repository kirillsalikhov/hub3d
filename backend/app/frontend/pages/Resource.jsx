const _ShallowDump = (obj) => (
    <div className="m-4 p-4 rounded-l bg-slate-200">
        {Object.entries(obj).map(([key,value]) => (
            <div key={key} className="grid grid-cols-2 gap-4 border-1">
                <div>{key}</div>
                <div className="break-all">{value}</div>
            </div>))
        }
    </div>
)

export default function Resource({ resource, version, files }) {
    return (
        <>
            <div>Resource page</div>
            <div>
                <div className="m-4"> Resource dump: </div>
                {_ShallowDump(resource)}

                <div className="m-4"> Version dump: </div>
                {_ShallowDump(version)}

                <div className="m-4"> Files dump: </div>
                {files.map(f => <div key={f.filename}> {_ShallowDump(f)}</div>)}
            </div>
        </>
    )
}
