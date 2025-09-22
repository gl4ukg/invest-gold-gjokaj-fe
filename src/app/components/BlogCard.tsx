"use client";
import React from 'react';
import Link from 'next/link';
import { Blog } from '../types/blog.types';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface BlogCardProps {
  blog: Blog;
  locale: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, locale }) => {
  
  return (
    <Link href={`/${locale}/blog/${blog.slug}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        {blog.image && (
          <div className="w-full h-48 relative">
            <Image
              src={blog.image}
              alt={blog.title[locale as 'en' | 'de' | 'sq']}
              fill
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-tertiary mb-2 line-clamp-2">
            {blog.title[locale as 'en' | 'de' | 'sq']}
          </h2>
          
          <p className="text-lightGray mb-4 line-clamp-3">
            {blog.content[locale as 'en' | 'de' | 'sq']}
          </p>
          
          <div className="flex justify-between items-center text-sm text-primary">
            {/* <time className="text-lightGray" dateTime={blog.createdAt.toString()}>
              {new Date(blog.createdAt).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time> */}
            {/* <span className="text-lightGray">{new Date(blog.createdAt).toISOString().split('T')[0]}</span> */}
            <span className="hover:underline">Read more →</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
