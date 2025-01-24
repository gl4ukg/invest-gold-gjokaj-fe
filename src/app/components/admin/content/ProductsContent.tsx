'use client';
import React, { useEffect, useState, useRef } from 'react';
import ProductsService from '@/app/services/products';
import CategoriesService from '@/app/services/categories';
import { CreateProduct, Product } from '@/app/types/product.types';
import { Category } from '@/app/types/category.types';
import { FaImage, FaTrash } from 'react-icons/fa';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

const ProductsContent: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>({
        name: '',
        description: '',
        price: 0,
        category: { id: '', name: '' },
        stock: 0,
        image: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const [productsData, categoriesData] = await Promise.all([
                ProductsService.getAll(),
                CategoriesService.getAll()
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
            setError(null);
        } catch (err) {
            setError('Failed to fetch data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error('Image size should be less than 5MB');
                return;
            }
            
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }

            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setError(null);
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

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            toast.error('Product name is required');
            return false;
        }
        if (!formData.description.trim()) {
            toast.error('Product description is required');
            return false;
        }
        if (formData.price <= 0) {
            toast.error('Price must be greater than 0');
            return false;
        }
        if (formData.stock < 0) {
            toast.error('Stock cannot be negative');
            return false;
        }
        if (!formData.category.id) {
            toast.error('Please select a category');
            return false;
        }
        return true;
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: 0,
            category: { id: '', name: '' },
            stock: 0,
            image: ''
        });
        setIsEditing(false);
        setSelectedProductId(null);
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleEditClick = async (product: Product) => {
        try {
            const productData = await ProductsService.getById(product.id!);
            setFormData({
                name: productData.name,
                description: productData.description,
                price: productData.price,
                category: productData.category,
                stock: productData.stock,
                image: productData.image || ''
            });
            // Set image preview if product has an image
            if (productData.image) {
                setImagePreview(productData.image);
            }
            setSelectedProductId(product.id!);
            setIsEditing(true);
            // Scroll to form
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            toast.error('Failed to fetch product details');
            console.error(error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
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

            const newProduct = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                price: Number(formData.price),
                category: formData.category,
                stock: Number(formData.stock),
                image: base64Image || formData.image
            };

            if (isEditing && selectedProductId) {
                // Update existing product
                await ProductsService.update(selectedProductId, newProduct);
                toast.success('Product updated successfully');
            } else {
                // Create new product
                const payload = {
                    product: newProduct,
                    categoryId: formData.category.id
                }   

                await ProductsService.create(payload as CreateProduct);
                toast.success('Product created successfully');
            }
            
            resetForm();
            fetchData(); // Refresh the list
        } catch (err) {
            console.error('Error creating product:', err);
            toast.error('Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                setLoading(true);
                await ProductsService.delete(id);
                toast.success('Product deleted successfully');
                fetchData(); // Refresh the list
            } catch (err) {
                console.error('Error deleting product:', err);
                toast.error('Failed to delete product');
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Create Product Form */}
            <div className="bg-white rounded-lg border shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-darkGray">
                    {isEditing ? 'Edit Product' : 'Create New Product'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-darkGray mb-2">
                            Product Image
                        </label>
                        <div className="flex items-center space-x-4">
                            <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                                {imagePreview ? (
                                    <>
                                        <Image
                                            src={imagePreview}
                                            alt="Product preview"
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleImageRemove}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                        <FaImage size={24} />
                                        <span className="text-xs mt-2">Upload Image</span>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="image-upload"
                            />
                            {!imagePreview && (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-gray-100 text-lightGray px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-text-darkGray focus:ring-offset-2"
                                >
                                    Choose File
                                </button>
                            )}
                        </div>
                        <p className="mt-2 text-sm text-darkGray">
                            Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
                        </p>
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-darkGray">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="mt-1 p-1 h-[40px] border block w-full text-lightGray rounded-md border-gray-300 shadow-sm "
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-darkGray">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="mt-1 p-1 border block w-full text-lightGray rounded-md border-gray-300 shadow-sm "
                            rows={3}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-darkGray">
                                Price
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-darkGray sm:text-sm">€</span>
                                </div>
                                <input
                                    type="number"
                                    id="price"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                    className="pl-7 h-[40px] border text-lightGray block w-full rounded-md border-gray-300 shadow-sm "
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-darkGray">
                                Stock
                            </label>
                            <input
                                type="number"
                                id="stock"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                className="mt-1 h-[40px] border ps-3 text-lightGray block w-full rounded-md border-gray-300 shadow-sm "
                                required
                                min="0"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-darkGray">
                            Category
                        </label>
                        <select
                            id="category"
                            value={formData.category.id}
                            onChange={(e) => 
                                setFormData({ 
                                    ...formData, 
                                    category: { 
                                        id: categories.find(cat => cat.id === e.target.value)?.id, 
                                        name: String(categories.find(cat => cat.id === e.target.value)?.name)
                                    } 
                                })
                            }
                            className="mt-1 h-[40px] border block w-full rounded-md border-gray-300 text-lightGray shadow-sm "
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Product' : 'Create Product')}
                    </button>
                    {isEditing && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="w-full mt-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2"
                        >
                            Cancel Edit
                        </button>
                    )}
                </form>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg border shadow">
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-darkGray">Products</h2>
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">
                                    Image
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="relative w-12 h-12">
                                            <Image
                                                src={product.image || '/images/placeholder.jpg'}
                                                alt={product.name}
                                                fill
                                                className="object-cover rounded-md"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-darkGray">{product.name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-darkGray line-clamp-2">{product.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-darkGray">€{product.price}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-darkGray">{product.stock}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-darkGray">
                                            {categories.find(c => c.id === product.category.id)?.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEditClick(product)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id!)}
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
            </div>
        </div>
    );
};

export default ProductsContent;
