import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";
import LineChart from "../components/LineChart";
import axios from "axios";


interface Product {
    id: number;
    product_name: string;
    price: number;
    addToFavourites?: boolean;
    priceChange: number;
}

interface PriceHistory {
    product_id: number;
    price: string;
    updated_on: string;
}

function Dashboard() {

    const [products, setProducts] = useState<Product[] | null>([]);
    const [favourites, setFavourites] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>();
    const [priceHistoryData, setPriceHistoryData] = useState([]);
    const [chartProductName, setChartProductName] = useState<string>('');

    const fetchFavourites = async () => {
        try {
            const res = await axios.get('http://localhost:3000/favourites');
            const favouriteIds = res.data.favourites.map((fav: Product) => fav.id);
            setFavourites(favouriteIds);
            console.log("favourite products", favouriteIds);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchProducts = async (favourites: number[]) => {

        try {
            const res = await axios.get('http://localhost:3000/products');
            const setFavStatusProducts = res.data.products.map((product: Product) => ({
                ...product,
                addToFavourites: favourites.includes(product.id),
            }));

            console.log(setFavStatusProducts);
            setProducts(setFavStatusProducts);

            setTimeout(() => { setIsLoading(false) }, 2000);

        } catch (err) {
            console.log(err);
        }
    };


    // Fetch favourites only once when the component mounts
    useEffect(() => {

        fetchFavourites();
    }, []);

    // Fetch products whenever the favourites change
    useEffect(() => {
        setIsLoading(true);

        fetchProducts(favourites).then(fetchAllPriceHistory);

    }, [favourites]);


    const fetchPriceHistory = (item: Product, product: any) => {

        axios.get(`http://localhost:3000/price-history/${item.id}`)
            .then(res => {

                const priceHistoryArr = res.data.prices;

                setPriceHistoryData(priceHistoryArr);
                setChartProductName(product);

                console.log(priceHistoryArr);
            })
            .catch(err => {

                console.log(err);

            });
    }

    const fetchAllPriceHistory = async () => {

        await fetchPriceHistory;

        axios.get(`http://localhost:3000/price-history`)
            .then(async res => {

                const priceHistoryArr: PriceHistory[] = res.data.prices;

                setProducts((prevProducts) => {

                    return prevProducts?.map(product => {

                        const matchedPriceHistory = priceHistoryArr.find(history => history.product_id === product.id);

                        console.log(matchedPriceHistory);
                        console.log(product);

                        if (matchedPriceHistory) {

                            const currentProductArr = priceHistoryArr.filter(item => item.product_id === product.id);

                            let latestPriceIndex = currentProductArr.length - 1;
                            let lastWeekIndex = latestPriceIndex - 1;

                            console.log(latestPriceIndex, lastWeekIndex);

                            if (lastWeekIndex >= 0) {
                                // Convert the price string to a number for calculations
                                const currentPrice = parseFloat(currentProductArr[latestPriceIndex].price);
                                const lastWeekPrice = lastWeekIndex >= 0 ? parseFloat(currentProductArr[lastWeekIndex].price) : currentPrice;
                                const priceChangePercentage = ((currentPrice - lastWeekPrice) / lastWeekPrice) * 100;

                                console.log(typeof (priceChangePercentage));


                                return {
                                    ...product,
                                    priceChange: Math.round(priceChangePercentage * 1e1) / 1e1 // Update the price change
                                };
                            }
                        }

                        return product;
                    }) || [];
                });


                console.log(priceHistoryArr);

            })
            .catch(err => {

                console.log(err);

            });

    }


    const toggleFavourites = async (item: Product) => {
        let favList: Product[] = [];

        setProducts((prevProducts) => {
            const updatedProducts = prevProducts?.map((product) =>
                product.id === item.id
                    ? { ...product, addToFavourites: !product.addToFavourites }
                    : product
            ) || null;

            favList = updatedProducts?.filter(product => product.addToFavourites) || [];
            console.log('Favourites List:', favList);

            return updatedProducts;
        });

        if (!item.addToFavourites) {
            await addToFavourites(item);
        } else {
            await removeFromFavourites(item.id);
        }
    };

    const addToFavourites = async (item: Product) => {
        try {
            await axios.post('http://localhost:3000/favourites/add', item);
        } catch (err) {
            console.log(err);
        }
    };

    const removeFromFavourites = async (id: number) => {
        try {
            await axios.delete(`http://localhost:3000/favourites/delete/${id}`);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="flex flex-row overflow-hidden">

            <div className="flex md:w-16">
                <Sidebar />
            </div>

            {isLoading ? <Loading /> :

                <div className="flex-1 ml-16 md:ml-0">

                    <h1 className="p-4 text-3xl font-semibold">Dashboard</h1>

                    <div className="flex justify-center">
                        <div className="w-full mx-4 h-[1px] bg-black"></div>
                    </div>

                    {priceHistoryData.length > 0 && (
                        <div className="flex justify-center items-center mt-10 gap-10">
                            <LineChart data={priceHistoryData} product={chartProductName} />
                        </div>
                    )}

                    <div className="flex flex-col justify-end items-center mt-10">

                        {/* product search */}
                        <div className="w-9/12 h-20 flex justify-center md:justify-end items-center">

                            <input
                                className="rounded-sm border border-gray-500 pl-2 py-1 text-xl focus:outline-orange-500"
                                type="text" name="search" id="search" placeholder="Search product..." />

                            <button className="p-2 bg-gray-800 active:bg-orange-500">

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>

                            </button>

                        </div>

                        {/* all products table */}
                        <table className="w-9/12 shadow-md rounded-xl mb-10">
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
                                        style={{ cursor: "pointer", height: '60px' }}
                                        onClick={() => fetchPriceHistory(item, item.product_name)}
                                    >
                                        <td className="flex justify-center items-center h-[60px]">
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
                                        <td className="text-left sm:text-center">{item.product_name}</td>
                                        <td className="text-center">{item.price}</td>

                                        {item.priceChange > 0 ? (

                                            <td className="text-center font-bold text-green-600">+{item.priceChange}%</td>
                                        ) : item.priceChange === 0 ? (<td className="text-center font-bold text-blue-600">{item.priceChange}%</td>) : (
                                            <td className="text-center font-bold text-red-600">{item.priceChange}%</td>
                                        )}

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            }


        </div>
    );
}

export default Dashboard;
