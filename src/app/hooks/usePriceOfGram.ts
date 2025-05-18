import { useState, useEffect } from 'react';
import PriceOfGramService from '../services/price-of-gram';
import { PriceOfGram } from '../types/price-of-gram.types';
import { toast } from 'react-hot-toast';
import AuthService from '../services/auth';

export const usePriceOfGram = () => {
    const [prices, setPrices] = useState<PriceOfGram>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const currentPrice = prices?.price || 0;

    const loadCurrentPrice = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Check authentication
            const user = await AuthService.getUserFromSession();
            if (!user) {
                toast.error('Please log in to view current gold prices');
                return;
            }

            // Fetch price data with retry logic
            let attempts = 0;
            const maxAttempts = 3;
            
            while (attempts < maxAttempts) {
                try {
                    const priceData = await PriceOfGramService.get();
                    if (!priceData) {
                        throw new Error('No price data available');
                    }

                    setPrices(priceData);
                    // Optional: Show success message on first load or significant price changes
                    if (!prices || Math.abs(prices.price - priceData.price) > 1) {
                        toast.success('Gold prices updated successfully');
                    }
                    return;
                } catch (e) {
                    attempts++;
                    if (attempts === maxAttempts) throw e;
                    // Wait before retry (exponential backoff)
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
                }
            }
        } catch (error) {
            const isAuthError = error instanceof Error && error.message === 'User not authenticated';
            const errorMessage = isAuthError
                ? 'Please log in to view prices'
                : 'Unable to load current gold prices. Please try again later.';
            
            setError(errorMessage);
            toast.error(errorMessage);
            console.error('Price loading error:', error);
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
