-- =============================================
-- LinguaStar Initial Migration
-- Run this in Supabase SQL Editor to set up the database
-- =============================================

-- 1. TABLES

CREATE TABLE IF NOT EXISTS public.books (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    file_path TEXT NOT NULL,
    cover_image_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
    payment_id TEXT UNIQUE,
    expiry_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, book_id)
);

CREATE TABLE IF NOT EXISTS public.admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. INDEXES

CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_book_id ON public.purchases(book_id);
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON public.admins(user_id);

-- 3. AUTO-UPDATE updated_at TRIGGER

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_books_updated_at
    BEFORE UPDATE ON public.books
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- 4. ROW LEVEL SECURITY

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- BOOKS: Anyone can read, only admins can write
CREATE POLICY "Books are viewable by everyone."
ON public.books FOR SELECT USING (true);

CREATE POLICY "Admins can insert books."
ON public.books FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update books."
ON public.books FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete books."
ON public.books FOR DELETE
USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- PURCHASES: Users can see their own, service role handles writes
CREATE POLICY "Users can view own purchases."
ON public.purchases FOR SELECT
USING (auth.uid() = user_id);

-- ADMINS: Admins can see the admins list
CREATE POLICY "Admins can view admins list."
ON public.admins FOR SELECT
USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- 5. STORAGE
-- Create the 'books' storage bucket (run via Supabase dashboard or API)
-- Bucket should be PRIVATE (not public)
-- Only service role can upload/read signed URLs
