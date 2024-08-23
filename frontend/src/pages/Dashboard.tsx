import Sidebar from "../components/Sidebar";

function Dashboard() {

    return(

        <>
        <div className="flex flex-row overflow-hidden">

           <Sidebar/>

           {/* Dashboard content */}

           <div className="flex-1">

            <h1 className="p-4 text-3xl font-semibold">Dashboard</h1>

            {/* separation bar */}

            <div className="flex justify-center">

                <div className="w-full mx-4 h-[1px] bg-black"></div>

            </div>
            

                {/* Main graph */}

                <div className="flex justify-center items-center mt-10 gap-10">

                    <div className="w-9/12 h-96 bg-red-500"></div>
                    
                </div>


           </div>

        </div>
        </>

    );

}

export default Dashboard;