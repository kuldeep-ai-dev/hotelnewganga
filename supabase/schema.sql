-- Supabase Schema for Hotel New Ganga

-- 1. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT NOT NULL,
    room_category TEXT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Restaurant Reservations Table
CREATE TABLE IF NOT EXISTS public.restaurant_reservations (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    guest_name TEXT NOT NULL,
    guest_email TEXT,
    guest_phone TEXT NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    party_size INT NOT NULL,
    special_requests TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Corporate Inquiries Table
CREATE TABLE IF NOT EXISTS public.corporate_inquiries (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    company_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    details TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'contacted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. SEO Metadata Table for Dynamic Open Graph / Meta tags
CREATE TABLE IF NOT EXISTS public.seo_metadata (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    page_path TEXT NOT NULL UNIQUE, -- e.g. '/', '/rooms', '/restaurant'
    meta_title TEXT NOT NULL,
    meta_description TEXT NOT NULL,
    keywords TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initial SEO Data Seeding
INSERT INTO public.seo_metadata (page_path, meta_title, meta_description, keywords)
VALUES 
    ('/', 'Hotel New Ganga | Premium Stays near Nemcare & GMCH Guwahati', 'Experience comfort and premium service at Hotel New Ganga, Bhangagarh. Located near Nemcare Hospital and GMCH on G.S. Road, Guwahati.', 'hotel guwahati, hotel near nemcare, hotel near gmch, budget hotel bhangagarh'),
    ('/rooms', 'Premium Rooms & Suites | Hotel New Ganga Guwahati', 'Explore our Deluxe, Superior, and Superior Triple rooms featuring soundproofing, premium bedding, and modern amenities for medical transit and corporate stays.', 'guwahati hotel rooms, deluxe room guwahati, family room near gmch'),
    ('/restaurant', 'Restaurant & Table Reservation | Hotel New Ganga', 'Dine at our in-house multi-cuisine restaurant. Local and continental flavors. Reserve your table online.', 'restaurant bhangagarh, hotel food guwahati, table reservation guwahati'),
    ('/corporate', 'Corporate Bookings & Extended Stays | Hotel New Ganga', 'Specialized corporate rates and extended stay packages for business travelers in Guwahati. Contact us for group bookings.', 'corporate hotel guwahati, extended stay guwahati, business hotel g.s. road')
ON CONFLICT (page_path) DO NOTHING;

-- Set up Row Level Security (RLS)
-- Allow public insert for bookings, reservations, and inquiries so people can submit forms without logging in
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to bookings" ON public.bookings FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public insert to restaurant_reservations" ON public.restaurant_reservations FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public insert to corporate_inquiries" ON public.corporate_inquiries FOR INSERT TO public WITH CHECK (true);

-- Allow public read of SEO metadata
CREATE POLICY "Allow public read of seo_metadata" ON public.seo_metadata FOR SELECT TO public USING (true);

-- Super admin access (requires authenticated users to be set up)
CREATE POLICY "Allow authenticated full access to bookings" ON public.bookings FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access to reservations" ON public.restaurant_reservations FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access to inquiries" ON public.corporate_inquiries FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access to seo_metadata" ON public.seo_metadata FOR ALL TO authenticated USING (true);
