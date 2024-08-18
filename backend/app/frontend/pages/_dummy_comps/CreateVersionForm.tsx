import {useCallback, useState} from "react";
import {MiniDrop} from "./MiniDrop";
import Client from '../../util/_Client';
import {Resource} from "@/pages/_dummy_comps/ResourceItem";
import {Version} from "@/pages/_dummy_comps/VersionList.tsx";

type CreateVersionFormProps = {
    resource: Resource,
    onSuccess?: (version: Version) => void,
}

export interface IConvertParams {
    input_file: string
}

export const CreateVersionForm = ({resource, onSuccess}: CreateVersionFormProps) => {
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
            const res = await Client.convertUpdateResource(resource.id, data);
            type ConvertUpdateResource = {
                version: Version
            }
            // TODO for Marina: there is also task returned
            // TODO remove type casts when OpenApi
            const {version} = res.data as unknown as ConvertUpdateResource;
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
