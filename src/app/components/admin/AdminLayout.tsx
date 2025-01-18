'use client';
import React from 'react';
import Sidebar from './Sidebar';

interface AdminLayoutProps {
    children: React.ReactNode;
    activePage: string;
    onPageChange: (page: string) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activePage, onPageChange }) => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar activePage={activePage} onPageChange={onPageChange} />
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
