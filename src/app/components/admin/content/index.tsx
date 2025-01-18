'use client';
import React from 'react';

// Dashboard Content
export const DashboardContent = () => (
    <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to your admin dashboard. Select a section from the sidebar to manage your store.</p>
    </div>
);

// Products Content
export const ProductsContent = () => (
    <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">Products</h1>
        <p className="text-gray-600">Manage your products here.</p>
        {/* Add your products table/grid here */}
    </div>
);

// Categories Content
export const CategoriesContent = () => (
    <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">Categories</h1>
        <p className="text-gray-600">Manage your product categories here.</p>
        {/* Add your categories management UI here */}
    </div>
);

// Orders Content
export const OrdersContent = () => (
    <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">Orders</h1>
        <p className="text-gray-600">Manage your orders here.</p>
        {/* Add your orders table here */}
    </div>
);
