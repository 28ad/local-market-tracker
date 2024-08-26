import FormButton from "../components/FormButton";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import ErrorAlert from "../components/ErrorAlert";

interface User {
    email: string;
    password: string;
}


function Login() {

    const navigate = useNavigate();

    const [userCredentials, setUserCredentials] = useState<User>({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');


    const preventFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
    }


    const validateForm = () => {

        if (userCredentials.email === '' || userCredentials.password === '') {
            setError('All fields must be completed !');
            return false;
        }


        return true;
    };



    const loginUser = () => {
        if (validateForm()) {
            axios.post('http://localhost:3000/login', userCredentials)
                .then(res => {
                    // Redirect user to dashboard if login is successful
                    if (res.data.status === 'success') {
                        navigate('/dashboard');
                    }
                })
                .catch(err => {
                    if (err.response) {
                        // Server-side validation errors
                        if (err.response.status === 400) {
                            setError(err.response.data.error);
                        } else {
                            setError('Unexpected error occurred!');
                        }
                    } else {
                        // Handle cases where there is no response (e.g., network errors)
                        setError('Network error: Unable to reach the server!');
                    }

                    console.log(err);
                });
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

                        <h1 className="text-3xl text-white font-bold">Login</h1>

                    </div>

                    {/* form */}

                    <form onSubmit={preventFormSubmit}>

                        {/* input fields */}
                        <div className="flex flex-col items-center">

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

                        </div>

                        {/* button */}

                        <div className="flex flex-col items-center mt-8">
                            <FormButton onClick={loginUser} label="Login" />
                        </div>

                        <div className="flex flex-col items-center mt-2">
                            <p>Already have an account? <Link to="/register" className="text-orange-500 cursor-pointer font-bold">Register</Link></p>
                        </div>
                    </form>

                </div>

            </div>
        </>
    )
}

export default Login;