-- Run this in your Supabase SQL Editor to allow the Admin Panel to see the data

-- 1. Allow public (unauthenticated) read access to Bookings
CREATE POLICY "Allow public select from bookings" ON public.bookings FOR SELECT TO public USING (true);

-- 2. Allow public (unauthenticated) read access to Restaurant Reservations
CREATE POLICY "Allow public select from restaurant_reservations" ON public.restaurant_reservations FOR SELECT TO public USING (true);

-- 3. Allow public (unauthenticated) read access to Corporate Inquiries
CREATE POLICY "Allow public select from corporate_inquiries" ON public.corporate_inquiries FOR SELECT TO public USING (true);
