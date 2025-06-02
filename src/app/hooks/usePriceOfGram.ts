import { useState, useEffect } from 'react';
import PriceOfGramService from '../services/price-of-gram';
import { PriceOfGram } from '../types/price-of-gram.types';
import { toast } from 'react-hot-toast';
import AuthService from '../services/auth';

const PRICE_CACHE_KEY = 'goldPriceCache';
const PRICE_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const REFRESH_INTERVAL = 60 * 1000; // 1 minute in milliseconds

export const usePriceOfGram = () => {
    const [prices, setPrices] = useState<PriceOfGram>(() => {
        // Initialize from cache if available
        const cached = localStorage.getItem(PRICE_CACHE_KEY);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < PRICE_CACHE_DURATION) {
                return data;
            }
        }
        return undefined;
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const currentPrice = prices?.price ?? 0; // Provide fallback of 0

    const loadCurrentPrice = async () => {
        try {
            setIsLoading(true);
            setError(null);

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
                    // Cache the price data
                    localStorage.setItem(PRICE_CACHE_KEY, JSON.stringify({
                        data: priceData,
                        timestamp: Date.now()
                    }));
                    // Optional: Show success message on first load or significant price changes
                    // if (!prices || Math.abs(prices.price - priceData.price) > 1) {
                    //     toast.success('Gold prices updated successfully');
                    // }
                    return;
                } catch (e) {
                    attempts++;
                    if (attempts === maxAttempts) throw e;
                    // Wait before retry (exponential backoff)
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
                }
            }
        } catch (error) {
            const errorMessage = 'Unable to load current gold prices. Please try again later.';
            
            setError(errorMessage);
            // toast.error(errorMessage);
            console.error('Price loading error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Initial load
        loadCurrentPrice();

        // Set up regular refresh interval
        const refreshInterval = setInterval(loadCurrentPrice, REFRESH_INTERVAL);

        return () => clearInterval(refreshInterval);
    }, []);

    return {
        currentPrice,
        isLoading,
        error,
        reload: loadCurrentPrice
    };
};
