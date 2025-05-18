'use client';

import { useState } from 'react';
import PriceOfGramService from '@/app/services/price-of-gram';
import { toast } from 'react-hot-toast';
import { usePriceOfGram } from '@/app/hooks/usePriceOfGram';

const PriceOfGramContent = () => {
    const { currentPrice, isLoading, reload: loadCurrentPrice } = usePriceOfGram();
    const [newPrice, setNewPrice] = useState<string>(currentPrice.toString());
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdatePrice = async () => {
        if (!newPrice || isNaN(Number(newPrice)) || Number(newPrice) <= 0) {
            toast.error('Ju lutem vendosni një vlerë të vlefshme');
            return;
        }

        try {
            setIsUpdating(true);
            await PriceOfGramService.create(Number(newPrice));
            toast.success('Price updated successfully');
            await loadCurrentPrice();
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update price');
            console.error('Error updating price:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold text-darkGray mb-6">Cmim i gramit</h1>
                
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-darkGray font-medium">Cmim i tani:</span>
                        <span className="text-xl font-bold text-darkGray">{currentPrice}€/g</span>
                    </div>
                </div>

                {isEditing ? (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="newPrice" className="block text-sm font-medium text-darkGray">
                                Cmim i ri (€/g)
                            </label>
                            <input
                                type="number"
                                id="newPrice"
                                value={newPrice}
                                onChange={(e) => setNewPrice(e.target.value)}
                                className="mt-1 block w-full rounded-md border p-1 border-darkGray shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-darkGray outline-darkGray outline-1"
                                placeholder="Vendos cmim i ri"
                                min="0"
                                step="0.01"
                                disabled={isUpdating}
                            />
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleUpdatePrice}
                                disabled={isUpdating}
                                className="inline-flex justify-center py-2 px-4 border border-darkGray shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {isUpdating ? 'Vendoset...' : 'Vendos'}
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setNewPrice(currentPrice.toString());
                                }}
                                disabled={isUpdating}
                                className="inline-flex justify-center py-2 px-4 border border-darkGray shadow-sm text-sm font-medium rounded-md text-darkGray bg-white hover:bg-darkGray focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                Anulo
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Vendos cmim
                    </button>
                )}
            </div>
        </div>
    );
};

export default PriceOfGramContent;