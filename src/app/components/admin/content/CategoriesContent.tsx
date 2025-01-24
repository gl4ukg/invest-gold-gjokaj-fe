'use client';

import React, { useEffect, useState } from 'react';
import CategoriesService from '@/app/services/categories';
import { Category } from '@/app/types/category.types';
import toast from 'react-hot-toast';
import Pagination from '../Pagination';

export default function CategoriesContent() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(categories.length / itemsPerPage);

    const fetchCategories = async () => {
        try {
            const data = await CategoriesService.getAll();
            setCategories(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch categories');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const resetForm = () => {
        setFormData({
            name: '',
            description: ''
        });
        setIsEditing(false);
        setSelectedCategoryId(null);
    };

    const handleEditClick = async (category: Category) => {
        try {
            const categoryData = await CategoriesService.getById(category.id!);
            setFormData({
                name: categoryData.name,
                description: categoryData.description || ''
            });
            setSelectedCategoryId(category.id!);
            setIsEditing(true);
            // Scroll to form
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            toast.error('Marrja e kategorise deshtoi');
            console.error(error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.name.trim()) {
                toast.error('Kategoria nuk mund te jete bosh');
                return;
            }

            if (isEditing && selectedCategoryId) {
                // Update existing category
                await CategoriesService.update(selectedCategoryId, formData);
                toast.success('Kategoria u ndryshua me sukses');
            } else {
                // Create new category
                await CategoriesService.create(formData as Category);
                toast.success('Kategoria u krijua me sukses');
            }

            resetForm();
            fetchCategories();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'An error occurred');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('A jeni i sigurt qe deshironi te fshini kategorin?')) {
            try {
                await CategoriesService.delete(id);
                toast.success('Kategoria u fshi me sukses');
                fetchCategories();
            } catch (error) {
                toast.error('Deshtoi fshirja e kategorise');
                console.error(error);
            }
        }
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="space-y-6">
            {/* Create/Edit Category Form */}
            <div className="bg-white rounded-lg border shadow p-4 lg:p-6">
                <h2 className="text-xl font-semibold mb-4 text-darkGray">
                    {isEditing ? 'Edit Category' : 'Create New Category'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-darkGray">
                            Emri
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="mt-1 p-1 h-[40px] border block w-full text-lightGray rounded-md border-gray-300 shadow-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-darkGray">
                            Pershkrimi
                        </label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="mt-1 p-1 border block w-full text-lightGray rounded-md border-gray-300 shadow-sm"
                            rows={3}
                        />
                    </div>
                    <div className="flex flex-col lg:flex-row gap-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? (isEditing ? 'Po ndryshon...' : 'Po krijohet...') : (isEditing ? 'Ndrysho kategorin' : 'Krijo kategorin')}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2"
                            >
                                Anulo
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-lg border shadow overflow-hidden">
                <div className="p-4 lg:p-6">
                    <h2 className="text-xl font-semibold mb-4 text-darkGray">Kategorite</h2>
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">
                                    Emri
                                </th>
                                <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">
                                    Pershkrimi
                                </th>
                                <th className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-darkGray uppercase tracking-wider">
                                    Veprimet
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((category) => (
                                <tr key={category.id}>
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-darkGray">{category.name}</div>
                                    </td>
                                    <td className="hidden lg:table-cell px-6 py-4">
                                        <div className="text-sm text-darkGray line-clamp-2">{category.description}</div>
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEditClick(category)}
                                            className="text-blue-600 hover:text-blue-900 mr-2 lg:mr-4"
                                        >
                                            Ndrysho
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id!)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Fshij
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 lg:p-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
}