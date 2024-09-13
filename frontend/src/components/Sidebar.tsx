import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from '../assets/images/logo.png';

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

    return (

        <>
            <aside className={`${isMenuClosed ? 'w-full sm:w-64' : 'w-16'} transition-all duration-300 ease-in-out bg-gray-800 fixed min-h-screen`} style={{ minHeight: '100dvh', }}>

                {isMenuClosed ? (

                    <>
                        {/* sidebar header */}
                        <div className="flex items-center justify-between py-4">

                            <img src={Logo} className="w-20 ml-4"/>

                            <svg
                                onClick={toggleSidebar}
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8 text-white mr-4 cursor-pointer hover:text-orange-500 transition ease-in-out duration-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
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
                                    className={`text-white text-xl font-bold cursor-pointer  py-4 pl-4 ${link.route === activeLink ? 'bg-orange-500' : 'hover:bg-gray-500'} transition ease-in-out duration-300`}>
                                    <p>{link.name}</p>
                                </Link>
                            )}

                        </div>

                        {/* sidebar footer */}

                        <footer className="absolute bottom-0 py-2 w-full cursor-pointer hover:bg-gray-600 transition ease-in-out duration-300">

                            <Link to="/account" className="flex items-center justify-center py-2 gap-4">
                                <p className="text-white text-xl ml-4 font-bold">LOG OUT</p>
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
                                <div>
                                    <img src={Logo} />
                                </div>
                            </Link>

                        </footer>
                    </>

                )}


            </aside>
        </>

    );

}

export default Sidebar;