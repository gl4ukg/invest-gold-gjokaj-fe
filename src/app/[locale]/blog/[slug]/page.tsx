import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogsService from '@/app/services/blogs';

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const blog = await BlogsService.getBySlug(slug);
    const title = blog.title[locale as 'en' | 'de' | 'sq'];
    const description = blog.metaDescription?.[locale as 'en' | 'de' | 'sq'] || 
                       blog.content[locale as 'en' | 'de' | 'sq'].substring(0, 160);

    return {
      title,
      description,
      alternates: {
        canonical: `/blog/${slug}`,
        languages: {
          'en': `/en/blog/${slug}`,
          'de': `/de/blog/${slug}`,
          'sq': `/sq/blog/${slug}`,
        },
      },
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime: blog.createdAt.toString(),
        modifiedTime: blog.updatedAt.toString(),
        locale,
        alternateLocale: ['en', 'de', 'sq'].filter(l => l !== locale),
      },
    };
  } catch (error) {
    return {
      title: 'Blog Post Not Found',
    };
  }
}

export default async function BlogPost({ params }: PageProps) {
  const { locale, slug } = await params;
  try {
    const blog = await BlogsService.getBySlug(slug);

    return (
      <article className="container mx-auto px-4 pt-32 pb-16 max-w-4xl">
        {blog.image && (
          <div className="w-full h-[400px] mb-8 relative rounded-lg overflow-hidden">
            <img
              src={blog.image}
              alt={blog.title[locale as 'en' | 'de' | 'sq']}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-darkGray mb-4">
            {blog.title[locale as 'en' | 'de' | 'sq']}
          </h1>
          <time className="text-lightGray" dateTime={blog.createdAt.toString()}>
            {new Date(blog.createdAt).toLocaleDateString(locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </header>

        <div className="prose prose-lg max-w-none">
          {blog.content[locale as 'en' | 'de' | 'sq']
            .split('\n')
            .map((paragraph, index) => (
              <p key={index} className="mb-4 text-darkGray">
                {paragraph}
              </p>
            ))}
        </div>
      </article>
    );
  } catch (error) {
    notFound();
  }
}
