import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

interface Product {
    id: number;
    product_name: string;
    price: number;
    addToFavourites: boolean;
}


function Dashboard() {

    const [products, setProducts] = useState<Product[] | null>([]);

    const fetchProducts = () => {

        axios.get('http://localhost:3000/products')
            .then(res => {

                setProducts(res.data.products);

            })
            .catch(err => {

                console.log(err);
            })
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    // toggle favourite state of each product
    const toggleFavourites = async (item: Product) => {

        let favList: Product[] = [];

        console.log('toggle function');

        // Update the products state
        setProducts((prevProducts) => {
            const updatedProducts = prevProducts?.map((product) =>
                product.id === item.id
                    ? { ...product, addToFavourites: !product.addToFavourites }
                    : product
            ) || null;

            // After updating the state, filter out the favourite items
            favList = updatedProducts?.filter(product => product.addToFavourites) || [];

            // Log or use favList as needed
            console.log('Favourites List:', favList);

            return updatedProducts;
        });

        console.log('before post req');

        await addToFavourites(item);
    };

    // add favourited products to DB table 'favourites'
    const addToFavourites = async (item: Product) => {

        console.log('list passed');

            // post request to save products to 'favourites' table
            axios.post('http://localhost:3000/favourites/add', item)
                .then(res => {

                    console.log(res.data);

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

                    <h1 className="p-4 text-3xl font-semibold">Dashboard</h1>

                    {/* separation bar */}

                    <div className="flex justify-center">

                        <div className="w-full mx-4 h-[1px] bg-black"></div>

                    </div>


                    {/* Main graph */}

                    <div className="flex justify-center items-center mt-10 gap-10">

                        <div className="w-9/12 h-96 bg-red-500"></div>

                    </div>

                    {/* products list */}

                    <div className="flex justify-center mt-10">

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
                                {products?.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className={index % 2 === 0 ? 'bg-gray-100 text-xl ' : 'bg-white text-xl'}
                                    >

                                        {/* product_id and name */}
                                        <td className="flex justify-center items-center">

                                            {/* add item to favourites list */}

                                            {item.addToFavourites ? (

                                                <svg
                                                    onClick={() => toggleFavourites(item)}
                                                    xmlns="http://www.w3.org/2000/svg" fill="gold" viewBox="0 0 24 24" strokeWidth="1.5" stroke="gold" className="size-6 cursor-pointer">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                                </svg>
                                            ) : (

                                                <svg
                                                    onClick={() => toggleFavourites(item)}
                                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="gold" className="size-6 cursor-pointer">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                                </svg>
                                            )}



                                        </td>
                                        <td className="text-center">{item.product_name}</td>
                                        <td className="text-center">{item.price}</td>
                                        <td className="text-center">{ }</td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>
        </>

    );

}

export default Dashboard;