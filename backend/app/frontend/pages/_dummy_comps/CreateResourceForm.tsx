import {MiniDrop} from "./MiniDrop";
import {useCallback, useState} from "react";
import {ConvertAnonymRequest} from "@/util/api-client";
import {useConvertCreateResource} from "@/pages/_dummy_comps/queries.ts";

type CreateResourceFormProps = {
    onCreate: () => void
}

export const CreateResourceForm = ({onCreate} : CreateResourceFormProps) => {
    const [data, setData] = useState<ConvertAnonymRequest>({
        input_file: ''
    });

    const onUpload = useCallback((signedId: string) => {
        setData((prevState) => {
            return {
                ...prevState,
                ...{input_file: signedId}
            }
        });

    },[]);

    const createDiscussionMutation = useConvertCreateResource();

    const handleSubmit = useCallback(async () => {
        // TODO for Marina: there are questions with Client.convertUpdateResource():
        // convertCreateResource returns {resource, task} ; convertUpdateResource returns {version, task}
        createDiscussionMutation.mutate(data);
        // TODO Should be on Mutation success
        onCreate();
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
