
-- Targeted coupons table - coupons assigned to specific customers
CREATE TABLE public.targeted_coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email TEXT NOT NULL,
  code TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'flat')),
  value NUMERIC NOT NULL,
  min_purchase NUMERIC NOT NULL DEFAULT 0,
  max_discount NUMERIC,
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  used BOOLEAN NOT NULL DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  message TEXT DEFAULT 'Special offer just for you!',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(code)
);

-- Enable RLS
ALTER TABLE public.targeted_coupons ENABLE ROW LEVEL SECURITY;

-- Policies: public read (filtered in app by email), admin manages
CREATE POLICY "Allow public read targeted_coupons" ON public.targeted_coupons FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert targeted_coupons" ON public.targeted_coupons FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update targeted_coupons" ON public.targeted_coupons FOR UPDATE TO public USING (true);
CREATE POLICY "Allow public delete targeted_coupons" ON public.targeted_coupons FOR DELETE TO public USING (true);

-- Add last_login tracking to user_profiles
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
