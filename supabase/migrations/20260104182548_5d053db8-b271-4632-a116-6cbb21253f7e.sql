-- Enable REPLICA IDENTITY FULL for real-time updates on coupons table
ALTER TABLE public.coupons REPLICA IDENTITY FULL;