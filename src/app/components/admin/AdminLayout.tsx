'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { FiMenu } from 'react-icons/fi';

interface AdminLayoutProps {
    children: React.ReactNode;
    activePage: string;
    onPageChange: (page: string) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activePage, onPageChange }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex w-full h-screen bg-gray-100 fixed">
            {/* Mobile Menu Button */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-white shadow-lg"
            >
                <FiMenu className="w-6 h-6" />
            </button>

            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed lg:static inset-y-0 left-0 transform ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 transition duration-200 ease-in-out z-50 lg:z-0`}
            >
                <Sidebar 
                    activePage={activePage} 
                    onPageChange={(page) => {
                        onPageChange(page);
                        setIsSidebarOpen(false);
                    }}
                />
            </div>

            {/* Main Content */}
            <main className="flex-1 h-screen overflow-y-auto p-4 w-full">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
