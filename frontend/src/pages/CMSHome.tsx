import { useEffect, useState } from "react";
import axios from "axios";
import '../assets/index.css'; // Make sure to import the CSS file

function CMSHome() {
    interface UserData {
        username: string;
        email: string;
    }

    interface Product {
        id: number;
        product_name: string;
        price: string;
    }

    const [newProductDetails, setNewProductDetails] = useState({
        product_name: '',
        price: ''
    });

    const [editedProductPrice, setEditedProductPrice] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState<UserData | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [editProductId, setEditProductId] = useState<number | null>(null);

    // prevent form submission behaviour
    const preventFormSubmit = (e: any) => {
        e.preventDefault();
    };

    const validateForm = () => {


        if (!newProductDetails.product_name.trim()) {

            alert('Product name is required.');
            return false;
        }

        if (!newProductDetails.price.trim()) {


            alert('Price is required.');
            return false;

        } else if (!/^\d+(\.\d{1,2})?$/.test(newProductDetails.price)) {


            alert('Price must be a valid number with up to 2 decimal places.');
            return false;

        }

        return true;

    };

    const fetchAuthUser = async () => {
        try {
            const res = await axios.get('http://localhost:3000/authenticate');
            // If the request is successful (status code 200)
            setLoggedInUser(res.data.user);
        } catch (error) {
            // Check if the error is an AxiosError and has a response property
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401) {
                    // Handle the 401 Unauthorized error
                    alert('Session expired. Please log in again.');
                    window.location.href = '/cms'; // Redirect to login page or home
                } else {
                    // Handle other errors if needed
                    console.error('Error fetching auth user:', error.response.data);
                    alert('An error occurred. Please try again.');
                }
            } else {
                // Handle cases where error is not an AxiosError
                console.error('Unexpected error:', error);
                alert('An unexpected error occurred. Please try again.');
            }
        }
    };

    const logout = () => {

        axios.get('http://localhost:3000/logout')
            .then(res => {

                if (res.data.status === 'success') {
                    window.location.href = '/cms';
                }

            })
            .catch(err => {
                alert(err);
            });
    }

    const fetchProductsList = () => {
        axios.get('http://localhost:3000/products')
            .then(res => {
                setProducts(res.data.products);
            })
            .catch(err => {
                alert(err);
            });
    };

    useEffect(() => {
        fetchAuthUser();
        fetchProductsList();
    }, []);

    // add new price to 'price_history' table

    const updatePriceHistory = (itemId: number, price: string) => {

        let date = new Date();
        let mySqlDate = date.toISOString().slice(0, 10);

        let newPriceObj = {
            productId: itemId,
            price: price,
            date: mySqlDate
        }

        axios.post('http://localhost:3000/price-history/new', newPriceObj)
            .then(res => {

                if (res.data.error) {

                    alert(res.data.error);
                    return;
                }

                console.log(res.data.message)
            })
            .catch(err => {

                console.log(err);
            });
    }

    // add a product to the database
    const addProduct = () => {

        let newProductId;


        if (!validateForm()) {
            return;
        }

        axios.post('http://localhost:3000/cms/add-product', newProductDetails)
            .then(res => {

                if(res.data.Error) {

                    alert(res.data.Error);
                    return;
                }

                newProductId = res.data.product_id;

                console.log(typeof(newProductId) + newProductId);

                updatePriceHistory(newProductId, newProductDetails.price)

                fetchProductsList(); // Refresh the products list
            })
            .catch(err => {
                alert(err);
            });

        setShowModal(false);
    };

    // function to toggle editMode
    const toggleEditMode = (itemId: number) => {
        if (editProductId === itemId) {
            setEditProductId(null); // Deselect the row if it's already in edit mode
        } else {
            setEditProductId(itemId); // Set the current product id to edit mode
        }

    };


    // edit a product's details
    const editProduct = (itemId: number) => {

        if (!/^\d+(\.\d{1,2})?$/.test(editedProductPrice)) {


            alert('Price must be a valid number with up to 2 decimal places.');
            return;

        }

        if (editedProductPrice === '') {

            alert("You must enter a value for the product's price !")
            return;

        }

        // const product_price = Number(editedProductPrice);

        axios.put(`http://localhost:3000/cms/edit-product/${itemId}`, { price: editedProductPrice })
            .then(res => {

                alert(res.data.Message);
                fetchProductsList();
                setEditProductId(null);

            })
            .catch(err => {

                alert(err);
            });

            updatePriceHistory(itemId, editedProductPrice)
    };

    // remove a product from the DB
    const removeProduct = (itemId: number) => {

        axios.delete(`http://localhost:3000/cms/remove-product/${itemId}`)
            .then(res => {

                fetchProductsList();
            })
            .catch(err => {
                alert(err);
            });


    };

    return (
        <>
            <div className="flex flex-col items-center">

                {/* CMS header */}
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl font-bold">CMS Home</h1>
                    <p>Welcome, {loggedInUser ? loggedInUser.username : 'Loading...'}</p>
                    <p>{loggedInUser ? loggedInUser.email : 'Loading...'}</p>
                    <button
                        onClick={logout}
                        className="py-2 px-8 text-white font-bold bg-red-600 hover:bg-red-700 shadow-md cursor-pointer rounded-sm"
                    >Logout</button>
                </div>

                {/* Products section */}
                <div className="flex flex-col items-center mt-20 w-full">

                    {/* add button */}
                    <div className="w-9/12">
                        <button
                            onClick={() => setShowModal(true)}
                            className="rounded-sm shadow-md px-10 py-2 text-white font-bold bg-green-600 cursor-pointer hover:bg-green-700">ADD PRODUCT</button>
                    </div>

                    {/* products table */}
                    <table className="w-9/12 shadow-md rounded-md mt-8">
                        <thead>
                            <tr className="h-16 text-2xl">
                                <th className="w-[200px]">ID</th>
                                <th className="w-[200px]">Product</th>
                                <th className="w-[200px]">Price/kg (RON)</th>
                                <th className="w-0"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className={index % 2 === 0 ? 'bg-gray-100 text-xl ' : 'bg-white text-xl'}
                                >

                                    {/* product_id and name */}
                                    <td className="text-center">{item.id}</td>
                                    <td className="text-center">{item.product_name}</td>

                                    {/* toggle edit mode for products price */}
                                    {editProductId === item.id ? (
                                        <>
                                            <td className=""><input

                                                onChange={(e) => {
                                                    setEditedProductPrice(e.target.value)
                                                }}
                                                placeholder={item.price}

                                                className="w-full text-center border-2 border-blue-700 focus:outline-blue-700"
                                                type="text" /></td>
                                        </>
                                    ) : (
                                        <>

                                            <td className="text-center">{item.price}</td>

                                        </>
                                    )}

                                    <td className="flex justify-center">

                                        {editProductId === item.id ? (
                                            <>
                                                {/* save changes button */}
                                                <svg
                                                    onClick={() => editProduct(item.id)}
                                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-green-600 cursor-pointer">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>

                                                {/* cancel button */}
                                                <svg
                                                    onClick={() => setEditProductId(null)}
                                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-red-500 cursor-pointer">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>


                                            </>
                                        ) : (
                                            <>
                                                {/* edit button */}
                                                <svg
                                                    onClick={() => toggleEditMode(item.id)}
                                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 cursor-pointer text-blue-700">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                </svg>

                                                {/* remove button */}
                                                <svg
                                                    onClick={() => removeProduct(item.id)}
                                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="red" className="size-6 cursor-pointer">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </>
                                        )}

                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* modal overlay form */}
            {showModal && (
                <div className="fixed inset-0 flex justify-center items-center z-50 overflow-auto">

                    <div className="absolute inset-0 bg-black opacity-50" />

                    <div className="relative w-auto my-6 mx-auto max-w-3xl">

                        <div className="px-20 border-0 rounded-lg shadow-lg relative flex flex-col items-center bg-white outline-none focus:outline-none">
                            <div className="flex items-center justify-center p-6 rounded-t">
                                <h3 className="text-3xl font-semibold">Product Details</h3>
                            </div>
                            <div className="relative flex-auto">

                                <form onSubmit={(e) => preventFormSubmit(e)} className="rounded w-full">

                                    <label className="block text-black text-sm font-bold mb-1">
                                        Product Name
                                    </label>
                                    <input
                                        onChange={(e) => { setNewProductDetails({ ...newProductDetails, product_name: e.target.value }) }}
                                        className="shadow appearance-none border rounded w-full py-2 px-1 text-black" />


                                    <label className="block text-black text-sm font-bold mb-1 mt-8">
                                        Price (RON/kg)
                                    </label>
                                    <input
                                        onChange={(e) => { setNewProductDetails({ ...newProductDetails, price: e.target.value }) }}
                                        className="shadow appearance-none border rounded w-full py-2 px-1 text-black" />

                                </form>
                            </div>
                            <div className="flex items-center justify-end p-6 rounded-b">
                                <button
                                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                >
                                    Close
                                </button>
                                <button
                                    className="text-white bg-orange-500 hover:bg-orange-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                    type="button"
                                    onClick={() => addProduct()}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {products.length === 0 && (
                <div className="flex justify-center">
                    <p className="w-9/12 text-2xl mt-4">No products in the database.</p>
                </div>
            )}
        </>
    );
}

export default CMSHome;
