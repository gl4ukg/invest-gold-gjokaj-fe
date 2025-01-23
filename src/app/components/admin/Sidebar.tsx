'use client';
import { useRouter } from '@/i18n/routing';
import React from 'react';
import { FiLogOut } from 'react-icons/fi';

interface SidebarProps {
    activePage: string;
    onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange }) => {
    const router = useRouter();
    const menuItems = [
        { name: 'Dashboard', id: 'dashboard' },
        { name: 'Products', id: 'products' },
        { name: 'Categories', id: 'categories' },
        { name: 'Orders', id: 'orders' }
    ];

    const handleLogout = () => {
        // Clear any auth tokens or user data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login page
        router.push('/login');
    };

    return (
        <div className="w-64 min-h-screen bg-white shadow-lg flex flex-col">
            <div className="flex-1 p-4">
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
            
            {/* Logout Button */}
            <div className="p-4 border-t">
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <FiLogOut className="w-5 h-5" />
                    <span>Log Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
