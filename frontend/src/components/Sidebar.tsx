import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Sidebar() {

    const location = useLocation();

    const [activeLink, setActiveLink] = useState(location.pathname);
    const [isMenuClosed, setIsMenuClosed] = useState(false);

    useEffect(() => {
        setActiveLink(location.pathname);
    })

    const toggleSidebar = () => {

        setIsMenuClosed(!isMenuClosed);

        console.log(isMenuClosed);
    }

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
            <aside className={`${isMenuClosed ? 'w-full sm:w-64' : 'w-16'} bg-gray-800 fixed min-h-screen`} style={{ minHeight: '100dvh', }}>

                {isMenuClosed ? (

                    <>
                        {/* sidebar header */}
                        <div className="flex items-center justify-between py-4">

                            <h1 className="text-2xl font-bold text-white ml-4">VMTracker</h1>

                            <svg
                                onClick={toggleSidebar}
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8 text-white mr-4 cursor-pointer hover:text-orange-500 transition ease-in-out duration-300">
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
                                    className={`text-white text-xl cursor-pointer  py-4 pl-4 ${link.route === activeLink ? 'bg-orange-500' : 'hover:bg-gray-500'} transition ease-in-out duration-300`}>
                                    <p>{link.name}</p>
                                </Link>
                            )}

                        </div>

                        {/* sidebar footer */}

                        <footer className="absolute bottom-0 py-2 w-full cursor-pointer hover:bg-gray-600 transition ease-in-out duration-300">

                            <Link to="/account" className="flex items-center justify-between gap-4">
                                <p className="text-white text-xl ml-4">{username}</p>
                                {/* user proifle picture */}
                                <div className="w-10 h-10 rounded-full bg-white mr-4"></div>
                            </Link>

                        </footer>
                    </>

                ) : (

                    <>
                        <div className="flex justify-center items-center p-2">
                            <svg
                                onClick={toggleSidebar}
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8 text-white cursor-pointer hover:text-orange-500 transition ease-in-out duration-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </div>

                        <footer className="absolute bottom-0 py-2 w-full cursor-pointer hover:bg-gray-600">

                            <Link to="/account" className="flex items-center justify-center p-2">
                                {/* user proifle picture */}
                                <div className="w-10 h-10 rounded-full bg-white"></div>
                            </Link>

                        </footer>
                    </>

                )}


            </aside>
        </>

    );

}

export default Sidebar;