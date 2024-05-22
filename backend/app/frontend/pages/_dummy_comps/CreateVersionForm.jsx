import {useCallback, useState} from "react";
import {MiniDrop} from "@/pages/_dummy_comps/MiniDrop";
import {createAxios} from "@/util/axios";


const axiosInstance = createAxios();

const convertUpdateResource = async (resourceId, versionData) => {
    const {data} = await axiosInstance.post(`/api/v1/resources/${resourceId}/convert_update`, versionData);
    return data;
}

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
        const {version} = await convertUpdateResource(resource.id, data);
        onSuccess(version);
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
