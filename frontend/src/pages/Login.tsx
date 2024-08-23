import FormButton from "../components/FormButton";
import { Link } from "react-router-dom";


function Login() {

    const loginUser = () => {

    };

    return (
        <>


            <div className="flex justify-center items-center h-screen bg-gray-800">

                {/* reg form */}

                <div className="pb-10 shadow-md rounded-md bg-white">

                    {/* form header */}

                    <div className="h-20 w-80 md:w-96 bg-gray-700 rounded-t-md flex justify-center items-center">

                        <h1 className="text-3xl text-white font-bold">Register</h1>

                    </div>

                    {/* form */}

                    <form>

                        {/* input fields */}
                        <div className="flex flex-col items-center">

                            <div className="flex flex-col mt-6">
                                <label className="font-bold" htmlFor="email">Email: <span className="text-red-600">*</span></label>
                                <input type="text" className="rounded-sm border border-gray-500 pl-2 py-1 text-xl focus:outline-orange-500" name="email" />
                            </div>

                            <div className="flex flex-col mt-6">
                                <label className="font-bold" htmlFor="password">Password: <span className="text-red-600">*</span></label>
                                <input type="password" className="rounded-sm border border-gray-500 pl-2 py-1 text-xl focus:outline-orange-500" name="password" />
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