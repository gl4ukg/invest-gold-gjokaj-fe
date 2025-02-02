'use client';

import React, { useEffect, useState, useRef } from 'react';
import CategoriesService from '@/app/services/categories';
import { Category } from '@/app/types/category.types';
import toast from 'react-hot-toast';
import Pagination from '../Pagination';
import { FaImage, FaTrash } from 'react-icons/fa';
import Image from 'next/image';

export default function CategoriesContent() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: ''
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Madhësia e imazhit duhet të jetë më pak se 5 MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                toast.error('Ju lutem shtojni një imazh');
                return;
            }
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageRemove = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setFormData(prev => ({ ...prev, image: '' }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            image: ''
        });
        setIsEditing(false);
        setSelectedCategoryId(null);
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleEditClick = async (category: Category) => {
        try {
            const categoryData = await CategoriesService.getById(category.id!);
            setFormData({
                name: categoryData.name,
                description: categoryData.description || '',
                image: categoryData.image || ''
            });
            if (categoryData.image) {
                setImagePreview(categoryData.image);
            }
            setSelectedCategoryId(category.id!);
            setIsEditing(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            toast.error('Marrja e kategorise deshtoi');
            console.error(error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Kategoria nuk mund te jete bosh');
            return;
        }

        try {
            setLoading(true);
            
            // Convert the image to base64 if selected
            let base64Image = '';
            if (selectedImage) {
                const reader = new FileReader();
                base64Image = await new Promise((resolve, reject) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(selectedImage);
                });
            }

            const categoryData = {
                ...formData,
                image: base64Image || formData.image
            };

            if (isEditing && selectedCategoryId) {
                await CategoriesService.update(selectedCategoryId, categoryData);
                toast.success('Kategoria u ndryshua me sukses');
            } else {
                await CategoriesService.create(categoryData);
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
                    <div>
                        <label className="block text-sm font-medium text-darkGray">
                            Imazhi
                        </label>
                        <div className="mt-1 flex items-center space-x-4">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 border rounded-md hover:bg-gray-50"
                            >
                                <FaImage className="w-5 h-5" />
                            </button>
                            {(imagePreview || formData.image) && (
                                <button
                                    type="button"
                                    onClick={handleImageRemove}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FaTrash className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        {(imagePreview || formData.image) && (
                            <div className="mt-2">
                                <Image
                                    src={imagePreview || formData.image}
                                    alt="Preview"
                                    width={100}
                                    height={100}
                                    className="rounded-md"
                                />
                            </div>
                        )}
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
                                <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">
                                    Imazhi
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
                                        <div className="text-sm text-darkGray">{category.description}</div>
                                    </td>
                                    <td className="hidden lg:table-cell px-6 py-4">
                                        {category.image && (
                                            <Image
                                                src={category.image}
                                                alt={category.name}
                                                width={50}
                                                height={50}
                                                className="rounded-md"
                                            />
                                        )}
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEditClick(category)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id!)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {categories.length > itemsPerPage && (
                    <div className="px-4 lg:px-6 py-3 flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}