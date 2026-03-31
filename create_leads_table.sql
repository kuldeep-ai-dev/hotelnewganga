-- Run this in your Supabase SQL Editor to instantly create the Lead Capture Marketing Architecture

CREATE TABLE public.hotel_leads (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  contact_value character varying NOT NULL,      -- Stores Email or Phone depending on form
  lead_type character varying NOT NULL,          -- Identifies 'Exit-Intent Newsletter' vs 'Blog Call Back'
  status character varying NOT NULL DEFAULT 'New', -- Easily track if staff has 'Contacted' them
  created_at timestamp with time zone NULL DEFAULT now(),
  
  CONSTRAINT hotel_leads_pkey PRIMARY KEY (id)
);

-- Turn on Row Level Security to protect customer data
ALTER TABLE public.hotel_leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous visitors to SUBMIT leads safely
CREATE POLICY "Enable public lead insertions" ON public.hotel_leads
  AS PERMISSIVE FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow authenticated admins to do everything (View, Update status to Contacted, Delete)
CREATE POLICY "Enable all access for authenticated admins" ON public.hotel_leads
  AS PERMISSIVE FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Instantly inject the WhatsApp routing key into your site configuration table to bypass Admin RLS constraints on initial insertion.
INSERT INTO public.site_content (content_key, content_value, description) 
VALUES ('whatsapp_number', '', 'Global WhatsApp business number for floating widget.')
ON CONFLICT (content_key) DO NOTHING;
