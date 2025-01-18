'use client';
import React from 'react';

const DashboardContent: React.FC = () => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-semibold mb-4">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome to your admin dashboard. Select a section from the sidebar to manage your store.</p>
        </div>
    );
};

export default DashboardContent;
