'use client';
import React, { useEffect, useState } from 'react';
import OrdersService from '@/app/services/orders';
import { Order } from '@/app/types/order.types';
import Pagination from '../Pagination';

const OrdersContent: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(orders.length / itemsPerPage);

    const fetchOrders = async () => {
        try {
            const data = await OrdersService.getAll();
            // setOrders(data);
            setError(null);
        } catch (err) {
            setError('Marrja e të dhënave dështoi');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // const handleStatusUpdate = async (id: string, status: Order['status']) => {
    //     try {
    //         await OrdersService.updateStatus(id, status);
    //         fetchOrders(); // Refresh the list
    //         setError(null);
    //     } catch (err) {
    //         setError('Ndrrimi i statusit deshtoi');
    //         console.error(err);
    //     }
    // };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg border shadow">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-darkGray mb-4">Porositë</h2>
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">
                                    Id e porosise
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">
                                    Statusi
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">
                                    Totali
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">
                                    Items
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">
                                    Adresa e Dergeses
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">
                                    Veprimet
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((order) => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-darkGray">#{order.id}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : 
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                            'bg-gray-100 text-darkGray'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-darkGray">${order.total.toFixed(2)}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-darkGray">
                                            {order.items.length} items
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-darkGray">
                                            {order.shippingAddress.street}, {order.shippingAddress.city}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={order.status}
                                            // onChange={(e) => handleStatusUpdate(order.id!, e.target.value as Order['status'])}
                                            className="text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="pending">Në pritje</option>
                                            <option value="processing">Procesuar</option>
                                            <option value="completed">Kompletuar</option>
                                            <option value="cancelled">Anulluar</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default OrdersContent;
