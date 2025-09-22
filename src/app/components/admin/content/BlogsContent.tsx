import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaTrash } from 'react-icons/fa';
import BlogsService from '@/app/services/blogs';
import { Blog, CreateBlog } from '@/app/types/blog.types';
import { useParams } from 'next/navigation';

export default function BlogsContent() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { locale } = useParams();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: { en: '', de: '', sq: '' },
    content: { en: '', de: '', sq: '' },
    slug: '',
    metaDescription: { en: '', de: '', sq: '' },
    image: ''
  });

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const data = await BlogsService.getAll();
      setBlogs(data);
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const base64String = e.target?.result as string;
          if (!base64String.startsWith('data:image/')) {
            alert('Invalid image format');
            return;
          }
          setFormData(prev => ({ ...prev, image: base64String }));
          setSelectedFile(file);
        } catch (error) {
          console.error('Error processing image:', error);
          alert('Failed to process image. Please try another one.');
        }
      };
      reader.onerror = () => {
        console.error('Error reading file');
        alert('Failed to read image file. Please try another one.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setSelectedFile(null);
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const blogData: CreateBlog = {
        title: formData.title,
        content: formData.content,
        slug: formData.slug,
        metaDescription: formData.metaDescription,
        image: formData.image
      };

      if (editingBlog) {
        await BlogsService.update(String(editingBlog.id), blogData);
      } else {
        await BlogsService.create(blogData);
      }
      // Reset form
      setEditingBlog(null);
      setSelectedFile(null);
      setFormData({
        title: { en: '', de: '', sq: '' },
        content: { en: '', de: '', sq: '' },
        slug: '',
        metaDescription: { en: '', de: '', sq: '' },
        image: ''
      });
      await loadBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Failed to save blog post. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await BlogsService.delete(String(id));
        loadBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Failed to delete blog post. Please try again.');
      }
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setSelectedFile(null);
    setFormData({
      title: blog.title,
      content: blog.content,
      slug: blog.slug,
      metaDescription: blog.metaDescription || { en: '', de: '', sq: '' },
      image: blog.image || ''
    });
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-darkGray">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-darkGray mb-4">
          {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h2>

        <form onSubmit={handleSubmit} className="mb-8 space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Image</h3>
            <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="w-full lg:w-2/3 space-y-2">
                {formData.image && (
                  <div className="relative w-32 h-32">
                    <img
                      src={formData.image}
                      alt="Blog image"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={handleImageRemove}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors duration-200"
                >
                  Upload Image
                </button>
              </div>
            </div>
          </div>

          {(['en', 'de', 'sq'] as const).map((lang) => (
            <div key={lang} className="space-y-2">
              <h3 className="text-lg font-semibold capitalize">{lang}</h3>
              <input
                type="text"
                placeholder={`Title (${lang})`}
                value={formData.title[lang as keyof typeof formData.title]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({
                  ...formData,
                  title: { ...formData.title, [lang]: e.target.value }
                })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary text-darkGray"
                required
              />
              <textarea
                placeholder={`Content (${lang})`}
                value={formData.content[lang as keyof typeof formData.content]}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({
                  ...formData,
                  content: { ...formData.content, [lang]: e.target.value }
                })}
                className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-primary focus:border-primary text-darkGray"
                required
              />
              <input
                type="text"
                placeholder={`Meta Description (${lang})`}
                value={formData.metaDescription[lang as keyof typeof formData.metaDescription]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({
                  ...formData,
                  metaDescription: { ...formData.metaDescription, [lang]: e.target.value }
                })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary text-darkGray"
              />
            </div>
          ))}

          <input
            type="text"
            placeholder="Slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary text-darkGray"
            required
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition duration-200"
            >
              {editingBlog ? 'Update' : 'Create'}
            </button>
            {editingBlog && (
              <button
                type="button"
                onClick={() => {
                  setEditingBlog(null);
                  setSelectedFile(null);
                  setFormData({
                    title: { en: '', de: '', sq: '' },
                    content: { en: '', de: '', sq: '' },
                    slug: '',
                    metaDescription: { en: '', de: '', sq: '' },
                    image: ''
                  });
                }}
                className="bg-gray text-darkGray px-6 py-2 rounded-lg hover:bg-opacity-90 transition duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-darkGray mb-4">Blog Posts</h2>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-darkGray uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {blog.image && (
                          <img 
                            src={blog.image}
                            alt={blog.title[locale as 'en' | 'de' | 'sq']}
                            className="h-12 w-12 object-cover rounded"
                          />
                        )}
                        <div className="text-sm font-medium text-darkGray">
                          {blog.title[locale as 'en' | 'de' | 'sq']}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-darkGray">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="bg-primary text-white px-3 py-1 rounded-lg hover:bg-opacity-90 transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-opacity-90 transition duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
