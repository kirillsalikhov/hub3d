/*
    FOR MARINA!
    It's just stub page for testing api calls
    you should delete it once logic is moved to component
    TODO - for easy find
 */

import {useState} from "react";
import axios from "axios";

const updateShareOptions = async (resourceId, data) => {
    const res = await axios.patch(`/api/v1/resources/${resourceId}/share-options`, data);
    console.log(res);
}

export default function EditShareOptions({resourceId}) {
    const [formData, setFormData] = useState({
        link_password: "",
        link_access: "none"
    });

    const LINK_ACCESS_OPTS = ["none", "view"];

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        await updateShareOptions(resourceId, formData);
    }


    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }

    const radioOpt = (name, optionValue, currentValue) => {
        return (
            <div className="block" key={optionValue}>
                <input type="radio" name={name} id={optionValue}
                   checked={optionValue === currentValue}
                   value={optionValue}
                   onChange={handleChange}
                   className="mr-2 align-middle h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"/>
                <label htmlFor={optionValue}>{optionValue}</label>
            </div>)
    }

    return (
        <div className="max-w-md px-4 mx-auto">
            <h1 className="my-4 text-lg">Edit share options</h1>
            <form onSubmit={handleSubmit}>
                <div className="mt-4">
                    <div className="block mb-2">Link access:</div>
                    {LINK_ACCESS_OPTS.map(
                        option => radioOpt("link_access", option, formData.link_access))
                    }
                </div>
                <div className="mt-4">
                    <label className="block mb-2">Link password:</label>
                    <input type="text" name="link_password" value={formData.password} onChange={handleChange}
                           className="block px-2 py-1.5 rounded-md border-1 ring-1"/>
                </div>
                <div className="mt-4">
                    <button type="submit"
                            className="rounded bg-indigo-600 px-2 py-1 text-sm font-semibold text-white">Submit
                    </button>
                </div>
            </form>
        </div>
    )
}
