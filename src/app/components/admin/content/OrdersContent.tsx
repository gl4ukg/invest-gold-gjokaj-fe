'use client';

import React, { useState, useEffect } from 'react';
import OrdersService, { OrderStatus } from '@/app/services/orders';
import { format } from 'date-fns';
import { Order } from '@/app/services/orders';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.PROCESSING);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await OrdersService.getAll();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  const toggleRow = (orderId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };


  const statusColors: { [key: string]: string } = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const paymentMethod: { [key: string]: string } = {
    paypal: "PayPal",
    card: "Credit Card",
    bank_transfer: "Bank Transfer",
    cash_on_delivery: "Cash on Delivery",
  };

  const shippingMethod: { [key: string]: string } = {
    local: "Local Delivery",
    international: "International Delivery",
  };


  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    setIsLoading(true);
    try {
      const updatedOrder = await OrdersService.updateOrderStatus(orderId, newStatus);
      setStatus(updatedOrder.status);
      // Update the order in the orders list
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: updatedOrder.status } : order
        )
      );
      toast.success('Statusi u përditësua me sukses!');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Ndodhi një gabim gjatë përditësimit të statusit.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">Numri porosise</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">Klienti</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">Totali</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">Statusi</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">Data</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-darkGray">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-darkGray">{order.shippingAddress.fullName}</div>
                    <div className="text-sm text-darkGray">{order.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-darkGray">
                    €{Number(order.total).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative inline-block">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id!, e.target.value as OrderStatus)}
                        className={`pl-3 pr-8 py-1 text-sm font-semibold rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${statusColors[order.status]} border-transparent`}
                        disabled={isLoading}
                      >
                        <option value={OrderStatus.PENDING}>Në pritje</option>
                        <option value={OrderStatus.PROCESSING}>Procesuar</option>
                        <option value={OrderStatus.SHIPPED}>Dërguar</option>
                        <option value={OrderStatus.DELIVERED}>Dorëzuar</option>
                        <option value={OrderStatus.CANCELLED}>Anulluar</option>
                      </select>
                      {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-full">
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-darkGray">
                    {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => toggleRow(order.id)} className="text-darkGray hover:text-gray-700">
                      {expandedRows[order.id] ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </td>
                </tr>
                {expandedRows[order.id] && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 bg-gray-50">
                      <div className="space-y-4 text-darkGray">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-darkGray">Shipping Address</h4>
                            <div className="text-sm text-gray-600">
                              <p className='capitalize'>{order.shippingAddress.fullName}</p>
                              <p className='capitalize'>{order.shippingAddress.address}</p>
                              <p className='capitalize'>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                              <p className='capitalize'>{order.shippingAddress.country}</p>
                              <p>{order.shippingAddress.phone}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-darkGray">Order Details</h4>
                            <div className="text-sm text-gray-600">
                              <p>Pagesa: {paymentMethod[order.paymentMethod]}</p>
                              <p>Transporti: {shippingMethod[order.shippingMethod]}</p>
                              <p>Subtotal: €{Number(order.subtotal).toFixed(2)}</p>
                              <p>Qmimi i transporit: €{Number(order.shippingCost).toFixed(2)}</p>
                              <p className="font-medium">Total: €{Number(order.total).toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-darkGray mb-2">Items</h4>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item?.id} className="flex justify-between items-center text-sm">
                                <div className='flex flex-col'>
                                    <span>Produkti: {item?.product?.name}</span>
                                    <span>Sasia: {item?.quantity}</span>
                                </div>
                                <span>€{Number(item?.total).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
