import {createAxios} from "~/util/axios";
import {MiniDrop} from "./MiniDrop";
import {useCallback, useState} from "react";

const axiosInstance = createAxios();

const createResource = async (resourceData) => {
    const {data} = await axiosInstance.post("/api/v1/resources/convert_create", resourceData);
    return data;
}

export const CreateResourceForm = ({onCreate}) => {
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
        const {resource} = await createResource(data);
        onCreate(resource);
    }, [data]);

    return (
        <div className="mt-4 mb-6">
            <div>Create Resource</div>
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
