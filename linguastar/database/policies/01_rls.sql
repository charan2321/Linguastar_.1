-- Row Level Security Policies for LinguaStar

-- BOOKS POLICIES
-- Anyone can view books
CREATE POLICY "Books are viewable by everyone." 
ON public.books FOR SELECT 
USING (true);

-- Only admins can insert/update/delete books
CREATE POLICY "Admins can insert books." 
ON public.books FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update books." 
ON public.books FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete books." 
ON public.books FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- PURCHASES POLICIES
-- Users can view their own purchases
CREATE POLICY "Users can view own purchases." 
ON public.purchases FOR SELECT 
USING (auth.uid() = user_id);

-- System handles inserts/updates to purchases via backend bypass (Service Role)
-- but if we want users to insert via anon role (not recommended), we add it.
-- Backend should use Service Role to bypass RLS for purchases.

-- ADMINS POLICIES
-- Only admins can view the admins list
CREATE POLICY "Admins can view admins list." 
ON public.admins FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));
