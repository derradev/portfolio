import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogPostClient from './BlogPostClient'

interface PageProps {
  params: {
    slug: string
  }
}

async function getBlogPost(slug: string) {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
      ? `${process.env.NEXT_PUBLIC_API_URL}/api` 
      : 'https://api.william-malone.com/api'
    
    const response = await fetch(`${API_BASE_URL}/blog/${slug}`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data.success ? data.data : null
  } catch (error) {
    console.error('Failed to fetch blog post:', error)
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug)
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The blog post you are looking for does not exist.'
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://william-malone.com'
  const url = `${siteUrl}/blog/${params.slug}`
  const title = `${post.title} | William Malone`
  const description = post.excerpt || 'Read this blog post by William Malone'
  const author = post.author || 'William Malone'

  return {
    title,
    description,
    authors: [{ name: author }],
    keywords: post.tags ? (Array.isArray(post.tags) ? post.tags : JSON.parse(post.tags || '[]')) : [],
    openGraph: {
      title,
      description,
      url,
      siteName: 'William Malone',
      type: 'article',
      publishedTime: post.publish_date || post.created_at,
      authors: [author],
      tags: post.tags ? (Array.isArray(post.tags) ? post.tags : JSON.parse(post.tags || '[]')) : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '',
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getBlogPost(params.slug)
  
  if (!post) {
    notFound()
  }

  return <BlogPostClient slug={params.slug} />
}
