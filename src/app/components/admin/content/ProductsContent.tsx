'use client';
import React, { useEffect, useState, useRef } from 'react';
import ProductsService from '@/app/services/products';
import CategoriesService from '@/app/services/categories';
import { CreateProduct, Product } from '@/app/types/product.types';
import { Category } from '@/app/types/category.types';
import { FaImage, FaTrash } from 'react-icons/fa';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import Pagination from '../Pagination';

const ProductsContent: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>({
        name: '',
        description: '',
        weight: '2-3',
        category: { id: '', name: '' },
        stock: 0,
        images: [],
        configuration: {
            selectedProfile: null,
            dimensions: {
                profileWidth: 0,
                profileHeight: 0,
                ringSize: '',
                ringSizeSystem: ''
            },
            preciousMetal: {
                colorType: '',
                colors: []
            },
            stoneSettings: {
                settingType: '',
                numberOfStones: 0
            },
            groovesAndEdges: {
                groove: [],
                leftEdge: {
                    type: ''
                },
                rightEdge: {
                    type: ''
                }
            },
            engraving: {
                text: '',
                fontFamily: 'Arial',
            },
            weight: 0
        }
    });
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(products.length / itemsPerPage);
    
    const fetchData = async () => {
        try {
            const [productsData, categoriesData] = await Promise.all([
                ProductsService.getAll(),
                CategoriesService.getAll()
            ]);
            const sortedProducts = productsData.sort((a, b) => new Date(String(b?.createdAt)).getTime() - new Date(String(a?.createdAt)).getTime());

            setProducts(sortedProducts);
            setCategories(categoriesData);
            setError(null);
        } catch (err) {
            setError('Marrja e té dhënave dështoi');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newPreviews: string[] = [];
            const newBase64Images: string[] = [];
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    toast.error('Madhësia e imazhit duhet të jetë më pak se 5 MB');
                    return;
                }
                
                if (!file.type.startsWith('image/')) {
                    toast.error('Ju lutem shtojni një imazh');
                    return;
                }

                try {
                    const base64String = await convertFileToBase64(file);
                    // Ensure the base64 string is complete and not split
                    if (base64String && base64String.startsWith('data:image/')) {
                        newPreviews.push(base64String);
                        newBase64Images.push(base64String);
                    }
                } catch (error) {
                    console.error('Error converting file to base64:', error);
                    toast.error('Gabim gjatë ngarkimit të imazhit');
                }
            }
            
            setImagePreviews(newPreviews);
            setSelectedImages(Array.from(files));
            setFormData(prev => ({ ...prev, images: newBase64Images }));
        }
    };

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleImageRemove = (index: number) => {
        const newPreviews = [...imagePreviews];
        const newImages = [...selectedImages];
        newPreviews.splice(index, 1);
        newImages.splice(index, 1);
        setImagePreviews(newPreviews);
        setSelectedImages(newImages);
        setFormData(prev => ({ ...prev, images: newPreviews }));
    };

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            toast.error('Emri i produktit është bosh');
            return false;
        }
        // if (!formData.description.trim()) {
        //     toast.error('Përshkrimi i produktit është bosh');
        //     return false;
        // }
        if (formData.weight <= '0') {
            toast.error('Pesha duhet të jetë ose një numër i vetëm (p.sh., "2") ose një varge (p.sh., "2-3")');
            return false;
        }
        if (formData.stock < 0) {
            toast.error('Stoku nuk mund të jetë negativ');
            return false;
        }
        if (!formData.category.id) {
            toast.error('Ju lutemi zgjidhni një kategori');
            return false;
        }
        return true;
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            weight: '2-3',
            category: { id: '', name: '' },
            stock: 0,
            images: [],
            configuration: {
                selectedProfile: null,
                dimensions: {
                    profileWidth: 0,
                    profileHeight: 0,
                    ringSize: '',
                    ringSizeSystem: ''
                },
                preciousMetal: {
                    colorType: '',
                    colors: []
                },
                stoneSettings: {
                    settingType: '',
                    numberOfStones: 0
                },
                groovesAndEdges: {
                    groove: [],
                    leftEdge: {
                        type: ''
                    },
                    rightEdge: {
                        type: ''
                    }
                },
                engraving: {
                    text: '',
                    fontFamily: 'Arial',
                },
                weight: 0
            }
        });
        setIsEditing(false);
        setSelectedProductId(null);
        setImagePreviews([]);
        setSelectedImages([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleEditClick = async (product: Product) => {
        try {
            const productData = await ProductsService.getById(String(product.id));
            setFormData({
                name: productData.name,
                description: productData.description,
                weight: productData.weight,
                category: productData.category,
                stock: productData.stock,
                images: productData.images || [],
                configuration: productData.configuration
            });
            // Set image preview if product has an image
            if (productData.images?.[0]) {
                setImagePreviews(productData.images);
            }
            setSelectedProductId(String(product.id));
            setIsEditing(true);
            // Scroll to form
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            toast.error('Marrja e produktit deshtoi');
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
            
            if (isEditing && selectedProductId) {
                // Update existing product
                await ProductsService.update(selectedProductId, formData);
                toast.success('Produkti u përditësua me sukses');
            } else {
                // Create new product
                const payload = {
                    product: formData,
                    categoryId: formData.category.id
                }   

                await ProductsService.create(payload as CreateProduct);
                toast.success('Produkti u shtua me sukses');
            }
            
            resetForm();
            fetchData(); // Refresh the list
        } catch (err) {
            console.error('Error creating product:', err);
            toast.error('Produkti nuk u shtua');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Jeni i sigurt që deshironi të fshini produktin?')) {
            try {
                setLoading(true);
                await ProductsService.delete(id);
                toast.success('Produkti u fshi me sukses');
                fetchData(); // Refresh the list
            } catch (err) {
                console.error('Error deleting product:', err);
                toast.error('Fshirja e produktit deshtoi');
            } finally {
                setLoading(false);
            }
        }
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
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
            <div className="bg-white rounded-lg border shadow p-4 lg:p-6">
                <h2 className="text-xl font-semibold mb-4 text-darkGray">
                    {isEditing ? 'Ndrysho produktin' : 'Shto produktin'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-darkGray mb-2">
                            Imazhet e produktit
                        </label>
                        <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                            {/* Image Previews */}
                            <div className="w-full lg:w-2/3 space-y-2">
                                {imagePreviews.length > 0 && (
                                    <div className="mt-2 grid grid-cols-5 gap-2">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative">
                                                <Image
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    width={100}
                                                    height={100}
                                                    className="w-32 h-32 object-cover rounded-md"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleImageRemove(index)}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    ref={fileInputRef}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full border lg:w-auto bg-gray-100 text-lightGray px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none"
                                >
                                    Kliko për zgjedhje të imazhit
                                </button>
                                <p className="text-sm text-darkGray">
                                    Maksimali mb: 5MB. Formatet e suportuar: JPG, PNG, GIF
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-darkGray">
                                Emri/Kodi unazes
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
                            <label htmlFor="category" className="block text-sm font-medium text-darkGray">
                                Kategoria
                            </label>
                            <select
                                id="category"
                                value={formData.category.id}
                                onChange={(e) => 
                                    setFormData({ 
                                        ...formData, 
                                        category: { 
                                            id: categories.find(cat => cat.id === e.target.value)?.id || '', 
                                            name: categories.find(cat => cat.id === e.target.value)?.name || ''
                                        } 
                                    })
                                }
                                className="mt-1 p-1 h-[40px] border block w-full text-lightGray rounded-md border-gray-300 shadow-sm"
                                required
                            >
                                <option value="">Zgjidh kategori</option>
                                {categories?.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* <div>
                        <label htmlFor="description" className="block text-sm font-medium text-darkGray">
                            Përshkrimi
                        </label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="mt-1 p-1 border block w-full text-lightGray rounded-md border-gray-300 shadow-sm"
                            rows={3}
                            required
                        />
                    </div> */}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="weight" className="block text-sm font-medium text-darkGray">
                                Pesha/gr
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-darkGray sm:text-sm">gr</span>
                                </div> */}
                                <input
                                    type="string"
                                    id="weight"
                                    value={formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                    className="pl-3 h-[40px] border text-lightGray block w-full rounded-md border-gray-300 shadow-sm"
                                    required
                                    placeholder='2-3'
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-darkGray">
                                Stoku
                            </label>
                            <input
                                type="number"
                                id="stock"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                className="mt-1 h-[40px] border ps-3 text-lightGray block w-full rounded-md border-gray-300 shadow-sm"
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? (isEditing ? 'Po përditësohet...' : 'Po krijohet...') : (isEditing ? 'Ndrysho Produktin' : 'Krijo Produktin')}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2"
                            >
                                Anulo modifikimin
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg border shadow overflow-hidden">
                <div className="p-4 lg:p-6">
                    <h2 className="text-xl font-semibold mb-4 text-darkGray">Produktet</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">
                                    Imazhi
                                </th>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">
                                    Emri
                                </th>
                                {/* <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">
                                    Përshkrimi
                                </th> */}
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">
                                    Pesha
                                </th>
                                <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">
                                    Stoku
                                </th>
                                <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">
                                    Kategoria
                                </th>
                                <th className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-darkGray uppercase tracking-wider">
                                    Veprimet
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems?.map((product) => (
                                <tr key={product.id}>
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                                        <div className="w-12 h-12 relative rounded-lg overflow-hidden">
                                            <Image
                                                src={product.images?.[0] || '/images/placeholder.jpg'}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-darkGray">{product.name}</div>
                                    </td>
                                    {/* <td className="hidden lg:table-cell px-6 py-4">
                                        <div className="text-sm text-darkGray line-clamp-2">{product.description}</div>
                                    </td> */}
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-darkGray">{product.weight}</div>
                                    </td>
                                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-darkGray">{product.stock}</div>
                                    </td>
                                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-darkGray">
                                            {categories.find(c => c.id === product.category.id)?.name}
                                        </div>
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEditClick(product)}
                                            className="text-blue-600 hover:text-blue-900 mr-2 lg:mr-4"
                                        >
                                            Ndrysho
                                        </button>
                                        <button
                                            onClick={() => handleDelete(String(product.id))}
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
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default ProductsContent;
