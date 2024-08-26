import { useEffect, useState } from "react";
import FormButton from "../components/FormButton";
import ErrorAlert from "../components/ErrorAlert";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

interface User {
    username: string;
    email: string;
    password: string;
    confPassword: string;
}

interface ApiErrors {
    message: string;
}

function Register() {

    const navigate = useNavigate();

    const [userCredentials, setUserCredentials] = useState<User>({
        username: '',
        email: '',
        password: '',
        confPassword: ''
    });

    const [error, setError] = useState('');

    const preventFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
    }

    const validateForm = () => {

        if (userCredentials.username === '' || userCredentials.email === '' || userCredentials.password === '' || userCredentials.confPassword === '') {
            setError('All fields must be completed !');
            return false;
        }

        if (userCredentials.password.length < 6) {
            setError('Password must be at least 6 characters long !');
            return false;
        }

        if (userCredentials.password !== userCredentials.confPassword) {
            setError('Passwrods do not match !');
            return false;
        }

        return true;
    };

    const registerUser = () => {

        setError('');

        // client side validation
        if (validateForm()) {

            axios.post('http://localhost:3000/register', userCredentials)
                .then(res => {

                    // redirect user to login page if registration is successful
                    if (res.data.status === 'success') {

                        navigate('/login');
                        
                    }

                })
                .catch(err => {

                    // server side validation errors#
                    if (err.response.error === 400) {

                        let errors: ApiErrors[] = err.response.data.error;

                        {errors.length > 1 ? setError('The email and username already exist !') : setError(errors[0].message)};

                    } else {

                        setError('Unexpected error occured !')
                    }

                    console.log(err);
                })
        } else {
            return;
        }

    };

    return (
        <>
            <div className="flex flex-col justify-center items-center bg-gray-800 min-h-screen" style={{ minHeight: '100dvh' }}>

                {error === '' ? null : (
                    <>
                        <ErrorAlert error={error} />
                    </>
                )}

                {/* reg form */}

                <div className="pb-10 shadow-md rounded-md bg-white">

                    {/* form header */}

                    <div className="h-20 w-80 md:w-96 bg-gray-700 rounded-t-md flex justify-center items-center">

                        <h1 className="text-3xl text-white font-bold">Register</h1>

                    </div>

                    {/* form */}

                    <form onSubmit={preventFormSubmit}>

                        {/* input fields */}
                        <div className="flex flex-col items-center">

                            <div className="flex flex-col mt-6">
                                <label className="font-bold" htmlFor="username">Username: <span className="text-red-600">*</span></label>
                                <input
                                    onChange={(e) => { setUserCredentials({ ...userCredentials, username: e.target.value }) }}
                                    type="text" className="rounded-sm border border-gray-500 pl-2 py-1 text-xl focus:outline-orange-500" name="username" />
                            </div>

                            <div className="flex flex-col mt-6">
                                <label className="font-bold" htmlFor="email">Email: <span className="text-red-600">*</span></label>
                                <input
                                    onChange={(e) => { setUserCredentials({ ...userCredentials, email: e.target.value }) }}
                                    type="text" className="rounded-sm border border-gray-500 pl-2 py-1 text-xl focus:outline-orange-500" name="email" />
                            </div>

                            <div className="flex flex-col mt-6">
                                <label className="font-bold" htmlFor="password">Password: <span className="text-red-600">*</span></label>
                                <input
                                    onChange={(e) => { setUserCredentials({ ...userCredentials, password: e.target.value }) }}
                                    type="password" className="rounded-sm border border-gray-500 pl-2 py-1 text-xl focus:outline-orange-500" name="password" />
                            </div>

                            <div className="flex flex-col mt-6">
                                <label className="font-bold" htmlFor="confPassword">Confirm Password: <span className="text-red-600">*</span></label>
                                <input
                                    onChange={(e) => { setUserCredentials({ ...userCredentials, confPassword: e.target.value }) }}
                                    type="password" className="rounded-sm border border-gray-500 pl-2 py-1 text-xl focus:outline-orange-500" name="confPassword" />
                            </div>

                        </div>

                        {/* button */}

                        <div className="flex flex-col items-center mt-8">
                            <FormButton label="Register" onClick={registerUser} />
                        </div>

                        <div className="flex flex-col items-center mt-2">
                            <p>Already have an account? <Link to="/login" className="text-orange-500 cursor-pointer font-bold">Login</Link></p>
                        </div>
                    </form>

                </div>

            </div>
        </>
    )
}

export default Register;