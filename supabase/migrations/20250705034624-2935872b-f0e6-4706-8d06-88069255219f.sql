
-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Cargos', 'Jackets', 'T-Shirts')),
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  images TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  coupon_code TEXT,
  customer_info JSONB NOT NULL,
  payment_proof TEXT,
  status TEXT NOT NULL DEFAULT 'Processing' CHECK (status IN ('Processing', 'Packed', 'Out for Delivery', 'Delivered')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create coupons table
CREATE TABLE public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'flat')),
  value DECIMAL(10,2) NOT NULL,
  max_usages INTEGER NOT NULL DEFAULT 1,
  current_usages INTEGER NOT NULL DEFAULT 0,
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create settings table for QR codes and other app settings
CREATE TABLE public.app_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access for now (you can make these more restrictive later)
CREATE POLICY "Allow public read access on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public write access on products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on products" ON public.products FOR DELETE USING (true);

CREATE POLICY "Allow public read access on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public write access on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on orders" ON public.orders FOR DELETE USING (true);

CREATE POLICY "Allow public read access on coupons" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Allow public write access on coupons" ON public.coupons FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on coupons" ON public.coupons FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on coupons" ON public.coupons FOR DELETE USING (true);

CREATE POLICY "Allow public read access on app_settings" ON public.app_settings FOR SELECT USING (true);
CREATE POLICY "Allow public write access on app_settings" ON public.app_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on app_settings" ON public.app_settings FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on app_settings" ON public.app_settings FOR DELETE USING (true);

-- Enable realtime for all tables
ALTER TABLE public.products REPLICA IDENTITY FULL;
ALTER TABLE public.orders REPLICA IDENTITY FULL; 
ALTER TABLE public.coupons REPLICA IDENTITY FULL;
ALTER TABLE public.app_settings REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.coupons;
ALTER PUBLICATION supabase_realtime ADD TABLE public.app_settings;
