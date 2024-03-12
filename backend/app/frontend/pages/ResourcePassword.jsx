import { useCallback, useMemo, useState } from "react";
import Client from "../util/Client";
import { LogoSign } from '../components/LogoSign';
import { Card } from '../components/Card';
import { resourceUrl } from '../util/url';

const authPassword = async (resourceId, password) => {
    try {
        // no data if match
        await Client.resourceAuthPassword(resourceId, {link_password: password});
        return {};
    } catch (e) {
        const { response } = e;
        if (response && response.status === 403) {
            return { errors: { password: 'Incorrect password' }};
        }
        return e;
    }
}

export default function ResourcePassword({resourceId}) {
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const isValid = useMemo(() => {
        return password.length > 0
    }, [password])

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const response = await authPassword(resourceId, password);
        if (response['errors']) {
            setErrors(response['errors']);
        } else {
            window.location.href = resourceUrl(resourceId);
        }
    }, [password]);

    const handleChange = useCallback((e) => {
        setPassword(e.target.value);
        setErrors({});
    }, []);

    return (
        <div className="flex h-screen p-4 justify-center items-center bg-front">
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
                        { errors['password'] && (
                            <div  className="flex absolute text-base text-red-600 leading-6 pt-2">
                                { errors['password'] }
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
