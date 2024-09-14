import Sidebar from "../components/Sidebar";
import Toggle from "../components/Toggle";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Status {
    message: string;
    type: string;
}

function Settings() {

    const navigate = useNavigate();

    const [editEmail, setEditEmail] = useState(false);
    const [disableInput, setDisableInput] = useState(true);
    const [statusMessage, setStatusMessage] = useState<Status>({
        message: '',
        type: ''
    });

    const [newEmail, setNewEmail] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string>('');
    const [currentPass, setCurrentPass] = useState<string>('');
    const [newPass, setNewPass] = useState<string>('');
    const [newPassConf, setNewPassConf] = useState<string>('');

    const [userId, setUserId] = useState<string>('');

    const [showModal, setShowModal] = useState(false);

    // prevent form submission behaviour
    const preventFormSubmit = (e: any) => {
        e.preventDefault();
    };

    const fetchUserEmail = () => {

        axios.get('http://localhost:3000/authenticate')
            .then(res => {

                console.log(res.data.user);
                setUserId(res.data.user.id);
                setUserEmail(res.data.user.email);
            })
            .catch(err => {
                console.log(err)
            })


    }

    useEffect(() => {
        fetchUserEmail();
    }, [])

    const infoNotification = () => {

        toast.info(statusMessage.message, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",

        });

    }

    const successNotification = () => {

        toast.success(statusMessage.message, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",

        });

    }

    const errorNotification = () => {

        toast.error(statusMessage.message, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",

        });
    }

    useEffect(() => {

        if (statusMessage.type === 'info') {
            infoNotification();

        }
        else if (statusMessage.type === 'success') {

            successNotification();

        } else if (statusMessage.type === 'error') {
            errorNotification();
        }

    }, [statusMessage])

    const toggleEmailEdit = () => {

        setEditEmail(!editEmail)
        setDisableInput(!disableInput);

        if (!editEmail) {
            setStatusMessage({message: 'You can now edit your email !', type: 'info'});
        }


    }

    useEffect(() => {
        console.log(editEmail);
    }, [editEmail])

    const validateEmail = (email: string) => {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailRegex.test(email);
    };

    const updateEmail = () => {

        console.log(newEmail);

        if (validateEmail(newEmail)) {

            console.log("Valid email");

        } else {

            console.log("Please make sure you insert a valid email address !");
            setStatusMessage({message: 'Please make sure you insert a valid email address !', type: 'error'});

            return;
        }

        if (newEmail === userEmail) {
            console.log("This email is currently in use !")
            setStatusMessage({message: 'This email is currently in use !', type: 'error'});

            return;
        }

        if (newEmail === '') {
            console.log("No email inputed, nothing changed");
            setStatusMessage({message: 'No email inputed, nothing changed', type: 'error'});

            return;
        }

        // if email valid send to server
        axios.put(`http://localhost:3000/update/email/${userId}`, { email: newEmail })
            .then(res => {

                if (res.status === 200) {
                    console.log(res.data.message);
                    setStatusMessage({message: res.data.message, type: 'success'});

                    navigate('/settings');
                }



            })
            .catch(err => {

                if (err.response) {
                    // Server responded with a status code that falls out of the range of 2xx
                    console.log("Error:", err.response.data.error);
                    console.log("Status code:", err.response.status);
                    setStatusMessage({message: err.response.data.error, type: 'error'});

                }
            })
    }

    const validatePassword = () => {

        if (newPass === '' || newPassConf === '' || currentPass === '') {
            console.log('All fields must be completed !');
            setStatusMessage({message: 'All fields must be completed !', type: 'error'});
            return false;
        }

        if (newPass !== newPassConf) {

            console.log('Passwords do not match !');
            setStatusMessage({message: 'Passwords do not match !', type: 'error'});
            return false;
        }

        return true;
    }

    const updatePassword = () => {

        console.log(currentPass);
        console.log(newPass);

        if (!validatePassword()) {
            return;
        }

        axios.put(`http://localhost:3000/update/password/${userId}`, { newPassword: newPass, currentPassword: currentPass })
            .then(res => {

                console.log(res.data.message);
                navigate('/settings');
                setShowModal(false);
                setStatusMessage({message: 'Password has been changed successfully !', type: 'success'});

            })
            .catch(err => {

                if (err.response) {

                    console.log(err.response.data.error);
                    setStatusMessage({message: err.response.data.error, type: 'error'});
                }
            });

    }

    return (

        <>
            <div className="flex flex-row overflow-hidden">

                {/* sidebar */}
                <div className="flex md:w-16">
                    <Sidebar />
                </div>

                {/* main content */}
                <div className="flex-1 ml-16 md:ml-0">


                    <h1 className="p-4 text-3xl font-semibold">Dashboard</h1>

                    <div className="flex justify-center">
                        <div className="w-full mx-4 h-[1px] bg-black"></div>
                    </div>

                    {/* My Account separation title */}

                    <div className="pl-4 mt-10">

                        <h1 className=" text-3xl font-bold">My Account</h1>

                        <div className="border-b-4 border-orange-500 w-40 ml-[2px]"></div>

                    </div>

                    {/* my account settings */}
                    <div className="pl-4 mt-10 flex flex-col md:flex-row gap-y-4">

                        {/* email edit */}
                        <div className="w-1/2">

                            <div className="flex flex-col items-start mt-4">

                                <label htmlFor="email" className="font-bold mb-2">Change your email:</label>

                                <div className="flex">
                                    <input
                                        onChange={(e: React.FormEvent<HTMLInputElement>) => { setNewEmail(e.currentTarget.value) }}
                                        className="rounded-sm border border-gray-500 pl-2 py-1 text-xl focus:outline-orange-500"
                                        style={{ cursor: editEmail ? 'pointer' : 'not-allowed' }}
                                        type="text" name="email" id="email" placeholder={userEmail} disabled={disableInput} />

                                    <button
                                        onClick={toggleEmailEdit}
                                        className="p-4 bg-gray-800 active:bg-orange-500 hover:bg-gray-900">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>

                                    </button>
                                </div>

                                <button
                                    onClick={updateEmail}
                                    className="py-4 bg-gray-800 active:bg-orange-500 hover:bg-gray-900 font-bold text-white cursor-pointer w-[287px] mt-4">
                                    UPDATE EMAIL
                                </button>

                            </div>

                        </div>

                        {/* password edit */}

                        <div className="w-1/2">

                            <div className="flex flex-col items-start mt-4">

                                <p className="font-bold mt-2">Change your password</p>

                                <button
                                    onClick={() => setShowModal(true)}
                                    className="py-4 bg-gray-800 active:bg-orange-500 hover:bg-gray-900 font-bold text-white cursor-pointer w-[287px]">
                                    CHANGE PASSWORD
                                </button>

                            </div>

                        </div>

                    </div>

                    {/* appearance separation title */}

                    <div className="pl-4 mt-32">

                        <h1 className=" text-3xl font-bold">Appearance</h1>

                        <div className="border-b-4 border-orange-500 w-40 ml-[2px]"></div>

                    </div>

                    {/* appearance settings */}

                    <div className="pl-4 mt-10 flex flex-col gap-y-4 pr-4">

                        {/* theme toggle */}

                        <div className="flex justify-between items-center">

                            <p className="font-bold text-xl mr-10">Theme </p>

                            <Toggle />
                        </div>

                    </div>

                    {/* ======================================================================== */}

                    {/* modal overlay form */}
                    {showModal && (
                        <div className="fixed inset-0 flex justify-center items-center z-50 overflow-auto">

                            <div className="absolute inset-0 bg-black opacity-50" />

                            <div className="relative w-auto my-6 mx-auto max-w-3xl">

                                <div className="px-20 border-0 rounded-lg shadow-lg relative flex flex-col items-center bg-white outline-none focus:outline-none">
                                    <div className="flex items-center justify-center p-6 rounded-t">
                                        <h3 className="text-3xl font-semibold">Change Password</h3>
                                    </div>
                                    <div className="relative flex-auto">

                                        <form onSubmit={(e) => preventFormSubmit(e)} className="rounded w-full">

                                            {/* current password input */}
                                            <label className="block text-black text-sm font-bold mb-1">
                                                Current Password
                                            </label>
                                            <input
                                                onChange={(e) => { setCurrentPass(e.target.value) }}
                                                className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                                                type="password" />

                                            {/* new password input */}
                                            <label className="block text-black text-sm font-bold mb-1 mt-8">
                                                New Password
                                            </label>
                                            <input
                                                onChange={(e) => { setNewPass(e.target.value) }}
                                                className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                                                type="password" />

                                            {/* Confirm new password */}
                                            <label className="block text-black text-sm font-bold mb-1 mt-8">
                                                Confirm New Password
                                            </label>
                                            <input
                                                onChange={(e) => { setNewPassConf(e.target.value) }}
                                                className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                                                type="password" />

                                        </form>
                                    </div>
                                    <div className="flex items-center justify-end p-6 rounded-b">
                                        <button
                                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Close
                                        </button>
                                        <button
                                            onClick={updatePassword}
                                            className="text-white bg-orange-500 hover:bg-orange-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                            type="button"
                                        >
                                            UPDATE
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />


        </>

    );

}

export default Settings;