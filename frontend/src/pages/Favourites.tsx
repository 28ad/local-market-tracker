import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";
import LineChart from "../components/LineChart";
import axios from "axios";
import { useState, useEffect } from "react";


interface Product {
    id: number;
    product_name: string;
    price: number;
    priceChange: number;
}

interface PriceHistory {
    product_id: number;
    price: string;
    updated_on: string;
}

function Favourites() {

    const [favourites, setFavourites] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [priceHistoryData, setPriceHistoryData] = useState([]);
    const [chartProductName, setChartProductName] = useState<string>('');


    const fetchFavourites = async () => {

        axios.get('http://localhost:3000/favourites')
            .then(res => {

                setFavourites(res.data.favourites);

                console.log(favourites);

                setTimeout(() => { setIsLoading(false) }, 2000);

            })
            .catch(err => {

                console.log(err);
            })
    }

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

                setFavourites((prevFavourites) => {

                    return prevFavourites?.map(product => {

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
                                console.log(priceChangePercentage);


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

    useEffect(() => {
        setIsLoading(true);
        fetchFavourites();
    }, []);

    useEffect(() => {
        if(favourites.length > 0) {
            fetchAllPriceHistory();
        }

    }, [favourites.length]);

    const removeFromFavourties = (itemId: number, e: React.MouseEvent) => {
        
        e.stopPropagation();

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


                <div className="flex md:w-16">
                    <Sidebar />
                </div>

                {isLoading ? <Loading /> :

                    <div className="flex-1 ml-16 md:ml-0">

                        <h1 className="p-4 text-3xl font-semibold">Favourites</h1>

                        {/* separation bar */}

                        <div className="flex justify-center">

                            <div className="w-full mx-4 h-[1px] bg-black"></div>

                        </div>


                        {/* Main graph */}

                        {priceHistoryData.length > 0 ? (
                            <div className="flex justify-center items-center mt-10 gap-10">
                                <LineChart data={priceHistoryData} product={chartProductName} />
                            </div>

                        ) : null
                        }

                        {/* products list */}

                        <div className="flex flex-col items-center mt-10">

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
                                    {favourites?.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className={index % 2 === 0 ? 'bg-gray-100 text-xl' : 'bg-white text-xl'}
                                            style={{ height: '60px', cursor: 'pointer' }}
                                            onClick={() => fetchPriceHistory(item, item.product_name)}
                                        >
                                            <td className="flex justify-center items-center h-[60px]">

                                                <svg
                                                    onClick={(e) => removeFromFavourties(item.id ,e)}
                                                    xmlns="http://www.w3.org/2000/svg" fill="gold" viewBox="0 0 24 24" strokeWidth="1.5" stroke="gold" className="size-6 cursor-pointer">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                                </svg>

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

                            {favourites.length === 0 && (
                                <div className="flex justify-center">
                                    <p className="text-2xl mt-4">You haven't saved any products to your favourites.</p>
                                </div>
                            )}


                        </div>

                    </div>
                }

                {/* Dashboard content */}



            </div>
        </>

    );

}

export default Favourites;