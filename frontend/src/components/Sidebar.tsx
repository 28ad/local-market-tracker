import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Sidebar() {

    const location = useLocation();

    const [activeLink, setActiveLink] = useState(location.pathname);

    useEffect(() => {
        setActiveLink(location.pathname);
    })

    const menuLinks = [
        {
            name: "Dashboard",
            route: "/dashboard"

        },
        {
            name: "Favourites",
            route: "/favourites"

        },
        {
            name: "Settings",
            route: "/settings"
        }
    ];


    const username = 'wizz28';

    return (

        <>
            <aside className="w-64 h-screen bg-gray-800 relative min-h-screen" style={{ minHeight: '100dvh' }}>

                {/* sidebar header */}
                <div className="flex items-center justify-between py-4">

                    <h1 className="text-2xl font-bold text-white ml-4">App Name</h1>

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8 text-white mr-4 cursor-pointer">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>

                </div>

                <div className="flex justify-center">
                    <div className="w-[90%] h-[1px] bg-white"></div>
                </div>

                {/* sidebar main */}

                <div className="flex flex-col mt-4">

                    {menuLinks.map(link =>
                        <Link
                            onClick={() => setActiveLink(link.route)}
                            to={link.route} key={link.name} 
                            className={`text-white text-xl cursor-pointer  py-4 pl-4 ${link.route === activeLink ? 'bg-gray-600' : 'hover:bg-gray-600'}`}>
                            <p>{link.name}</p>
                        </Link>
                    )}

                </div>

                {/* sidebar footer */}

                <footer className="absolute bottom-0 py-2 w-full cursor-pointer hover:bg-gray-600">

                    <Link to="/account" className="flex items-center justify-between gap-4">
                        <p className="text-white text-xl ml-4">{username}</p>
                        <div className="w-10 h-10 rounded-full bg-white mr-4"></div>
                    </Link>

                </footer>
            </aside>
        </>

    );

}

export default Sidebar;