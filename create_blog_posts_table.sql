-- Run this in your Supabase SQL Editor to instantly create the robust CMS Database Architecture

CREATE TABLE public.blog_posts (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  title character varying NOT NULL,
  slug character varying NOT NULL,
  excerpt text NULL,
  content text NOT NULL,
  featured_image_url text NULL,
  
  -- SEO Configuration
  meta_title character varying NULL,
  meta_description character varying NULL,
  keywords character varying NULL,
  
  -- State flags
  is_published boolean NOT NULL DEFAULT false,
  author character varying NOT NULL DEFAULT 'Admin',
  
  -- Time Tracking
  published_at timestamp with time zone NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  
  CONSTRAINT blog_posts_pkey PRIMARY KEY (id),
  CONSTRAINT blog_posts_slug_key UNIQUE (slug)
);

-- Turn on Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to PUBLISHED blogs only
CREATE POLICY "Enable read access for all users on published blocks" ON public.blog_posts
  AS PERMISSIVE FOR SELECT
  TO public
  USING ((is_published = true));

-- Allow authenticated admins to do everything
CREATE POLICY "Enable all access for authenticated admins" ON public.blog_posts
  AS PERMISSIVE FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Helpful indexing for lighting-fast loading speeds on the slugs
CREATE INDEX idx_blog_posts_slug ON public.blog_posts USING btree (slug);
