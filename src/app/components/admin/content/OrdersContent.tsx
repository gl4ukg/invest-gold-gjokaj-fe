'use client';

import React, { useState, useEffect } from 'react';
import OrdersService, { OrderStatus } from '@/app/services/orders';
import { format } from 'date-fns';
import { Order } from '@/app/services/orders';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import PaymentsService from '@/app/services/paymets';
import Pagination from '../Pagination';

export default function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.PROCESSING);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredOrders = orders.filter(order => 
    (order.paymentMethod === 'card' && order.paymentStatus === 'success') || 
    (order.paymentMethod === 'cash_on_delivery')
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await OrdersService.getAll();
      setOrders(data);
    };
    fetchOrders();
  }, [isLoading]);

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
        prevOrders?.map(order => 
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

  const handleRefund = async (transactionId: string) => {
    setIsLoading(true);
    try {
      const response = await PaymentsService.refundOrder(transactionId);
      if(response.message) {
        toast.success(response.message);
      }
    } catch (error) {
      console.error('Error refunding order:', error);
      toast.error('Ndodhi një gabim gjatë rimbursimit.');
    } finally {
      setIsLoading(false);
    }
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const colorTypes: Record<string, string> = {
    'single': "Nje ngjyresh",
    'two': "Dy ngjyresh",
    'three': "Tre ngjyresh",
  }

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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">Rimbursimi</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((order) => (
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
                        onChange={(e) => {
                          if(order.status !== OrderStatus.REFUNDED) {
                            handleStatusUpdate(order.id!, e.target.value as OrderStatus)
                          } 
                          return;
                        }}
                        className={`pl-3 pr-8 py-1 text-sm font-semibold rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${statusColors[order.status]} border-transparent`}
                        disabled={isLoading || order.status === OrderStatus.REFUNDED}
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
                    {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm:ss')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {order.paymentMethod === 'card' 
                      ? (
                        order.status !== OrderStatus.REFUNDED 
                          ? (<button onClick={() => handleRefund(order.id)} className="border border-red-500 rounded-full px-2 py-1 text-red-500 hover:text-red-600">Rimburso</button>)
                          : <p className="text-red-500">U rimbursua</p>
                        )
                      : <p className="text-darkGray">Pagese me kesh</p>}
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
                            <h4 className="font-medium text-darkGray">Adresa e Transportit</h4>
                            <div className="text-sm text-gray-600">
                              <p className='capitalize'>Emri: {order.shippingAddress.fullName}</p>
                              <p className='capitalize'>Adresa: {order.shippingAddress.address}</p>
                              <p className='capitalize'>Qyteti: {order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                              <p className='capitalize'>Shteti: {order.shippingAddress.country}</p>
                              <p>Telefoni: {order.shippingAddress.phone}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-darkGray">Detajet e porosise</h4>
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
                          <h4 className="font-medium text-darkGray mb-2">Produktet</h4>
                          <div className="space-y-2">
                            {order.items?.map((item) => (
                              <div key={item?.id} className="flex border-b border-gray-200 p-2 justify-between items-center text-sm">
                                <div className="flex flex-col gap-1">
                                    <span><b>Produkti:</b> {item?.product?.name}</span>
                                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                                        <div className="flex flex-wrap gap-4 p-4 text-sm">
                                            <div className="space-y-1">
                                                <div className="font-semibold text-gray-900">Pesha</div>
                                                <div>{item?.configuration?.weight}g</div>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="font-semibold text-gray-900">Profili</div>
                                                <div>{item?.configuration?.selectedProfile}</div>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="font-semibold text-gray-900">Dimensionet</div>
                                                <div className="space-y-0.5">
                                                    <div>Gjerësia × Lartësia: {item?.configuration?.dimensions?.profileWidth}×{item?.configuration?.dimensions?.profileHeight}mm</div>
                                                    <div>Sistemi i unazes: {item?.configuration?.dimensions?.ringSizeSystem} </div>
                                                    <div>Madhësia: {item?.configuration?.dimensions?.ringSize}</div>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="font-semibold text-gray-900">Metali</div>
                                                <div className="space-y-0.5">
                                                    <div>Lloji: {colorTypes[item?.configuration?.preciousMetal?.colorType ?? '']}</div>
                                                    {item?.configuration?.preciousMetal?.colors?.map((color, idx) => (
                                                        <div key={idx} className="text-gray-600">
                                                            Ngjyra {idx+1}: {color.metalColor} ({color.fineness}) ({color.polishType})
                                                        </div>
                                                    ))}
                                                    {(item?.configuration?.preciousMetal?.colors?.length ?? 0) > 1 && (
                                                        <div className="text-gray-600">
                                                            <span>Forma: </span>
                                                            {item.configuration?.preciousMetal?.shape?.category} {item.configuration?.preciousMetal?.shape?.variant} 
                                                        </div>
                                                    )}
                                                    {((item?.configuration?.preciousMetal?.colors?.length ?? 0) > 1 && item.configuration?.preciousMetal?.shape?.heightPercentage !== undefined) && (
                                                        <div className="text-gray-600">
                                                            <span>Lartesia: </span>
                                                            {item.configuration?.preciousMetal?.shape?.heightPercentage}%
                                                        </div>
                                                    )}
                                                    {((item?.configuration?.preciousMetal?.colors?.length ?? 0) > 1 && item.configuration?.preciousMetal?.shape?.waveCount !== undefined) && (
                                                        <div className="text-gray-600">
                                                            <span>Numri i valave: </span>
                                                            {item.configuration?.preciousMetal?.shape?.waveCount}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="font-semibold text-gray-900">Guret</div>
                                                {(() => {
                                                    const settingType = item?.configuration?.stoneSettings?.settingType;
                                                    if (settingType === "No stone") {
                                                        return <div>Nuk ka gure</div>;
                                                    } else if (settingType === "Free Stone Spreading") {
                                                        return (
                                                          <div className='space-y-0.5'>
                                                            {item?.configuration?.stoneSettings.stones?.map((stone, idx) => (
                                                              <div key={idx}>
                                                                <div className="text-gray-600">
                                                                  <p>Guri: {idx+1}</p>
                                                                  <p>Madhesia:{stone.size}</p>
                                                                  <p>Cilësia: {stone.quality}</p>
                                                                  <p>Pozicioni: (X:{stone.x?.toFixed(2)}mm, Y:{stone.y?.toFixed(2)}mm)</p>
                                                                </div>
                                                                <br />
                                                              </div>
                                                            ))}
                                                          </div>
                                                        )
                                                    } else {
                                                        return (
                                                            <div className="space-y-0.5">
                                                                <div>Lloji: {item?.configuration?.stoneSettings?.stoneType}</div>
                                                                <div>Permasat: {item?.configuration?.stoneSettings?.stoneSize}</div>
                                                                <div>Cilesia: {item?.configuration?.stoneSettings?.stoneQuality}</div>
                                                                <div>Numri i gureve: {item?.configuration?.stoneSettings?.numberOfStones}</div>
                                                                <div>Pozicioni: {item?.configuration?.stoneSettings?.position}</div>
                                                                {item?.configuration?.stoneSettings?.position === "Free" ? `(${Math.abs(item?.configuration?.stoneSettings?.offset || 0)}mm ${Number(item?.configuration?.stoneSettings?.offset) > 0 ? 'Right' : 'Left'})` : ''}
                                                            </div>
                                                        );
                                                    }
                                                })()}
                                            </div>

                                            {item.configuration?.groovesAndEdges?.groove[0].grooveType !== "" ? item.configuration?.groovesAndEdges?.groove.map((groove, idx) => (
                                                <div key={idx} className="space-y-1">
                                                    <div className="font-semibold text-gray-900">Gravimi {idx+1}</div>
                                                    <div className="space-y-0.5">
                                                        <div>Lloji: {groove?.grooveType}</div>
                                                        <div>Thellesia: {groove?.depth}mm</div>
                                                        <div>Gjerësia: {groove?.width}mm</div>
                                                        <div>Siperfaqja: {groove?.surface}</div>
                                                        <div>Drejtimi: {groove?.direction}</div>
                                                        <div>Pozicioni: {groove?.position}mm</div>
                                                        {groove?.direction === "wave" 
                                                          ? <>
                                                          <div>Numri i valeve: {groove?.numberOfWaves}</div>
                                                          <div>Lartësia e valës: {groove?.waveHeight}%</div> 
                                                          </>
                                                          : null
                                                        }
                                                    </div>
                                                </div>
                                            )): <div className="space-y-1">
                                                    <div className="font-semibold text-gray-900">Gravimi</div>
                                                     <div>Nuk ka gravime</div>
                                                </div>}

                                            {(item.configuration?.groovesAndEdges?.leftEdge.type !== "none" || item.configuration?.groovesAndEdges?.rightEdge.type !== "none") ? (
                                                <div className="space-y-1">
                                                    <div className="font-semibold text-gray-900">Skajet</div>
                                                    <div className="space-y-2">
                                                        {item.configuration?.groovesAndEdges?.leftEdge && (
                                                            <div className="space-y-0.5">
                                                                <div className="text-gray-600">Majtas:</div>
                                                                <div>Lloji: {item?.configuration?.groovesAndEdges?.leftEdge?.type}</div>
                                                                <div>Thellesia: {item?.configuration?.groovesAndEdges?.leftEdge?.depth}mm</div>
                                                                <div>Gjerësia: {item?.configuration?.groovesAndEdges?.leftEdge?.width}mm</div>
                                                                <div>Siperfaqja: {item?.configuration?.groovesAndEdges?.leftEdge?.surface}</div>
                                                            </div>
                                                        )}
                                                        {item.configuration?.groovesAndEdges?.rightEdge && (
                                                            <div className="space-y-0.5">
                                                                <div className="text-gray-600">Djathtas:</div>
                                                                <div>Lloji: {item?.configuration?.groovesAndEdges?.rightEdge?.type}</div>
                                                                <div>Thellesia: {item?.configuration?.groovesAndEdges?.rightEdge?.depth}mm</div>
                                                                <div>Gjerësia: {item?.configuration?.groovesAndEdges?.rightEdge?.width}mm</div>
                                                                <div>Siperfaqja: {item?.configuration?.groovesAndEdges?.rightEdge?.surface}</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ): <div className="space-y-1">
                                                    <div className="font-semibold text-gray-900">Skajet</div>
                                                     <div>Nuk ka skaje</div>
                                                </div>}

                                            {item.configuration?.engraving && (
                                                <div className="space-y-1">
                                                    <div className="font-semibold text-gray-900">Gravimi i tekstit</div>
                                                    {item?.configuration?.engraving?.text !== "" ? <div className="space-y-0.5">
                                                        <div>"{item?.configuration?.engraving?.text}"</div>
                                                        <div className="text-gray-600">{item?.configuration?.engraving?.fontFamily}</div>
                                                    </div> : <div>Nuk ka gravim te tekstit</div>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
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
      {/* Pagination */}
      <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
      />

    </div>
  );
}
