import {useCallback, useState} from "react";
import {MiniDrop} from "./MiniDrop";
import {ConvertAnonymRequest, Resource} from "@/util/api-client";
import {useConvertUpdateResource} from "@/pages/_dummy_comps/queries.ts";

type CreateVersionFormProps = {
    resource: Resource,
    onSuccess?: () => void,
}

export const CreateVersionForm = ({resource, onSuccess}: CreateVersionFormProps) => {
    const [data, setData] = useState<ConvertAnonymRequest>({
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

    const convertUpdateResourceMutation = useConvertUpdateResource(resource.id);

    const handleSubmit = useCallback(async () => {
        try {
            convertUpdateResourceMutation.mutate(data);
            onSuccess();
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
