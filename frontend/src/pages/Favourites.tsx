import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useState, useEffect } from "react";

interface Product {
    id: number;
    product_name: string;
    price: number;
    addToFavourites: boolean;
}

function Favourites() {

    const [favourites, setFavourites] = useState<Product[]>([]);

    const fetchFavourites = () => {

        axios.get('http://localhost:3000/favourites')
            .then(res => {

                setFavourites(res.data.favourites);

                console.log(res.data.favourites);

            })
            .catch(err => {

                console.log(err);
            })
    }

    useEffect(() => {
        fetchFavourites();
    }, []);

    const removeFromFavourties = (itemId: number) => {

        axios.delete(`http://localhost:3000/favourites/delete/${itemId}`)
            .then(res => {

                console.log(res);
                fetchFavourites();

            })
            .catch(err => {

                console.log(err);
            });
    }

    return (

        <>

            <div className="flex flex-row overflow-hidden">

                <Sidebar />

                {/* Dashboard content */}

                <div className="flex-1">

                    <h1 className="p-4 text-3xl font-semibold">My Favourites</h1>

                    {/* separation bar */}

                    <div className="flex justify-center">

                        <div className="w-full mx-4 h-[1px] bg-black"></div>

                    </div>


                    {/* Main graph */}

                    {/* <div className="flex justify-center items-center mt-10 gap-10">

                        <div className="w-9/12 h-96 bg-red-500"></div>

                    </div> */}

                    {/* products list */}

                    <div className="flex flex-col items-center mt-10">

                        <table className="w-9/12 shadow-md rounded-xl py-8">
                            <thead>
                                <tr className="h-16 text-xl">
                                    <th className="w-8"></th>
                                    <th className="w-[150px]">Product</th>
                                    <th className="w-[150px]">Price/kg (RON)</th>
                                    <th className="w-[150px]">Last Week Change</th>
                                </tr>
                            </thead>

                            <tbody>
                                {favourites?.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className={index % 2 === 0 ? 'bg-gray-100 text-xl' : 'bg-white text-xl'}
                                    >
                                        <td className="flex justify-center items-center">

                                            <svg
                                                onClick={() => removeFromFavourties(item.id)}
                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="red" className="size-6 cursor-pointer">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                            </svg>


                                        </td>
                                        <td className="text-center">{item.product_name}</td>
                                        <td className="text-center">{item.price}</td>
                                        <td className="text-center"></td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>

                        {favourites.length === 0 && (
                            <div className="flex justify-center">
                                <p className="text-2xl mt-4">You haven't saved any products to your favourites.</p>
                            </div>
                        )}


                    </div>

                </div>

            </div>
        </>

    );

}

export default Favourites;