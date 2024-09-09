import Logo from '../assets/images/logo.png';

function Home() {

    return (

        <>
            {/* container */}
            <div className="bg-gray-800 h-screen overflow-x-hidden">

                <header className="w-full border-b h-20 border-gray-400 flex justify-center items-center">
                    <img src={Logo} className="w-28 cursor-pointer"/>
                </header>

                {/* hero section */}

                <section className="w-full flex justify-center items-center px-2 h-[calc(100vh-80px)]">


                    <div className="flex flex-col justify-center md:flex-row md:justify-evenly items-center md:gap-x-10">

                        {/* hero image */}
                        <div className="bg-gray-500 min-w-[350px] max-w-[400px] h-[280px]">

                        </div>


                        {/* content */}
                        <div className="min-w-[350px] max-w-[400px] flex flex-col items-center md:items-start mt-10 md:mt-0">

                            {/* text */}
                            <div className="w-[350px]">
                                <h1 className="text-3xl text-white text-center md:text-left">Your Digital Guide To Fresh Local Produce, Meats & Dairy</h1>
                            </div>

                            {/* buttons */}

                            <div className="flex justify-start mt-4 gap-4">
                                <button className="px-6 py-2 rounded-xl border-2 border-orange-500 text-white font-bold cursor-pointer transition ease-in-out duration-300 hover:scale-105">GET STARTED</button>
                                <button className="px-6 py-2 rounded-xl bg-orange-500 text-white font-bold cursor-pointer hover:bg-orange-600 transition ease-in-out duration-300 hover:scale-105">SIGN IN</button>

                            </div>

                        </div>

                    </div>

                </section>

                {/* view products info section */}

                <section className="w-full flex flex-col items-center h-3/4 px-2">

                    {/* title */}
                    <h1 className="text-3xl text-white text-center">Select & view the prices of all local products</h1>

                    {/* image + desccription */}
                    <div className="lg:w-2/4 flex mt-10 flex-col items-center md:flex-row md:items-start gap-4">

                        {/* dashboard image */}
                        <div className="bg-gray-500 min-w-[350px] max-w-[400px] h-[280px]">

                        </div>

                        <p className="text-white text-justify md:text-left">Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus cumque magnam aspernatur voluptatem at itaque! Consequatur ab fugiat quasi suscipit, sunt illo, blanditiis doloribus minus architecto ex, fugit dolor vel.</p>

                    </div>

                </section>

                {/* add to favourites info section */}

                <section className="w-full flex flex-col items-center mt-20 px-2">

                    {/* title */}
                    <h1 className="text-3xl text-white text-center">Track the products you want</h1>

                    {/* image + desccription */}
                    <div className="lg:w-2/4 flex mt-10 flex-col items-center md:flex-row md:items-start gap-4">

                        {/* dashboard image */}
                        <div className="bg-gray-500 min-w-[350px] max-w-[400px] h-[280px]">

                        </div>

                        <p className="text-white text-justify md:text-left">Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus cumque magnam aspernatur voluptatem at itaque! Consequatur ab fugiat quasi suscipit, sunt illo, blanditiis doloribus minus architecto ex, fugit dolor vel.</p>

                    </div>

                </section>

                <footer className="w-full h-64 border-t border-gray-400 mt-20">

                </footer>


            </div>
        </>
    )
}




export default Home;