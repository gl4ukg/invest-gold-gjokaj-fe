'use client';
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import AuthService from '@/app/services/auth';
import AdminLayout from '@/app/components/admin/AdminLayout';
import ProductsContent from '@/app/components/admin/content/ProductsContent';
import CategoriesContent from '@/app/components/admin/content/CategoriesContent';
import OrdersContent from '@/app/components/admin/content/OrdersContent';
import PriceOfGramContent from '@/app/components/admin/content/PriceOfGramContent';

const AdminPage: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activePage, setActivePage] = useState('products');

    useEffect(() => {
        const checkAuth = async () => {
            const user = await AuthService.getUserFromSession();
            setIsAuthenticated(!!user);
        };
        
        checkAuth();
    }, []);

    const renderContent = () => {
        switch (activePage) {
            case 'products':
                return <ProductsContent />;
            case 'categories':
                return <CategoriesContent />;
            case 'orders':
                return <OrdersContent />;
            case 'price-of-gram':
                return <PriceOfGramContent />
        }
    };

    return (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
            <div className="flex h-screen bg-gray-100">
                <AdminLayout activePage={activePage} onPageChange={setActivePage}>
                    {renderContent()}
                </AdminLayout>
            </div>
        </ProtectedRoute>
    );
};

export default AdminPage;