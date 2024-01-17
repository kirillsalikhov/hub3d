/*
    FOR MARINA!
    This is dummy design for testing functionality
    TODO - for easy find
 */

import {useState} from "react";
import axios from "axios";

const authPassword = async (resourceId, password) => {
    try {
        // no data if match
        await axios.post(
            `/api/v1/resources/${resourceId}/share-options/auth-password`, {link_password: password});
        return true;
    } catch (e) { // SHOULD be check on forbidden !
        // forbidden if not match
        return false
    }
}

export default function ResourcePassword({resourceId}) {
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        const isMatch = await authPassword(resourceId, password);
        console.log(isMatch, 'isMatch');
        setSuccess(isMatch);
    }

    const handleChange = (evt) => setPassword(evt.target.value);

    return (
        <div className="max-w-md px-4 mx-auto">
            <h1>Enter password, please</h1>
            <form onSubmit={handleSubmit}>
                <div className="mt-4">
                    <label className="block mb-2">Link password:</label>
                    <input type="text" name="link_password"
                           value={password}
                           onChange={handleChange}
                           className="block px-2 py-1.5 rounded-md border-1 ring-1"/>
                </div>
                <div className="mt-4">
                    <button type="submit"
                            className="rounded bg-indigo-600 px-2 py-1 text-sm font-semibold text-white">
                        Check Password
                    </button>
                </div>
            </form>
            <div className="mt-8">
                {success ?
                    (<div className="bg-green-400 p-2 rounded">Success</div>):
                    (<div className="bg-slate-400 p-2 rounded">Not match yet</div>)
                }
            </div>
        </div>
    )
}
