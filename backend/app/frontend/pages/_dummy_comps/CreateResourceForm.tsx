import {MiniDrop} from "./MiniDrop";
import {useCallback, useState} from "react";
import Client from '../../util/_Client';
import {IConvertParams} from "@/pages/_dummy_comps/CreateVersionForm.tsx";
import {Resource} from "@/pages/_dummy_comps/ResourceItem.tsx";


export const CreateResourceForm = ({onCreate}) => {
    const [data, setData] = useState<IConvertParams>({
        input_file: null
    });

    const onUpload = useCallback((signedId: string) => {
        setData((prevState) => {
            return {
                ...prevState,
                ...{input_file: signedId}
            }
        });

    },[]);

    const handleSubmit = useCallback(async () => {
        try {
            type ConvertCreateResource = {
                resource: Resource
            }

            const res = await Client.convertCreateResource(data);

            // TODO for Marina: there are questions with Client.convertUpdateResource():
            // convertCreateResource returns {resource, task} ; convertUpdateResource returns {version, task}
            const {resource} = res.data as unknown as ConvertCreateResource;
            onCreate(resource);
        } catch (error) {
            // TODO for Marina: actually no error check
            console.log(error);
            throw error;
        }

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
