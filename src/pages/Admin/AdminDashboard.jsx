import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';  // Import Bar chart from react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showOrders, setShowOrders] = useState(false); // State to toggle orders visibility
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        // Fetch orders from the backend (no token required)
        fetch('https://vynceianoani.helioho.st/cedeno/admin-orders.php', {
            method: 'GET'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch orders.');
            }
            return response.json();
        })
        .then(data => {
            setOrders(data);
            setLoading(false);
            updateChartData(data);  // Update the chart when data is fetched
        })
        .catch(err => {
            console.error(err);
            setError(err.message);
            setLoading(false);
        });
    }, []);

    const toggleOrders = () => {
        setShowOrders(!showOrders);
    };

    const updateChartData = (orders) => {
        const productNames = [];
        const totalPrices = [];
        const totalItems = [];

        // Calculate total price and total items per product
        orders.forEach(order => {
            const productIndex = productNames.indexOf(order.product_name);
            if (productIndex === -1) {
                productNames.push(order.product_name);
                totalPrices.push(order.total_price);
                totalItems.push(order.total_items);
            } else {
                totalPrices[productIndex] += order.total_price;
                totalItems[productIndex] += order.total_items;
            }
        });

        // Set chart data for both Total Price and Total Items
        setChartData({
            labels: productNames,
            datasets: [
                {
                    label: 'Total Price per Product',
                    data: totalPrices,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                },
                {
                    label: 'Total Items per Product',
                    data: totalItems,
                    backgroundColor: 'rgba(255, 159, 64, 0.6)',
                },
            ],
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="admin-dashboard bg-transparent min-h-screen flex flex-col items-center justify-center">
            <button
                onClick={toggleOrders}
                className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg mb-6 hover:bg-blue-600 transition duration-200"
            >
                {showOrders ? 'Hide Orders' : 'Show Orders'}
            </button>

            {showOrders && (
                <div className="w-full max-w-6xl p-4 bg-white bg-opacity-70 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-center mb-6">Orders</h2>

                    {/* Chart component to display order data */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Total Price and Total Items per Product</h3>
                        <Bar data={chartData} />
                    </div>

                    {orders.length === 0 ? (
                        <p>No orders available.</p>
                    ) : (
                        <table className="w-full table-auto border-collapse border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Order ID</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">User ID</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">User Name</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Quantity</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Order Date</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Total Price</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Total Items</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id} className="even:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-2 text-center">{order.id}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">{order.user_id}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">{order.username}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">{order.quantity}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">{new Date(order.order_date).toLocaleString()}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">{order.total_price}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">{order.total_items}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
