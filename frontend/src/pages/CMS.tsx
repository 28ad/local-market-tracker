import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;

function CMS() {
    const [user, setUser] = useState('');
    const navigate = useNavigate();

    const [cmsCredentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    const loginUser = () => {
    
        axios.post('http://localhost:3000/cms', cmsCredentials, { timeout: 5000 })
            .then(res => {
                if (res.data.status === 'success') {

                    setUser(res.data.user);  // This will trigger a re-render
                } else {
                    alert(res.data.error);
                }
            })
            .catch(err => {
                console.error('Error occurred:', err);
                alert('An error occurred. Please try again.');
            })
            .finally(() => {
                console.log('Request completed to http://localhost:3000/cms');
            });
    };

    // Use useEffect to log the updated user
    useEffect(() => {
        if (user) {  
            alert('Login successful');
            navigate('/cms/home');
        }
    }, [user]); // Runs when `user` changes

    // prevent form submission behaviour
    const preventFormSubmit = (e: any) => {
        e.preventDefault();
    }
    
    return(
        <>
            <div className="flex flex-col justify-center items-center h-screen">

                <h1 className="absolute top-10 text-3xl font-bold">CMS</h1>

                {/* cms login panel */}

                <div className="px-32 py-10 bg-gray-100 shadow-md rounded-md">

                    <form className="flex flex-col justify-center items-center" onSubmit={(e) => preventFormSubmit(e)}>

                        {/* login input fields */}

                        <input 
                        onChange={(e) => {setCredentials({...cmsCredentials, username: e.target.value})}}
                        type="text" placeholder="Username" 
                        className="pl-2 border focus:outline-none focus:border-orange-500 transition duration-300 py-2"/>

                        <input
                        onChange={(e) => {setCredentials({...cmsCredentials, password: e.target.value})}}
                        type="password" placeholder="Password" 
                        className="pl-2 border focus:outline-none focus:border-orange-500 transition duration-300 py-2 mt-4"/>


                        {/* submit button */}
                        <button 
                        onClick={loginUser}
                        className="px-4 py-2 bg-orange-500 text-white font-bold mt-10 cursor-pointer hover:bg-orange-600">LOGIN</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default CMS;
