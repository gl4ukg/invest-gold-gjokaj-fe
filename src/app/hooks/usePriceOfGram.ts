import { useState, useEffect } from 'react';
import PriceOfGramService from '../services/price-of-gram';
import { PriceOfGram } from '../types/price-of-gram.types';
import { toast } from 'react-hot-toast';

export const usePriceOfGram = () => {
    const [prices, setPrices] = useState<PriceOfGram>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const currentPrice = prices?.price || 0;

    const loadCurrentPrice = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const priceData = await PriceOfGramService.get();
            setPrices(priceData);
        } catch (error) {
            const errorMessage = 'Failed to load current price';
            setError(errorMessage);
            toast.error(errorMessage);
            console.error('Error loading price:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCurrentPrice();
    }, []);

    return {
        currentPrice,
        isLoading,
        error,
        reload: loadCurrentPrice
    };
};
