import React from 'react';
import { Metadata } from 'next';
import BlogsService from '@/app/services/blogs';
import { getTranslations } from 'next-intl/server';
import BlogCard from '@/app/components/BlogCard';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t('blog.pageTitle'),
    description: t('blog.description'),
    alternates: {
      canonical: `/blog`,
      languages: {
        'en': '/en/blog',
        'de': '/de/blog',
        'sq': '/sq/blog',
      },
    },
  };
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const blogs = await BlogsService.getAll();

  return (
    <main className="container mx-auto px-4 py-32">
      <h1 className="text-4xl font-bold text-tertiary mb-8">{t("title")}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} locale={locale} />
        ))}
      </div>
      
      {blogs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
            <svg
              className="mx-auto h-16 w-16 text-primary mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-tertiary mb-2">{t("emptyState.title")}</h3>
            <p className="text-lightGray mb-4">
              {t("emptyState.description")}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
