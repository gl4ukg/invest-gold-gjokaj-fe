'use client';
import React, { useState } from 'react';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import AdminLayout from '@/app/components/admin/AdminLayout';
import ProductsContent from '@/app/components/admin/content/ProductsContent';
import CategoriesContent from '@/app/components/admin/content/CategoriesContent';
import OrdersContent from '@/app/components/admin/content/OrdersContent';
import PriceOfGramContent from '@/app/components/admin/content/PriceOfGramContent';
import ResetPassword from '@/app/components/admin/content/ResetPassword';
import BlogsContent from '@/app/components/admin/content/BlogsContent';

const AdminPage: React.FC = () => {
    const [activePage, setActivePage] = useState('products');

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
            case 'blogs':
                return <BlogsContent />
            case 'reset-password':
                return <ResetPassword />
        }
    };

    return (
        <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
                <AdminLayout activePage={activePage} onPageChange={setActivePage}>
                    {renderContent()}
                </AdminLayout>
            </div>
        </ProtectedRoute>
    );
};

export default AdminPage;