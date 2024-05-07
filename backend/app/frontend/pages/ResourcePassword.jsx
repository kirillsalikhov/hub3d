import { useCallback, useMemo, useState } from "react";
import { useParams } from 'react-router-dom';
import Client from "../util/Client";
import { LogoSign } from '../components/LogoSign';
import { Card } from '../components/Card';
import { resourceUrl } from '../util/url';
import { useNavigate } from '../routes/useNavigate';

const authPassword = async (resourceId, password) => {
    try {
        // no data if match
        await Client.resourceAuthPassword(resourceId, {link_password: password});
        return {};
    } catch (e) {
        const { response } = e;
        if (response?.data && response.status === 422) {
            return response.data;
        }
        throw e;
    }
}

export default function ResourcePassword() {
    const { resourceId } = useParams();
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const isValid = useMemo(() => {
        return password.length > 0
    }, [password])

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const response = await authPassword(resourceId, password);
        if (response['errors']) {
            setErrors(response['errors']);
        } else {
            navigate(resourceUrl(resourceId));
        }
    }, [password]);

    const handleChange = useCallback((e) => {
        setPassword(e.target.value);
        setErrors({});
    }, []);

    return (
        <div className="flex flex-1 h-full p-4 justify-center items-center">
            <div className="w-full justify-center sm:my-8 sm:w-full sm:max-w-lg">
                <LogoSign />

                <Card>
                    <div className="text-2xl pb-8 font-semibold text-gray-900 text-center">
                        Enter the password to&nbsp;open this link
                    </div>

                    <div className="pb-8 w-full">
                        <div className="flex">
                            <input
                                id="password"
                                required={true}
                                name="password"
                                type="password"
                                placeholder='Password'
                                className="flex-grow input-group-scnd"
                                onChange={ handleChange }
                            />
                            <button
                                onClick={ handleSubmit }
                                type="button"
                                disabled={!isValid}
                                className="flex-none button-group-scnd">
                                &nbsp;&nbsp;→&nbsp;&nbsp;
                            </button>
                        </div>
                        { errors['link_password'] && (
                            <div  className="flex absolute text-base text-red-600 leading-6 pt-2">
                                { errors['link_password'] }
                            </div>
                        ) }
                    </div>
                </Card>
                <div className="flex text-center text-sm text-blue-950 p-8">
                    Pulse3D&nbsp;is&nbsp;an&nbsp;online viewer that lets you view and&nbsp;easily share CAD&nbsp;models
                    with your team
                </div>
            </div>
        </div>
    )
}
