import {useCallback, useState} from "react";
import {MiniDrop} from "./MiniDrop";
import Client from '../../util/Client';

export const CreateVersionForm = ({resource, onSuccess}) => {
    const [data, setData] = useState({
        input_file: null
    });

    const onUpload = useCallback((signedId) => {
        setData((prevState) => {
            return {
                ...prevState,
                ...{input_file: signedId}
            }
        });

    },[]);

    const handleSubmit = useCallback(async () => {
        try {
            const res = await Client.convertUpdateResource(resource.id, data);
            // TODO for Marina: there is also task returned
            const {version} = res.data;
            onSuccess(version);
        } catch (error) {
            // TODO for Marina: actually no error check
            console.log(error);
            throw error;
        }
    }, [data]);

    return (
        <div className="mt-4 mb-6">
            <div>Create Version</div>
            <MiniDrop onSuccess={onUpload} />
            <div className="mt-2">
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="px-4 py-2 w-full rounded text-white bg-sky-700 hover:bg-sky-400">
                    Submits
                </button>
            </div>
        </div>
    )
}
