'use client';
import React from 'react';

interface SidebarProps {
    activePage: string;
    onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange }) => {
    const menuItems = [
        { name: 'Dashboard', id: 'dashboard' },
        { name: 'Products', id: 'products' },
        { name: 'Categories', id: 'categories' },
        { name: 'Orders', id: 'orders' }
    ];

    return (
        <div className="w-64 min-h-screen bg-white shadow-lg">
            <div className="p-4">
                <h2 className="text-xl font-semibold mb-6">Admin Dashboard</h2>
                <nav>
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.id}>
                                <button 
                                    onClick={() => onPageChange(item.id)}
                                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                                        activePage === item.id
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-600 hover:bg-blue-50'
                                    }`}
                                >
                                    {item.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
